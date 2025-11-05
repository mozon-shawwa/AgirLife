const createError = require('http-errors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { returnJson } = require('../my-modules/json-response');


const createPaymentIntent = async (req, res, next) => {
  try {
    const { amount, orderId } = req.body;

    if (!amount || !orderId) {
      return next(createError(400, 'amount and orderId are required.'));
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: { order_id: orderId }
    });

    returnJson( res, 200, true, { clientSecret: paymentIntent.client_secret },
         'Payment Intent Created Successfully'
    );

  } catch (error) {
    console.log(error);
    return next(createError(500, 'Error In Create Payment Intent.'));
  }
};


const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook signature verification failed:`, err.message);
    return res.sendStatus(400);
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata.order_id;

      console.log(`Payment succeeded for order ${orderId}`);

      try {
        const order = await Order.findById(orderId);
        if (!order) {
          console.log(`Order ${orderId} not found`);
          return res.send();
        }

        order.paymentStatus = 'Paid';
        order.paymentId = paymentIntent.id;
        order.shippingStatus = 'Processing';
        await order.save();

        for (const item of order.products) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: -item.quantity }
          });
        }

        const cart = await Cart.findOne({ user: order.buyer });
        if (cart) {
          cart.items = [];
          await cart.save();
        }

        console.log(`Order ${orderId} updated successfully.`);

      } catch (dbError) {
        console.error('Error updating database for order:', orderId, dbError);
        return res.sendStatus(500);
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntentFailed = event.data.object;
      const failedOrderId = paymentIntentFailed.metadata.order_id;

      console.log(`Payment failed for order ${failedOrderId}`);
      await Order.findByIdAndUpdate(failedOrderId, { paymentStatus: 'Failed' });
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.send();
};


module.exports = { createPaymentIntent, handleStripeWebhook };
