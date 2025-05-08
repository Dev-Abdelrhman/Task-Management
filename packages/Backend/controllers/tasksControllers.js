import Task from "../models/tasksModel.js";
import * as HF from "./handlerFactory.js";

const isMine = HF.isOwner(Task, "owner");
const GetUserTasks = HF.getAll(Task, "owner");
const GetTasks = HF.getAll(Task, "project");
const GetOneTask = HF.getOne(Task, { path: "comments" });
const CreateTask = HF.createOne(Task, "owner", "project");
const DeleteTask = HF.deleteOne(Task);
const UpdateTask = HF.updateOne(Task);

export {
  isMine,
  GetTasks,
  GetUserTasks,
  GetOneTask,
  CreateTask,
  DeleteTask,
  UpdateTask,
};
