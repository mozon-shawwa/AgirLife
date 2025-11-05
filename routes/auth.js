const express = require('express');
const passport = require('passport');
const {register,login,forgotPassword,resetPassword} = require('../controllers/auth');

const router = express.Router();

router.post('/register',register)
      .post('/login',login)
      .get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
      .get('/google/callback', 
           passport.authenticate('google', { failureRedirect: '/login' , session: false }),
           (req, res) => {
            return returnJson(res, 200, true, {
                  id: req.user._id,
                  name: req.user.name,
                  email: req.user.email,
                  token: req.user.token
              }, "Login successful with google");
           }
            )
      
      .post('/forgot-password', forgotPassword)
      .post('/reset-password', resetPassword);
                   
module.exports = router;