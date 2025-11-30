const Comment = require("../models/comment.Model.js");
const FS = require("../services/factory-services/Factory.services.js");

const uploader = FS.uploader("image", 2);

const removeImages = FS.removeFile(Comment, "image");

const getComments = FS.getAll(Comment, "project", ["project", "user"]);

const getCommentById = FS.getOne(Comment, "commentId", ["project", "user"]);

const createComment = FS.createOne(
  Comment,
  "comments_images",
  "image",
  "user",
  "project"
);

const isMine = (req, res, next) => {
  return FS.isOwner(Comment, "user")(req, res, next);
};

const updateComment = FS.updateOne(Comment, "comments_images", "image");

const deleteComment = FS.deleteOne(Comment);

module.exports = {
  getComments,
  getCommentById,
  createComment,
  isMine,
  updateComment,
  deleteComment,
  uploader,
  removeImages,
};
