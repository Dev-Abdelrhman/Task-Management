import Task from "../models/tasksModel.js";
import HF from "./handlerFactory.js";

const GetTasks = HF.getAll(Task);
const GetOneTask = HF.getOne(Task, { path: "comments" });
const CreateTask = HF.createOne(Task);
const DeleteTask = HF.deleteOne(Task);
const UpdateTask = HF.updateOne(Task);

export default {
  GetTasks,
  CreateTask,
  DeleteTask,
  UpdateTask,
};
