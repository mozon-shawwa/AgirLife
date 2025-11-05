const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/');
const { createPaymentIntent ,handleStripeWebhook} = require('../controllers/payment');

router.post('/webhook', express.raw({type: 'application/json'}), handleStripeWebhook)
      .post('/create-Intent', auth, createPaymentIntent);

module.exports = router;