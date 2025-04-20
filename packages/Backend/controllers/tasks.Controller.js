const Task = require("../models/task.Model.js");
const FC = require("./Factory.Controller.js");

const uploader = FC.uploader("image", 4);

const removeImages = FC.removeFile(Task, "image");

const isMine = FC.isOwner(Task, "owner");
const GetUserTasks = FC.getAll(Task, "owner");
const GetTasks = FC.getAll(Task, "project");
const GetOneTask = FC.getOne(Task, { path: "comments" });
const CreateTask = FC.createOne(Task, "image", "owner", "project");
const DeleteTask = FC.deleteOne(Task);
const UpdateTask = FC.updateOne(Task, "image");

module.exports = {
  isMine,
  GetTasks,
  GetUserTasks,
  GetOneTask,
  CreateTask,
  DeleteTask,
  UpdateTask,
  uploader,
  removeImages,
};
