const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }],

    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subtotal: {
      type: Number,
      required: true
    },
    shippingCost: {
      type: Number,
      default: 10
    },
    total: {
      type: Number,
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ['Online', 'Cash on Delivery'],
      required: true
    },
    billingDetails: {
      firstName: String,
      lastName: String,
      phone: String,
      alternateMobile: String,
      email: String,
      country: String,
      address: String,
      notes: String
    },
    shippingStatus: {
        type: String,
        enum: ['Pending', 'Shipped', 'Delivered'],
        default: 'Pending'
    },
    paymentStatus: {
       type: String,
       enum: ['Pending', 'Paid', 'Failed'],
       default: 'Pending'
    },
    paymentId: {
        type: String
    }

}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
