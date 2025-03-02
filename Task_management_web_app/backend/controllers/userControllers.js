import User from "../models/userModel.js";
import HF from "./handlerFactory.js";

const getAllUsers = HF.getAll(User);

const getUserById = HF.getOne(User);

const createUser = HF.createOne(User);

const updateUser = HF.updateOne(User);

const deleteUser = HF.deleteOne(User);

// const UC = {
//   getAllUsers,
//   getUserById,
//   createUser,
//   updateUser,
//   deleteUser,
// };

export { getAllUsers, getUserById, createUser, updateUser, deleteUser };
