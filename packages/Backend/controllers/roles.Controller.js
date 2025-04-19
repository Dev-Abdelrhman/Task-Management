const Role = require("../models/role.Model.js");
const FC = require("./Factory.Controller.js");

const isMine = FC.isOwner(Role, "theCreator");

const getAllRoles = FC.getAll(Role, "project");

const getRoleById = FC.getOne(Role);

const createRole = FC.createOne(Role, "theCreator", "project");

const updateRole = FC.updateOne(Role);

const deleteRole = FC.deleteOne(Role);

module.exports = {
  isMine,
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
};
