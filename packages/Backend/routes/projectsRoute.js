import express from "express";
import * as PC from "../controllers/projectsControllers.js";
import * as AC from "../controllers/authControllers.js";

import CommentRouter from "./commentRoute.js";
import RoleRouter from "./roleRoute.js";
import TaskRouter from "./tasksRoute.js";

const router = express.Router({ mergeParams: true });

router.use(AC.protect);

router.route("/").get(PC.getProjects).post(PC.createProject);

router
  .route("/:id")
  .get(PC.getProjectById)
  .patch(PC.updateProject)
  .delete(PC.deleteProject);

router.use("/:id/comments", CommentRouter);
router.use("/:id/roles", RoleRouter);
router.use("/:id/tasks", TaskRouter);

export default router;
