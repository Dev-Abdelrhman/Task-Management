import express from "express";
import * as PC from "../controllers/projectsControllers.js";
import * as AC from "../controllers/authControllers.js";

import CommentRouter from "./commentRoute.js";

const router = express.Router({ mergeParams: true });

router.use("/:projectId/comments", CommentRouter);

router.use(AC.protect);

router.route("/").get(PC.getProjects).post(PC.createProject);

router
  .route("/:id")
  .get(PC.getProjectById)
  .put(PC.updateProject)
  .delete(PC.deleteProject);

export default router;
