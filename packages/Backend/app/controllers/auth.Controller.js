const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/user.Model.js");
const catchAsync = require("../utils/catchAsync.js");
const AppError = require("../utils/appError.js");
const sendEmail = require("../utils/nodeMailer.js");
const passport = require("../strategies/google_Strategy.js");

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
const tempUsers = new Map();
const otpToEmail = new Map();

const signup = catchAsync(async (req, res, next) => {
  const { name, username, email, password, passwordConfirmation } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError("Email already exists", 400));
  }

  if (password !== passwordConfirmation) {
    return next(new AppError("Passwords do not match", 400));
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000;

  tempUsers.set(email, {
    name,
    username,
    password,
    image: req.files
      ? req.files.map((file) => ({
          public_id: file.public_id,
          url: file.secure_url,
          original_filename: file.original_filename,
          format: file.format,
        }))
      : [],
    passwordConfirmation,
    otp,
    expiresAt,
  });

  otpToEmail.set(otp, email);

  setTimeout(() => {
    tempUsers.delete(email);
    otpToEmail.delete(otp);
  }, 10 * 60 * 1000);

  try {
    await sendEmail({
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It expires in 10 minutes.`,
    });

    res
      .status(200)
      .json({ message: "OTP sent. Please verify to complete signup." });
  } catch (error) {
    tempUsers.delete(email);
    otpToEmail.delete(otp);
    return next(new AppError("Failed to send OTP", 500));
  }
});

const verifyOTP = catchAsync(async (req, res, next) => {
  const { otp } = req.body;

  const email = otpToEmail.get(otp);
  if (!email) return next(new AppError("Invalid OTP", 400));

  const record = tempUsers.get(email);
  if (!record) return next(new AppError("No OTP found for this email", 400));

  if (Date.now() > record.expiresAt) {
    tempUsers.delete(email);
    otpToEmail.delete(otp);
    return next(new AppError("OTP expired", 400));
  }

  if (record.otp !== otp) {
    return next(new AppError("Invalid OTP", 400));
  }

  const newUser = await User.create({
    name: record.name,
    username: record.username,
    email,
    password: record.password,
    passwordConfirmation: record.passwordConfirmation,
    image: record.image,
  });

  tempUsers.delete(email);
  otpToEmail.delete(otp);

  createSendToken(newUser, 201, res);
});

const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

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

const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with that email address", 404));
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  const resetURL = `http://localhost:5174/resetPassword/${resetToken}`;
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

  createSendToken("", 200, res);
});

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
