import Project from "../models/projectsModel.js";
import * as HF from "./handlerFactory.js";
import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

const isMine = HF.isOwner(Project, "owner");

const getProjects = HF.getAll(Project, "owner");

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
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
