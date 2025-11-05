const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Story title is required']
  },
  content: {
    type: String,
    required: [true, 'Story content is required']
  },
  author: {
     type: mongoose.Schema.Types.ObjectId,
     ref: 'User',
     required: true
  },
  imageUrl: {
    type: String
  },
  views: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Story', storySchema);
