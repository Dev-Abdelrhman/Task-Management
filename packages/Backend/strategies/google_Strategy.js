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
        console.log("🔍 Google Profile:", profile);

        let user = await User.findOne({ email: profile.emails?.[0]?.value });

        if (user) {
          console.log("✅ Existing user, logging in...");
          return cb(null, user);
        }

        console.log("🚀 New user, generating tempToken...");

        const tempToken = jwt.sign(
          {
            googleID: profile.id,
            email: profile.emails?.[0]?.value,
            name: profile.displayName,
            image: profile.photos?.[0]?.value,
          },
          process.env.JWT_TEMP_SECRET,
          { expiresIn: "10m" }
        );

        return cb(null, { tempToken });
      } catch (error) {
        console.error("❌ Google OAuth Error:", error);
        return cb(error, null);
      }
    }
  )
);

export default passport;
