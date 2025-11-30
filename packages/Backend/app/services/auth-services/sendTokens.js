const generateTokens = require("../../utils/generateTokens.js");

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
module.exports = {
  createSendToken,
  createSendToken_V2,
};
