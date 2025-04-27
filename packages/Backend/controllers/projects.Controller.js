const Project = require("../models/project.Model.js");
const FC = require("./Factory.Controller.js");

const uploader = FC.uploader("image", 1);
const removeImages = FC.removeFile(Project, "image");

const getProjects = FC.getAll(Project, "members.user", ["tasks"]);

const getProjectById = FC.getOne(Project, [
  { path: "roles", select: "name" },
  { path: "members.role", select: "name" },
  "comments",
  "tasks",
]);

const createProject = FC.createOne(Project, "image", "members.user");
const updateProject = FC.updateOne(Project, "image");
const deleteProject = FC.deleteOne(Project);

module.exports = {
  getProjects,
  getProjectById,
  uploader,
  removeImages,
  createProject,
  updateProject,
  deleteProject,
};
