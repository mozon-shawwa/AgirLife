const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('./config/passport/')
const createError = require('http-errors');
const { returnJson } = require('./my-modules/json-response');
global.returnJson = returnJson;
const middleware = require('./middlewares');
const routes = require('./routes');
const connectdb = require('./config/db');
const { handleStripeWebhook } = require('./controllers/payment');


const app = express();

app.post('/payment/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

middleware.global(app);

app.use(session({
  secret: "YOUR_SECRET_KEY",
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

process.on('unhandledRejection', (reason) => {
    console.log(reason)
    process.exit(1)
})

connectdb();
routes(app);

app.use((req, res, next) => {
    next(createError(404,'Page Not Found'));
})

app.use((error, req, res, next) => {
    console.log(error)
    returnJson(res, error.statusCode, error.status, "", error.message);
})

module.exports = app;