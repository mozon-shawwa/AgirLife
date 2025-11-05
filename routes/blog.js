const express = require('express');
const {auth,admin} = require('../middlewares/');
const upload = require('../middlewares/multer');
const {createBlog,
       updateBlog,
       deleteBlog,
       getAllBlogs,
       getBlogById,
       uploadBlogImage,
       addComment} = require('../controllers/blog');

const router = express.Router();

router.post('/create',auth,admin,createBlog)
      .put('/update/:id',auth,admin,updateBlog)
      .delete('/delete/:id',auth,admin,deleteBlog)
      .get('/getAll',getAllBlogs)
      .get('/getById/:id',getBlogById)
      .post('/upload-image/:id',auth,admin,upload.single('image'),uploadBlogImage)
      .post('/comment',addComment);


module.exports = router;