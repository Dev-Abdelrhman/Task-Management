const Project = require("../models/projectsModel.js");
const HF = require("./handlerFactory.js");
const upload = require("../utils/multer.js");
const catchAsync = require("../utils/catchAsync.js");
const AppError = require("../utils/appError.js");

const uploader = upload.array("image", 1);
const uploadImages = HF.uploadFiles(Project, "Home/projects/", "image");
const removeImages = HF.removeFile(Project, "image");

const isMine = HF.isOwner(Project, "owner");

const getProjects = HF.getAll(Project, "owner");
const getInvitedProjects = HF.getAll(Project, "members.user");

const getProjectById = HF.getOne(Project, [
  "roles",
  "members.role",
  "comments",
]);

const createProject = HF.createOne(Project, "owner");
const updateProject = HF.updateOne(Project);
const deleteProject = HF.deleteOne(Project);

module.exports = {
  isMine,
  getProjects,
  getInvitedProjects,
  getProjectById,
  uploader,
  uploadImages,
  removeImages,
  createProject,
  updateProject,
  deleteProject,
};
