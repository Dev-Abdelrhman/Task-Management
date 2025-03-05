import Project from "../models/projectsModel.js";
import * as HF from "./handlerFactory.js";
import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

const setOwner = (req, res, next) => {
  // Allow nested routes
  if (!req.body.owner) {
    req.body.owner = req.params.id;
  }
  next();
};

const getProjects = HF.getAll(Project, "owner", ["owner", "members.user"]);

const getProjectById = HF.getOne(Project, [
  "owner",
  "members.user",
  "members.role",
  "tasks",
]);

const createProject = HF.createOne(Project, "owner");
const updateProject = HF.updateOne(Project);
const deleteProject = HF.deleteOne(Project);

export {
  setOwner,
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
