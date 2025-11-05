const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
    {
        items :[{
            product: {
               type:mongoose.Schema.Types.ObjectId,
               ref:'Product',
               required:true
           },
            quantity :{
               type:Number,
               required:true,
               min:[1,'It cannot be less than 1.'],
               default:1
          }
        }],
        user : {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required: true,
            unique: true
        }

    },
    {timestamps:true}
);

module.exports =  mongoose.model('Cart',cartSchema);