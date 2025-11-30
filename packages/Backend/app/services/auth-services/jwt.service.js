const jwt = require("jsonwebtoken");
const User = require("../../models/user.Model.js");
const catchAsync = require("../../utils/catchAsync.js");
const AppError = require("../../utils/appError.js");
const generateTokens = require("../../utils/generateTokens.js");

const generateAccessToken = generateTokens.generateAccessToken;
const generateRefreshToken = generateTokens.generateRefreshToken;

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
  protect,
};
