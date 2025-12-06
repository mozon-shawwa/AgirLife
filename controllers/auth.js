const User = require('../models/User');
const createError = require('http-errors');
const JWT = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { returnJson } = require('../my-modules/json-response');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');

const register = async (req, res, next) => {
  try {
    const { userName, email, password, phone, location } = req.body;

    if (!userName || !email || !password || !phone || !location) {
      return next(createError(400, 'Please provide all required fields.'));
    }

    if (!/^\d{10}$/.test(phone)) {
      return next(createError(400, 'Phone number must be 10 digits.'));
    }

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });

    if (existingUser) {
      if (existingUser.email === email) {
        return next(createError(400, 'This email is already registered. Please log in.'));
      }
      if (existingUser.phone === phone) {
        return next(createError(400, 'This phone number is already registered.'));
      }
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

    user.password = undefined;

    returnJson(res, 201, true, user, 'Successfully Registered');

  } catch (error) {
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map(val => val.message)[0];
      return next(createError(400, message));
    }
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

    const user = await User.findOne({ $or: [{ email: key }, { phone: key }] });
    if (!user) {
      return next(createError(404, 'User Not Found'));
    }

    if (!user.password) {
      const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
      return returnJson(res, 200, true, { user, token }, "Login Successfully via Google");
    }

    if (!password) {
      return next(createError(400, 'Please provide password.'));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(createError(400, 'Invalid Password'));
    }

    const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    user.password = undefined;

    returnJson(res, 200, true, { user, token }, "Login Successfully");

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
    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      await User.findByIdAndUpdate(user._id, {
        resetPasswordToken: token,
        resetPasswordExpires: Date.now() + 3600000,
      });

      const resetLink = `https://agirlife-frontend.onrender.com/resetpassword.html?token=${token}`;

      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const msg = {
        to: user.email,
        from: process.env.EMAIL_USER,
        subject: 'AgriLife - Reset Your Password',
        text: `Hi ${user.userName},\n\nPlease click the following link to reset your password: ${resetLink}\n\nIf you did not request this, please ignore this email.`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Password Reset Request</h2>
            <p>Hi ${user.userName},</p>
            <p>We received a request to reset your password for your AgriLife account. Please click the button below to set a new password:</p>
            <a href="${resetLink}" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
            <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
            <p>Thanks,  
The AgriLife Team</p>
          </div>
        `,
      };

      await sgMail.send(msg);
    }

    return returnJson(res, 200, true, {}, "If an account with this email exists, a reset link has been sent.");

  } catch (err) {
    console.error("Error in forgotPassword controller:", err);
    if (err.response) {
      console.error("SendGrid Error Body:", err.response.body);
    }
    return next(createError(500, "An internal error occurred. Please try again later."));
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return next(createError(400, "Token and new password are required"));
    }

    if (newPassword.length < 8) {
      return next(createError(400, "Password must be at least 8 characters long"));
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

    return returnJson(res, 200, true, {}, "Password has been successfully reset");
  } catch (err) {
    console.log(err);
    return next(createError(500, "Error in resetting password"));
  }

};


module.exports = { register, login, forgotPassword, resetPassword };