// import bcrypt from "bcryptjs";
import passport from "passport";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import crypto from "crypto";
import User from "../models/userModel.js";
// import Role from "../models/roleModel";
// import Project from "../models/projectsModel";
// import { checkProjectPermission } from "../models/checkProjectPermission";
import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import sendEmail from "../utils/nodeMailer.js";

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

  res.cookie("refreshToken", refreshToken, cookieOptions); // Store refresh token in HTTP-only cookie

  user.password = undefined; // Hide password in response

  res.status(statusCode).json({
    status: "success",
    accessToken, // Send access token to client
    data: { user },
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

const signup = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return next(new AppError("Email already exists", 400));
  }
  const newUser = await User.create(req.body);
  createSendToken(newUser, 201, res);
});

const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

const googleAuthCallback = (req, res, next) => {
  passport.authenticate(
    "google",
    { failureRedirect: "/login" },
    (err, user) => {
      if (err || !user) {
        return res
          .status(401)
          .json({ status: "error", message: "Authentication failed" });
      }
      req.logIn(user, (loginErr) => {
        if (loginErr) {
          return res
            .status(500)
            .json({ status: "error", message: "Login failed" });
        }
        return res.redirect("/depiV1/projects"); // Redirect user after successful login
      });
    }
  )(req, res, next);
};

const forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with that email address", 404));
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/depiV1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? Reset it here: ${resetURL}\nIf you didn't forget your password, please ignore this email. `;
  console.log(message);
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

  createSendToken(user, 200, res);
});

const updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is wrong.", 401));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  createSendToken(user, 200, res);
});

const blacklist = new Set();

const logout = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const rToken = req.cookies.refreshToken;
  if (!token) {
    return res.status(400).json({ message: "You are not logged in" });
  }
  if (!rToken) {
    return res.status(400).json({ message: "You are not logged in" });
  }

  blacklist.add(token, rToken);

  res.status(200).json({ message: "Logged out successfully" });
};

const protect = catchAsync(async (req, res, next) => {
  let token;
  if (
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

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError("User no longer exists.", 401));
  }

  req.user = currentUser;
  next();
});

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

      res.status(200).json({
        status: "success",
        accessToken: newAccessToken,
      });
    }
  );
});

export {
  signin,
  signup,
  googleAuth,
  googleAuthCallback,
  protect,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
};
