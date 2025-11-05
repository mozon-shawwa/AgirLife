const authRouter = require('./auth');
const productRouter = require('./product');
const cartRouter = require('./cart');
const orderRouter = require('./order');
const paymentRouter = require('./payment');
const blogRouter = require('./blog');
const storyRouter = require('./story');
const contactRouter = require('./contact');

module.exports =(app)=>{
    app.use('/auth',authRouter),
    app.use('/product',productRouter),
    app.use('/cart',cartRouter),
    app.use('/order',orderRouter),
    app.use('/payment',paymentRouter),
    app.use('/blog',blogRouter),
    app.use('/story',storyRouter),
    app.use('/contact',contactRouter)
}
