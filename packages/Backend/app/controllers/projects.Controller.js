const { path } = require("../../app.js");
const Project = require("../models/project.Model.js");
const catchAsync = require("../utils/catchAsync.js");
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

const getProjectMembers = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.params.id)
    .populate("members.user")
    .populate({ path: "members.role", select: "-__v -_id -permissions" });

  if (!project) {
    return res.status(404).json({
      status: "fail",
      message: "Project not found",
    });
  }
  const members = project.members.map((member) => ({
    user: member.user,
    role: member.role,
  }));

  res.status(200).json({
    status: "success",
    data: members,
  });
  next();
});

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
