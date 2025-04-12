import express from "express";
import * as PC from "../controllers/projectsControllers.js";
import * as AC from "../controllers/authControllers.js";

import CommentRouter from "./commentRoute.js";
import RoleRouter from "./roleRoute.js";
import TaskRouter from "./tasksRoute.js";
import InviteRouter from "./inviteRoute.js";

const router = express.Router({ mergeParams: true });

router.use(AC.protect);

router
  .route("/")
  .get(PC.getProjects)
  .post(PC.uploader, PC.uploadImages, PC.createProject);

router.route("/invited").get(PC.getInvitedProjects);

router
  .route("/:id")
  .get(PC.getProjectById)
  .patch(PC.uploader, PC.uploadImages, PC.updateProject)
  .delete(PC.deleteProject);

router.route("/:id/removeImage").patch(PC.removeImages);

router.use("/:id/comments", CommentRouter);
router.use("/:id/roles", RoleRouter);
router.use("/:id/tasks", TaskRouter);
router.use("/:id/invite", InviteRouter);

export default router;
