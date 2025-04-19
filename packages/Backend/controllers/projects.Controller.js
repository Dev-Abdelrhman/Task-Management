const Project = require("../models/project.Model.js");
const FC = require("./Factory.Controller.js");

const uploader = FC.uploader("image", 1);
const removeImages = FC.removeFile(Project, "image");

const isMine = FC.isOwner(Project, "owner");

const getProjects = FC.getAll(Project, "owner");
const getInvitedProjects = FC.getAll(Project, "members.user");

const getProjectById = FC.getOne(Project, [
  "roles",
  "members.role",
  "comments",
]);

const createProject = FC.createOne(Project, "image", "owner");
const updateProject = FC.updateOne(Project);
const deleteProject = FC.deleteOne(Project);

module.exports = {
  isMine,
  getProjects,
  getInvitedProjects,
  getProjectById,
  uploader,
  removeImages,
  createProject,
  updateProject,
  deleteProject,
};
