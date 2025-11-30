const Task = require("../models/task.Model.js");
const FS = require("../services/factory-services/factory.services.js");

const uploader = FS.uploader("image", 4);

const removeImages = FS.removeFile(Task, "image");

const isMine = (req, res, next) => {
  return FS.isOwner(Task, "assignedTo")(req, res, next);
};
const GetUserTasks = FS.getAll(Task, "owner", [], {
  project: { $exists: false },
});

const GetTasks = FS.getAll(Task, "project");
const GetOneTask = FS.getOne(Task, { path: "comments" });
const CreateTask = FS.createOne(
  Task,
  "tasks_images",
  "image",
  "owner",
  "project"
);
const DeleteTask = FS.deleteOne(Task);
const UpdateTask = FS.updateOne(Task, "tasks_images", "image");

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
