const User = require("../models/userModel.js");
const HF = require("./handlerFactory.js");

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
};
