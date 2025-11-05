const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const {returnJson} = require('../my-modules/json-response');
const createError = require('http-errors');

const createOrder = async (req,res,next)=>{
    try {
        const userId = req.user.id;
        const { billingDetails, paymentMethod} = req.body;

        const cart = await Cart.findOne({user : userId}).populate('items.product');
        if(!cart || cart.items.length === 0){
            return next(createError(404,'Not Found Cart For you.'))
        }

        const subtotal = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        const shippingCost=10;
        const total = subtotal + shippingCost;

        const orderProducts = cart.items.map(item => {
        return {
             product: item.product._id, 
             quantity: item.quantity, 
             price: item.product.price 
             };
        });
       
        const order = new Order ({buyer:userId,products:orderProducts,subtotal,shippingCost,
              total ,billingDetails,paymentMethod, paymentStatus: paymentMethod === 'Online' ? 'Pending' : 'Paid',
               shippingStatus:'Pending'
        });
        await order.save();

          cart.items = [];
         await cart.save();

        if (paymentMethod === 'Online') {
               const paymentIntent = await stripe.paymentIntents.create({
               amount: Math.round(total * 100), 
               currency: 'usd',
               automatic_payment_methods: { enabled: true },
               metadata: { order_id: order._id.toString() }
        });

       return returnJson(res, 201, true, { orderId: order._id,clientSecret: paymentIntent.client_secret },
         'Order created and payment initiated.');
    }

    return returnJson(res, 201, true, order, 'Order created successfully (Cash on Delivery).');


    }catch (error) {
        console.log(error);
        return next(createError(500,'Error In Create Order.'));
    }

};

const getAllOrders = async (req,res,next)=>{
    try {
        const orders = await Order.find({})
                                  .populate("buyer","userName  email")
                                  .populate("products.product","name price")
                                  .sort("-createdAt");

        returnJson(res,200,true,orders,'Fetched  All Orders Successfully.');


    }catch (error) {
        console.log(error);
        return next(createError(500,'Error In Get Orders.'));
    }
};

const getMyOrders = async(req,res,next)=>{
    try {
        const userId = req.user.id;
        const orders = await Order.find({buyer:userId})
                                  .populate("buyer","userName  email")
                                  .populate("products.product","name price")
                                  .sort("-createdAt");

        returnJson(res,200,true,orders,'Fetched Your Orders Successfully.');
    }catch (error) {
        console.log(error);
        return next(createError(500,'Error In Get Your Orders.'));
    }

};

const updateOrderStatus = async(req,res,next)=>{
    try {
        const orderId = req.params.id;
        const {status} = req.body;
    
        const order = await Order.findByIdAndUpdate(orderId,{shippingStatus:status},{new:true,runValidators: true});

        if (!order) {
            return next(createError(404, 'Order Not Found.'));
        }

        returnJson(res,200,true,order,'order status updated successfully.')
    }catch (error) {

        if (error.name === 'ValidationError') {
                return next(createError(400, error.message));
        }
        console.log(error);
        return next(createError(500,'Error In Update Order Status.'));
    }

};

const getOrderById  = async(req,res,next)=>{
    try {
        const userId = req.user.id;
        const orderId = req.params.id;
        const order = await Order.findOne({buyer:userId,_id:orderId})
                                  .populate("buyer","userName  email")
                                  .populate("products.product","name price");

        returnJson(res,200,true,order,'Get  Order Successfully.'); 
    }catch (error) {
        console.log(error);
        return next(createError(500,'Error In get spacific order.'));
    }
 
};

module.exports = {createOrder,getAllOrders,getMyOrders,updateOrderStatus,getOrderById };