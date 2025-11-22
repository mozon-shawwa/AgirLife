const Blog = require('../models/Blog');
const createError = require('http-errors');
const { returnJson } = require('../my-modules/json-response');
const cloudinary = require('../config/cloudinaryConfig');
const streamifier = require('streamifier');


const createBlog = async (req, res, next) => {
  try {
    const authorId = req.user.id;
    const { title, content, category } = req.body;

    if (!title || !content) {
      return next(createError(400, 'Title and content are required.'));
    }

    const blog = new Blog({
      title,
      content,
      category,
      author: authorId
    });

    await blog.save();
    returnJson(res, 201, true, blog, 'Blog created successfully.');

  } catch (error) {
    console.log(error);
    return next(createError(500, 'Error in creating blog.'));
  }
};


const updateBlog = async (req, res, next) => {
  try {
    const blogId = req.params.id;
    const { title, content, category } = req.body;

    const blog = await Blog.findByIdAndUpdate(blogId,{ title, content, category },
        { new: true, runValidators: true }
    );

    if (!blog){
         return next(createError(404, 'Blog not found.'));
    }

    returnJson(res, 200, true, blog, 'Blog updated successfully.');

  } catch (error) {
    console.log(error);
    return next(createError(500, 'Error in updating blog.'));
  }
};


const deleteBlog = async (req, res, next) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findByIdAndDelete(blogId);

    if (!blog) return next(createError(404, 'Blog not found.'));

    returnJson(res, 200, true, blog, 'Blog deleted successfully.');

  } catch (error) {
    console.log(error);
    return next(createError(500, 'Error in deleting blog.'));
  }
};


const getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find().populate('author', 'userName email').sort('-createdAt');

    returnJson(res, 200, true, blogs, 'Fetched all blogs successfully.');

  } catch (error) {
    console.log(error);
    return next(createError(500, 'Error in getting blogs.'));
  }
};


const getBlogById = async (req, res, next) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId).populate('author', 'userName email');

    if (!blog){
         return next(createError(404, 'Blog not found.'));
    }
    
    blog.views += 1;
    await blog.save();

    returnJson(res, 200, true, blog, 'Fetched blog successfully.');

  } catch (error) {
    console.log(error);
    return next(createError(500, 'Error in getting blog by id.'));
  }
};


const uploadBlogImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(createError(400, 'No image provided.'));
    }

    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return next(createError(404, 'Blog not found.'));
    }

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'agirlife-blogs',
          public_id: `blog_${blog._id}_${Date.now()}`
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

    blog.imageUrl = result.secure_url;
    await blog.save();

    returnJson(res, 200, true, blog, 'Blog image uploaded successfully.');

  } catch (error) {
    console.log(error);
    return next(createError(500, 'Error uploading blog image.'));
  }
};

const addComment = async (req, res, next) => {
  try {
     const { blog: blogId, comment, name, email } = req.body;

    if (!comment || !name || !email || !blogId) {
      return next(createError(400, 'All fields are required.'));
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return next(createError(404, 'Blog post not found.'));
    }

    blog.comments.unshift({ comment, name, email });
    await blog.save();

    returnJson(res, 201, true, blog.comments, 'Comment added successfully.');

  } catch (error) {
    console.log(error);
    return next(createError(500, 'Error adding comment.'));
  }
};


module.exports = {createBlog,updateBlog,deleteBlog,getAllBlogs,getBlogById,uploadBlogImage,addComment};
