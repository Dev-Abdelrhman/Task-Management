const Attachment = require("../models/attachment.model.js");
const FC = require("./Factory.Controller.js");
const catchAsync = require("../utils/catchAsync.js");

const uploader = FC.uploader("file", 2);
const removeFiles = FC.removeFile(Attachment, "file");

const createAttachment = FC.createOne(Attachment, "file", "user", "task");
const getAttachments = FC.getAll(Attachment, "task", ["task"]);

const downloadAttachment = catchAsync(async (req, res) => {
  const file = await Attachment.findById(req.params.id);
  if (file) {
    res.redirect(file.url);
  } else {
    res.status(404).send("File not found");
  }
  res.status(500).send("Server Error");
});

const deleteAttachment = FC.deleteOne(Attachment);

module.exports = {
  createAttachment,
  getAttachments,
  downloadAttachment,
  deleteAttachment,
  uploader,
  removeFiles,
};
