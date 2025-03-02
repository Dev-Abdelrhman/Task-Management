import User from "../models/userModel.js";
import * as HF from "./handlerFactory.js";

const getAllUsers = HF.getAll(User);

const getUserById = HF.getOne(User);

const createUser = HF.createOne(User);

const updateUser = HF.updateOne(User);

const deleteUser = HF.deleteOne(User);

export { getAllUsers, getUserById, createUser, updateUser, deleteUser };
