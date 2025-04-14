const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const User = require("../models/userModel.js");
const jwt = require("jsonwebtoken");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK,
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        let user = await User.findOne({ email: profile.emails?.[0]?.value });
        if (user) {
          return cb(null, user);
        }

        const tempToken = jwt.sign(
          {
            googleID: profile.id,
            email: profile.emails?.[0]?.value,
            name: profile.displayName,
            image: profile.photos?.[0]?.value,
          },
          process.env.JWT_TEMP_SECRET,
          { expiresIn: process.env.JWT_TEMP_TOKEN_EXPIRES_IN }
        );

        return cb(null, { tempToken });
      } catch (error) {
        return cb(error, null);
      }
    }
  )
);

module.exports = passport;
