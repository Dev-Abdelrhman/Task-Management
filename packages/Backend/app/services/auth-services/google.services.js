const jwt = require("jsonwebtoken");
const User = require("../../models/user.Model.js");
const catchAsync = require("../../utils/catchAsync.js");
const AppError = require("../../utils/appError.js");
const passport = require("../../strategies/google_Strategy.js");
const generateTokens = require("../../utils/generateTokens.js");
const sendTokens = require("./sendTokens.js");

const generateAccessToken = generateTokens.generateAccessToken;

const generateRefreshToken = generateTokens.generateRefreshToken;

const createSendToken_V2 = sendTokens.createSendToken_V2;

const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

const googleAuthCallback = (req, res, next) => {
  passport.authenticate(
    "google",
    { failureRedirect: "/login" },
    async (err, user) => {
      if (err || !user) {
        return res
          .status(401)
          .json({ status: "error", message: "Authentication failed" });
      }
      if (user.tempToken) {
        return res.redirect(
          `http://localhost:5174/google-signup?token=${user.tempToken}`
        );
      }
      createSendToken_V2(user, 201, res);
    }
  )(req, res, next);
};
const completeGoogleSignup = catchAsync(async (req, res, next) => {
  const { token, username, password, passwordConfirmation } = req.body;
  if (!token) {
    return next(new AppError("Token is required", 400));
  }
  if (!username || !password || !passwordConfirmation) {
    return next(new AppError("All fields are required", 400));
  }
  if (password !== passwordConfirmation) {
    return next(new AppError("Passwords do not match", 400));
  }
  const decoded = jwt.verify(token, process.env.JWT_TEMP_SECRET);
  const existingUser = await User.findOne({ email: decoded.email });
  if (existingUser) {
    return next(new AppError("User already exists. Please log in.", 400));
  }
  const newUser = await User.create({
    googleID: decoded.googleID,
    email: decoded.email,
    name: decoded.name,
    image: [
      {
        url: decoded.image,
        public_id: username + decoded.googleID,
        original_filename: decoded.name,
        format: decoded.image.split(".").pop(),
      },
    ],
    username,
    password,
    passwordConfirmation,
    active: true,
  });

  createSendToken(newUser, 201, res);
});

module.exports = {
  googleAuth,
  googleAuthCallback,
  completeGoogleSignup,
};
