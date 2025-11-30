const Project = require("../models/project.Model.js");
const catchAsync = require("../utils/catchAsync.js");
const FS = require("../services/factory-services/Factory.service.js");
const projectMembersService = require("../services/projects-services/projectMembers.service.js");

const uploader = FS.uploader("image", 1);
const removeImages = FS.removeFile(Project, "image");

const getProjects = FS.getAll(Project, "members.user", ["tasks"]);

const getProjectById = FS.getOne(Project, [
  { path: "members.role", select: "name" },
  "tasks",
]);

const createProject = FS.createOne(
  Project,
  "projects_images",
  "image",
  "members.user"
);
const updateProject = FS.updateOne(Project, "projects_images", "image");
const deleteProject = FS.deleteOne(Project);

const getProjectMembers = projectMembersService.getProjectMembers;

module.exports = {
  getProjects,
  getProjectById,
  uploader,
  removeImages,
  createProject,
  updateProject,
  deleteProject,
  getProjectMembers,
};
