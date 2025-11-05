const passport = require('passport');
const jwt = require('jsonwebtoken');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../../models/User'); 
const googleCredentials = require('../OAuth.json'); 

passport.use(new GoogleStrategy({
    clientID: googleCredentials.web.client_id,
    clientSecret: googleCredentials.web.client_secret,
    callbackURL: "http://localhost:8080/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
        if (!user) {
         user = await User.findOne({ email: profile.emails[0].value });
        }

      if (!user) {
        user = await User.create({
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName || "Google User",
          email: profile.emails[0].value,

          userName: profile.displayName || "GoogleUser",
          location: "Not specified",
          phone: "Not specified",
          password: ""
        });
      }

      const token = jwt.sign(
            { id: user._id, email: user.email },
             process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

    user.token = token;
    done(null, user);
  
  } catch (err) {
      done(err, null);
    }
  }
));

// لتخزين المستخدم في الجلسة
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
