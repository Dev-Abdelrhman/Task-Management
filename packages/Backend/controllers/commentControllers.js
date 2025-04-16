const Comment = require("../models/commentModel.js");
const HF = require("./handlerFactory.js");
const catchAsync = require("../utils/catchAsync.js");
const AppError = require("../utils/appError.js");

const uploader = HF.uploader("image", 2);

const removeImages = HF.removeFile(Comment, "image");

const getComments = HF.getAll(Comment, "project", ["project", "user"]);

const getCommentById = HF.getOne(Comment, "commentId", ["project", "user"]);

const createComment = HF.createOne(Comment, "image", "user", "project");

const isMine = HF.isOwner(Comment, "user");

const updateComment = HF.updateOne(Comment);

const deleteComment = HF.deleteOne(Comment);

const deleteCommentWithProject = HF.deleteOne(Comment, "project");

module.exports = {
  getComments,
  getCommentById,
  createComment,
  isMine,
  updateComment,
  deleteComment,
  deleteCommentWithProject,
  uploader,
  removeImages,
};
