const Comment = require("../models/comment.Model.js");
const FC = require("./Factory.Controller.js");

const uploader = FC.uploader("image", 2);

const removeImages = FC.removeFile(Comment, "image");

const getComments = FC.getAll(Comment, "project", ["project", "user"]);

const getCommentById = FC.getOne(Comment, "commentId", ["project", "user"]);

const createComment = FC.createOne(
  Comment,
  "comments_images",
  "image",
  "user",
  "project"
);

const isMine = (req, res, next) => {
  return FC.isOwner(Comment, "user")(req, res, next);
};

const updateComment = FC.updateOne(Comment, "comments_images", "image");

const deleteComment = FC.deleteOne(Comment);

const deleteCommentWithProject = FC.deleteOne(Comment, "project");

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
