import Task from "../models/tasksModel.js";
import * as HF from "./handlerFactory.js";

const GetTasks = HF.getAll(Task);
const GetOneTask = HF.getOne(Task, { path: "comments" });
const CreateTask = HF.createOne(Task, "user", "project");
const DeleteTask = HF.deleteOne(Task);
const UpdateTask = HF.updateOne(Task);

export default {
  GetTasks,
  GetOneTask,
  CreateTask,
  DeleteTask,
  UpdateTask,
};
