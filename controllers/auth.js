const User = require('../models/User');
const createError = require('http-errors');
const JWT = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { returnJson } = require('../my-modules/json-response');
const crypto = require('crypto');
const nodemailer = require('nodemailer');


const register = async (req, res, next) => {
  try {
    const { userName, email, password, phone, location} = req.body;
    if (!userName || !email || !password || !phone || !location) {
      return next(createError(400, 'please,provide all fields'));
    }

    const exisiting = await User.findOne({ email });
    if (exisiting) {
      return next(createError(400, 'Email is already Registered,please login'));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      userName,
      email,
      password: hashedPassword,
      phone,
      location
    });

    returnJson(res, 201, true, user, 'Successfully Registered');

  } catch (error) {
    console.log(error);
    return next(createError(500, 'Error In Register API'));
  }

};

const login = async (req, res, next) => {
  try {
    const { key, password } = req.body;
    if (!key) {
     return next(createError(400, 'Please provide email or phone.'));
    }

    const user = await User.findOne({$or:[{email:key},{phone:key}]});
    if(!user){
      return next(createError(404, 'User Not Found'));
    }

    if (!user.password) {
       const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
       return returnJson(res, 200, true, { user, token }, "Login Successfully via Google");
    }

    if (!password) {
      return next(createError(400, 'Please provide password.'));
    }

    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
      return next(createError(400, 'Invalid Password'));
    }

    const token = JWT.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"});
    user.password = undefined;

    returnJson(res,200,true,{user,token},"Login Successfully");

  } catch (error) {
    console.log(error);
    return next(createError(500, 'Error In Login API'))
  }

};


const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return next(createError(400, "Email is required"));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(createError(404, "User not found"));
    }

    const token = crypto.randomBytes(32).toString('hex');

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; 
    await user.save();

    const resetLink = `http://localhost:8080/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
       host: "smtp.gmail.com",
       port: 587,
       secure: false,
       auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Reset Password',
      text: `Hi ${user.name}, click this link to reset your password: ${resetLink}`
    };

    await transporter.sendMail(mailOptions);

    returnJson(res, 200, true,{} , "Reset password link sent to your email");

  } catch (err) {
    console.log(err);
    return next(createError(500, "Error in forgot password"));
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return next(createError(400, "Token and new password are required"));
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() } 
    });

    if (!user) {
      return next(createError(400, "Invalid or expired token"));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    returnJson(res, 200, true, {}, "Password has been successfully reset");

  } catch (err) {
    console.log(err);
    return next(createError(500, "Error in resetting password"));
  }
};

module.exports = { register, login ,forgotPassword ,resetPassword};