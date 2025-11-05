const express = require('express');
const {auth,admin} = require('../middlewares/');
const upload = require('../middlewares/multer');
const {createStory,
       updateStory,
       deleteStory,
       getAllStories,
       getStoryById,
       uploadStoryImage} = require('../controllers/story');

const router = express.Router();

router.post('/create',auth,admin,createStory)
      .put('/update/:id',auth,admin,updateStory)
      .delete('/delete/:id',auth,admin,deleteStory)
      .get('/getAll',getAllStories)
      .get('/getById/:id',getStoryById)
      .post('/upload-image/:id',auth,admin,upload.single('image'),uploadStoryImage);


module.exports = router;