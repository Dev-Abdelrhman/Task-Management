const User = require("../models/user.Model.js");
const FC = require("./Factory.Controller.js");
const AppError = require("../utils/appError.js");
const catchAsync = require("../utils/catchAsync.js");

const uploader = FC.uploader("image", 1);
const removeImages = FC.removeFile(User, "image");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
const getUser = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError("User not authenticated", 401));
  }

  res.status(200).json({
    status: "success",
    user: req.user,
  });
});

const updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError("You cannot update password here", 400));
  }

  const filteredBody = filterObj(req.body, "name", "username", "email");

  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto",
    });

    filteredBody.image = {
      public_id: result.public_id,
      url: result.secure_url,
      original_filename: result.original_filename,
      format: result.format,
    };
  }

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
  });

  res.status(200).json({
    status: "success",
    data: updatedUser,
  });
});

const updatePassword = catchAsync(async (req, res, next) => {
  const { passwordCurrent, password, passwordConfirmation } = req.body;
  if (!passwordCurrent || !password || !passwordConfirmation) {
    return next(
      new AppError(
        "Please provide current, new, and confirmation passwords.",
        400
      )
    );
  }
  const user = await User.findById(req.user.id).select("+password");
  if (!user) {
    return next(new AppError("User not found.", 404));
  }
  const isCorrect = await user.correctPassword(passwordCurrent, user.password);
  if (!isCorrect) {
    return next(new AppError("Your current password is wrong.", 401));
  }
  user.password = password;
  user.passwordConfirmation = passwordConfirmation;
  await user.save();
  res.status(200).json({
    status: "success",
    message: "Password updated successfully.",
    data: user,
  });
});

const deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (user.image && user.image.public_id) {
    await cloudinary.uploader.destroy(user.image.public_id);
  }

  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

module.exports = {
  getMe,
  getUser,
  updateMe,
  updatePassword,
  deleteMe,
  uploader,
  removeImages,
};
