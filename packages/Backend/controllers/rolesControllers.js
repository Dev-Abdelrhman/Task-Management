import Role from "../models/roleModel.js";
import * as HF from "./handlerFactory.js";

const isMine = HF.isOwner(Role, "theCreator");

const getAllRoles = HF.getAll(Role, "project");

const getRoleById = HF.getOne(Role);

const createRole = HF.createOne(Role, "theCreator", "project");

const updateRole = HF.updateOne(Role);

const deleteRole = HF.deleteOne(Role);

export { isMine, getAllRoles, getRoleById, createRole, updateRole, deleteRole };
