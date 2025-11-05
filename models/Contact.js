const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
    type: String,
    required: [true, 'Name is required']
   },
   email: {
    type: String,
    required: [true, 'Email is required'],
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
   },
   phone: {
    type: String,
  },
  company:{
    type:String,
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  isRead: {
    type: Boolean,
    default: false
  }
},
{timestamps:true});

module.exports = mongoose.model('Contact',contactSchema);