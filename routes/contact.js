const express = require('express');
const {auth,admin} = require('../middlewares/');
const {createMessage,
       getAllMessages, 
       getMessageById } = require('../controllers/contact');

const router = express.Router();

router.post('/send-message', createMessage)
      .get('/getAll', auth, admin, getAllMessages)
      .get('/getById/:id', auth, admin, getMessageById);

module.exports = router;