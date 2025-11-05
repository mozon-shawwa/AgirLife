const express = require('express');
const {auth} = require('../middlewares/');
const {
      addItem,
      removeItem,
      getCart
       } = require('../controllers/cart');

const router = express.Router();

router.post('/add',auth,addItem)
      .delete('/remove/:id',auth,removeItem)
      .get('/getCart',auth,getCart)

module.exports = router;