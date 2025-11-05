const Story = require('../models/Story');
const createError = require('http-errors');
const { returnJson } = require('../my-modules/json-response');
const cloudinary = require('../config/cloudinaryConfig');
const streamifier = require('streamifier');


const createStory = async (req, res, next) => {
  try {
    const authorId = req.user.id;
    const { title, content } = req.body;

    if (!title || !content) {
      return next(createError(400, 'Title and content are required.'));
    }

    const story = new Story({
      title,
      content,
      author: authorId
    });

    await story.save();
    returnJson(res, 201, true, story, 'Story created successfully.');

  } catch (error) {
    console.log(error);
    return next(createError(500, 'Error in creating story.'));
  }
};


const updateStory = async (req, res, next) => {
  try {
    const storyId = req.params.id;
    const { title, content } = req.body;

    const story = await Story.findByIdAndUpdate(storyId,{ title, content },
        { new: true, runValidators: true }
    );

    if (!story){
         return next(createError(404, 'Story not found.'));
    }

    returnJson(res, 200, true, story, 'Story updated successfully.');

  } catch (error) {
    console.log(error);
    return next(createError(500, 'Error in updating story.'));
  }
};


const deleteStory = async (req, res, next) => {
  try {
    const storyId = req.params.id;
    const story = await Story.findByIdAndDelete(storyId);

    if (!story) {
        return next(createError(404, 'Story not found.'));
    }

    returnJson(res, 200, true, story, 'Story deleted successfully.');

  } catch (error) {
    console.log(error);
    return next(createError(500, 'Error in deleting story.'));
  }
};


const getAllStories = async (req, res, next) => {
  try {
    const stories = await Story.find().populate('author', 'userName email').sort('-createdAt');

    returnJson(res, 200, true, stories, 'Fetched all stories successfully.');

  } catch (error) {
    console.log(error);
    return next(createError(500, 'Error in getting stories.'));
  }
};


const getStoryById = async (req, res, next) => {
  try {
    const storyId = req.params.id;
    const story = await Story.findById(storyId).populate('author', 'userName email');

    if (!story){
         return next(createError(404, 'story not found.'));
    }
    
    story.views += 1;
    await story.save();

    returnJson(res, 200, true, story, 'Fetched story successfully.');

  } catch (error) {
    console.log(error);
    return next(createError(500, 'Error in getting story by id.'));
  }
};


const uploadStoryImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(createError(400, 'No image provided.'));
    }

    const storyId = req.params.id;
    const story = await Story.findById(storyId);
    if (!story) {
      return next(createError(404, 'Story not found.'));
    }

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'agirlife-stories',
          public_id: `story_${story._id}_${Date.now()}`
        },
        (err, result) => {
          if (err){
             reject(err);
          }else{
            resolve(result);
          } 
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    });

    story.imageUrl = result.secure_url;
    await story.save();

    returnJson(res, 200, true, story, 'Story image uploaded successfully.');

  } catch (error) {
    console.log(error);
    return next(createError(500, 'Error uploading story image.'));
  }
};


module.exports = {createStory,updateStory,deleteStory,getAllStories,getStoryById,uploadStoryImage};
