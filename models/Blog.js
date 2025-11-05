const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
   title: {
    type: String,
    required: [true, 'Title is required']
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  category: {
    type: String,
    enum: ['Tips', 'Farming', 'News', 'Other'],
    default: 'Other'
  },
  imageUrl: {
    type: String
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comments: [
    {
      name: { 
        type: String,
        required: true 
      },
      email: { 
        type: String,
        required: true
      },
      comment: { 
        type: String,
        required: true 
      },
      createdAt: { 
        type: Date,
        default: Date.now
      }
    }
  ],
  views: {
    type: Number,
    default: 0
  }

},
{timestamps: true});

module.exports = mongoose.model('Blog',blogSchema);