const SignInAndUpService = require("../services/auth-services/SignInAndUp.service.js");
const googleService = require("../services/auth-services/google.service.js");
const resetPasswordService = require("../services/auth-services/reserPassword.service.js");
const logoutService = require("../services/auth-services/logout.service.js");
const JWTservice = require("../services/auth-services/jwt.service.js");

const signin = SignInAndUpService.signin;

const signup = SignInAndUpService.signup;

const verifyOTP = SignInAndUpService.verifyOTP;

const googleAuth = googleService.googleAuth;

const googleAuthCallback = googleService.googleAuthCallback;

const completeGoogleSignup = googleService.completeGoogleSignup;

const forgotPassword = resetPasswordService.forgotPassword;

const resetPassword = resetPasswordService.resetPassword;

const logout = logoutService.logout;

const protect = JWTservice.protect;

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
