const cloudinary = require("../../utils/cloudinary.js");
const User = require("../../models/user.Model.js");
const FS = require("../factory-services/Factory.services.js");
const AppError = require("../../utils/appError.js");
const catchAsync = require("../../utils/catchAsync.js");

const uploader = FS.uploader("image", 1);
const removeImages = FS.removeFile(User, "image");

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
    return next(new AppError("Password update not allowed here", 400));
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  if (req.files && req.files.length > 0) {
    if (user.image && Array.isArray(user.image)) {
      const deletionPromises = user.image.map((img) =>
        cloudinary.uploader.destroy(img.public_id)
      );
      await Promise.all(deletionPromises);
    }

    const uploadPromises = req.files.map((file) =>
      cloudinary.uploader.upload(file.path, {
        resource_type: "auto",
        folder: "user_images",
      })
    );
    const uploadedImages = await Promise.all(uploadPromises);

    req.body.image = uploadedImages.map((img) => ({
      url: img.secure_url,
      public_id: img.public_id,
      original_filename: img.original_filename,
      format: img.format,
    }));
  }

  const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    message: "Profile updated successfully",
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

  await User.findByIdAndDelete(req.user.id);

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
