const { path } = require("../../app.js");
const Project = require("../models/project.Model.js");
const catchAsync = require("../utils/catchAsync.js");
const FS = require("../services/factory-services/factory.services.js");

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
