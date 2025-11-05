const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'name is required'],
        trim: true
    },
    description:{
        type:String,
        required:[true,'description is required']
    },
    price:{
        type:Number,
        required:[true,'price is required'],
        min:0
    },
    oldPrice: { 
        type: Number, 
        default: null 
    },
    category:{
        type:String,
        required: [true, 'category is required'],
        enum:['Seeds','Fertilizers','Soil','Tools'],
        trim: true
    },
    imagesUrl:{
       type: [String],
       default: []
    },
    stock:{
        type: Number,
        required: [true,'stock is required'],
        default:0
    },
    averageRating: {
        type: Number,
        default: 0,
        min: 1,
        max: 5
     },
    numOfReviews: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    }

}, 
{timestamps:true})

module.exports = mongoose.model('Product',productSchema);