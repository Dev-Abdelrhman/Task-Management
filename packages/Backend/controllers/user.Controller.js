const User = require("../models/user.Model.js");
const FC = require("./Factory.Controller.js");

const uploader = FC.uploader("image", 1);
const uploadImage = FC.uploadFiles(User, "Home/users", "image");
const removeImages = FC.removeFile(User, "image");

const getAllUsers = FC.getAll(User);

const getUserById = FC.getOne(User);

const createUser = FC.createOne(User);

const updateUser = FC.updateOne(User);

const deleteUser = FC.deleteOne(User);

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
