import express from "express";
import * as PC from "../controllers/projectsControllers.js";
import * as AC from "../controllers/authControllers.js";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(PC.getProjects)
  .post(PC.createProject, PC.setOwner, AC.protect);

router
  .route("/:id")
  .get(PC.getProjectById)
  .put(PC.updateProject)
  .delete(PC.deleteProject);

export default router;
