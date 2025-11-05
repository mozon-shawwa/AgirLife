const express = require('express');
const {auth,admin} = require('../middlewares/');
const {createOrder,
       getAllOrders,
       getMyOrders,
       updateOrderStatus,
       getOrderById} = require('../controllers/order');

const router = express.Router();

router.post('/create',auth,createOrder)
      .get('/getAll',auth,admin,getAllOrders)
      .get('/getMyOrders',auth,getMyOrders)
      .get('/getById/:id',auth,getOrderById)
      .put('/update-Status/:id',auth,admin,updateOrderStatus);

module.exports = router;