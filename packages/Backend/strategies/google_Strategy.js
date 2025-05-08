import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

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
      } catch (error) {;
        return cb(error, null);
      }
    }
  )
);

export default passport;
