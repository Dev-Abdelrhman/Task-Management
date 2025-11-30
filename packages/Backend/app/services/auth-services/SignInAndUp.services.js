const User = require("../../models/user.Model.js");
const catchAsync = require("../../utils/catchAsync.js");
const AppError = require("../../utils/appError.js");
const sendEmail = require("../../utils/nodeMailer.js");
const sendTokens = require("./sendTokens.js");

const createSendToken = sendTokens.createSendToken;

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
module.exports = { signin, signup, verifyOTP };
