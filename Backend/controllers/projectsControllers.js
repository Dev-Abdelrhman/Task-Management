import Project from "../models/projectsModel.js";
import * as HF from "./handlerFactory.js";
import {catchAsync} from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

const getProjects = HF.getAll(Project, ["owner", "members.user"]);

const getProjectById = HF.getOne(Project, [
  "owner",
  "members.user",
  "members.role",
  "tasks",
]);

const createProject = HF.createOne(Project);
const updateProject = HF.updateOne(Project);
const deleteProject = HF.deleteOne(Project);

export {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
