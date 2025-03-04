import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import User from "../models/userModel.js";
import { catchAsync } from "../utils/catchAsync.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK,
    },
    catchAsync(async (accessToken, refreshToken, profile, done) => {
      let user = await User.findOne({ googleID: profile.id });

      if (!user) {
        user = await User.create({
          googleID: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
        });
      }

      return done(null, user);
    })
  )
);

export default passport;
