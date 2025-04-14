const Role = require("../models/roleModel.js");
const HF = require("./handlerFactory.js");

const isMine = HF.isOwner(Role, "theCreator");

const getAllRoles = HF.getAll(Role, "project");

const getRoleById = HF.getOne(Role);

const createRole = HF.createOne(Role, "theCreator", "project");

const updateRole = HF.updateOne(Role);

const deleteRole = HF.deleteOne(Role);

module.exports = {
  isMine,
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
};
