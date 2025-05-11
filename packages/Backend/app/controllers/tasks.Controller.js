const Task = require("../models/task.Model.js");
const FC = require("./Factory.Controller.js");

const uploader = FC.uploader("image", 4);

const removeImages = FC.removeFile(Task, "image");

const isMine = (req, res, next) => {
  return FC.isOwner(Task, "assignedTo")(req, res, next);
};
const GetUserTasks = FC.getAll(Task, "owner", [], {
  project: { $exists: false },
});

const GetTasks = FC.getAll(Task, "project");
const GetOneTask = FC.getOne(Task, { path: "comments" });
const CreateTask = FC.createOne(
  Task,
  "tasks_images",
  "image",
  "owner",
  "project"
);
const DeleteTask = FC.deleteOne(Task);
const UpdateTask = FC.updateOne(Task, "tasks_images", "image");

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
