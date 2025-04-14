const passport = require("../strategies/google_Strategy.js");
const jwt = require("jsonwebtoken");
const promisify = require("util");
const crypto = require("crypto");
const User = require("../models/userModel.js");
const catchAsync = require("../utils/catchAsync.js");
const AppError = require("../utils/appError.js");
const sendEmail = require("../utils/nodeMailer.js");
//______________________________________________________________________________
const frontendUrl =
  "http://localhost:5173" || "http://localhost:5174" || "http://localhost:5175";
const generateAccessToken = function (id) {
  return jwt.sign(
    {
      id,
    },
    process.env.JWT_SECRET_ACCESS_TOKEN,
    {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    }
  );
};
//______________________________________________________________________________
const generateRefreshToken = function (id) {
  return jwt.sign(
    {
      id,
    },
    process.env.JWT_SECRET_REFRESH_TOKEN,
    {
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
    }
  );
};
//______________________________________________________________________________
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
//______________________________________________________________________________
const signin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }
  createSendToken(user, 200, res);
});
//______________________________________________________________________________
const signup = catchAsync(async (req, res, next) => {
  const { name, username, email, password, passwordConfirmation } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError("Email already exists", 400));
  }

  const newUser = await User.create({
    name,
    username,
    email,
    password,
    passwordConfirmation,
  });

  createSendToken(newUser, 201, res);
});
//______________________________________________________________________________
const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});
//______________________________________________________________________________
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

  res.redirect(`${frontendUrl}/google-signin`);
};
//______________________________________________________________________________
const getAuthUser = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError("User not authenticated", 401));
  }

  res.status(200).json({
    status: "success",
    user: req.user,
  });
});
//______________________________________________________________________________
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
      if (!frontendUrl) {
        return res
          .status(400)
          .json({ status: "error", message: "Frontend URL missing" });
      }
      if (user.tempToken) {
        return res.redirect(
          `${frontendUrl}/google-signup?token=${user.tempToken}`
        );
      }
      createSendToken_V2(user, 201, res);
    }
  )(req, res, next);
};
//______________________________________________________________________________
const completeGoogleSignup = catchAsync(async (req, res, next) => {
  const { token, username, password, passwordConfirmation } = req.body;

  console.log("Received Data:", {
    token,
    username,
    password,
    passwordConfirmation,
  });

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
    image: decoded.image,
    username,
    password,
    passwordConfirmation,
    active: true,
  });

  createSendToken(newUser, 201, res);
});
//______________________________________________________________________________
const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with that email address", 404));
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  const resetURL = `${req.protocol}://localhost:5173/resetPassword/${resetToken}`;
  const message = `Forgot your password? Reset it here: ${resetURL}\nIf you didn't forget your password, please ignore this email. `;
  try {
    await sendEmail({
      to: user.email,
      subject: "Your password reset token is valid for 15 minutes.",
      text: message,
    });
    res.status(200).json({
      status: "success",
      message: "Token sent to email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500
    );
  }
});
//______________________________________________________________________________
const resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: new Date() },
  });

  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  user.password = req.body.password;
  user.passwordConfirmation = req.body.passwordConfirmation;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(user, 200, res);
});
//______________________________________________________________________________
const updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is wrong.", 401));
  }
  user.password = req.body.password;
  user.passwordConfirmation = req.body.passwordConfirmation;
  await user.save();
  createSendToken(user, 200, res);
});
//______________________________________________________________________________
const blacklist = new Set();
//______________________________________________________________________________
const logout = (req, res) => {
  const token = req.cookies.accessToken;
  const rToken = req.cookies.refreshToken;

  if (!token || !rToken) {
    return res.status(400).json({ message: "You are not logged in" });
  }

  // Add tokens to the blacklist
  blacklist.add(token);
  blacklist.add(rToken);

  // Clear cookies
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
//______________________________________________________________________________
const protect = catchAsync(async (req, res, next) => {
  let token;

  if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("You are not logged in! Please log in.", 401));
  }

  if (blacklist.has(token)) {
    return next(new AppError("Session expired. Please log in again.", 401));
  }

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_ACCESS_TOKEN
  );

  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError("User no longer exists.", 401));
  }

  req.user = user;
  next();
});
//______________________________________________________________________________
const refreshAccessToken = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return next(
      new AppError("Refresh token missing. Please log in again.", 403)
    );
  }

  jwt.verify(
    refreshToken,
    process.env.JWT_SECRET_REFRESH_TOKEN,
    async (err, decoded) => {
      if (err)
        return next(new AppError("Invalid or expired refresh token.", 403));

      const user = await User.findById(decoded.id);
      if (!user) return next(new AppError("User no longer exists.", 403));

      const newRefreshToken = generateRefreshToken(user._id);
      const newAccessToken = generateAccessToken(user._id);

      const cookieOptions = {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 60 * 1000
        ),
        httpOnly: true,
        sameSite: "Strict",
      };
      if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

      res.cookie("refreshToken", newRefreshToken, cookieOptions);
      res.cookie("accessToken", newAccessToken, cookieOptions);
      res.status(200).json({
        status: "success",
      });
    }
  );
});
//______________________________________________________________________________
module.exports = {
  signin,
  signup,
  googleAuth,
  googleAuthCallback,
  completeGoogleSignup,
  getAuthUser,
  protect,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
};
