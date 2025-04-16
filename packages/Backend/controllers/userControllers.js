const User = require("../models/userModel.js");
const HF = require("./handlerFactory.js");

const uploader = HF.uploader("image", 1);
const uploadImage = HF.uploadFiles(User, "Home/users", "image");
const removeImages = HF.removeFile(User, "image");

const getAllUsers = HF.getAll(User);

const getUserById = HF.getOne(User);

const createUser = HF.createOne(User);

const updateUser = HF.updateOne(User);

const deleteUser = HF.deleteOne(User);

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  uploader,
  uploadImage,
  removeImages,
};
