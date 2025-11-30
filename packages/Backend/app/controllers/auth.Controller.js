const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/user.Model.js");
const catchAsync = require("../utils/catchAsync.js");
const AppError = require("../utils/appError.js");
const sendEmail = require("../utils/nodeMailer.js");
const generateTokens = require("../utils/generateTokens.js");
const SignInAndUpService = require("../services/auth-services/SignInAndUp.services.js");
const googleService = require("../services/auth-services/google.services.js");
const resetPasswordService = require("../services/auth-services/reserPassword.services.js");

const generateAccessToken = generateTokens.generateAccessToken;

const generateRefreshToken = generateTokens.generateRefreshToken;
const createSendToken = (user, statusCode, res) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: "Strict",
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("refreshToken", refreshToken, cookieOptions);
  res.cookie("accessToken", accessToken, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    user,
  });
};

const signin = SignInAndUpService.signin;
const tempUsers = new Map();
const otpToEmail = new Map();

const signup = SignInAndUpService.signup;

const verifyOTP = SignInAndUpService.verifyOTP;

const googleAuth = googleService.googleAuth;
const createSendToken_V2 = (user, statusCode, res) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: "Strict",
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("refreshToken", refreshToken, cookieOptions);
  res.cookie("accessToken", accessToken, cookieOptions);
  user.password = undefined;

  res.redirect("http://localhost:5174/google-signin");
};

const googleAuthCallback = googleService.googleAuthCallback;

const completeGoogleSignup = googleService.completeGoogleSignup;

const forgotPassword = resetPasswordService.forgotPassword;

const resetPassword = resetPasswordService.resetPassword;

const blacklist = new Set();

const logout = (req, res) => {
  const token = req.cookies.accessToken;
  const rToken = req.cookies.refreshToken;

  if (!token || !rToken) {
    return res.status(400).json({ message: "You are not logged in" });
  }

  blacklist.add(token);
  blacklist.add(rToken);

  res.cookie("accessToken", "", {
    expires: new Date(0),
    httpOnly: true,
    sameSite: "Strict",
  });
  res.cookie("refreshToken", "", {
    expires: new Date(0),
    httpOnly: true,
    sameSite: "Strict",
  });

  res.status(200).json({ message: "Logged out successfully" });
};

const protect = catchAsync(async (req, res, next) => {
  let accessToken = req.cookies.accessToken;
  let refreshToken = req.cookies.refreshToken;

  if (!accessToken && !refreshToken) {
    return next(new AppError("Please log in to get access.", 401));
  }

  jwt.verify(
    accessToken,
    process.env.JWT_SECRET_ACCESS_TOKEN,
    async (err, decoded) => {
      if (err && err.name === "TokenExpiredError") {
        if (!refreshToken) {
          return next(
            new AppError("Session expired. Please log in again.", 401)
          );
        }

        jwt.verify(
          refreshToken,
          process.env.JWT_SECRET_REFRESH_TOKEN,
          async (refreshErr, refreshDecoded) => {
            if (refreshErr) {
              return next(
                new AppError("Refresh token expired or invalid.", 401)
              );
            }

            const user = await User.findById(refreshDecoded.id);
            if (!user) return next(new AppError("User no longer exists.", 401));

            const newAccessToken = generateAccessToken(user._id);
            const newRefreshToken = generateRefreshToken(user._id);

            const cookieOptions = {
              httpOnly: true,
              sameSite: "Strict",
              expires: new Date(
                Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 60 * 1000
              ),
            };
            if (process.env.NODE_ENV === "production")
              cookieOptions.secure = true;

            res.cookie("accessToken", newAccessToken, cookieOptions);
            res.cookie("refreshToken", newRefreshToken, cookieOptions);

            req.user = user;
            next();
          }
        );
      } else if (err) {
        return next(new AppError("Invalid token. Please log in again.", 401));
      } else {
        const user = await User.findById(decoded.id);
        if (!user) return next(new AppError("User no longer exists.", 401));
        req.user = user;
        next();
      }
    }
  );
});

module.exports = {
  signin,
  signup,
  googleAuth,
  googleAuthCallback,
  completeGoogleSignup,
  protect,
  logout,
  forgotPassword,
  resetPassword,
  verifyOTP,
};
