const Role = require("../models/role.Model.js");
const FS = require("../services/factory-services/Factory.services.js");

const isMine = FS.isOwner(Role, "theCreator");

const getAllRoles = FS.getAll(Role, "project");

const getRoleById = FS.getOne(Role);

const createRole = FS.createOne(Role, "", "", "theCreator", "project");

const updateRole = FS.updateOne(Role);

const deleteRole = FS.deleteOne(Role);

module.exports = {
  isMine,
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
};
