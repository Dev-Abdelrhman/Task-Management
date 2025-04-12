import Project from "../models/projectsModel.js";
import * as HF from "./handlerFactory.js";
import upload from "../utils/multer.js";
import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

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

export {
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
