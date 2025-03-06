import Comment from "../models/commentModel.js";
import * as HF from "./handlerFactory.js";
import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

const getComments = HF.getAll(Comment, "project", ["project", "user"]);

const getCommentById = HF.getOne(Comment, "commentId", ["project", "user"]);

const createComment = HF.createOne(Comment, "user", "project");

const isMine = HF.isOwner(Comment, "user");

const updateComment = HF.updateOne(Comment);

const deleteComment = HF.deleteOne(Comment);

export {
  getComments,
  getCommentById,
  createComment,
  isMine,
  updateComment,
  deleteComment,
};
