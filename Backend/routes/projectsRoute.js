import express from "express";
import * as PC from "../controllers/projectsControllers.js";

const router = express();

router.route("/").get(PC.getProjects).post(PC.createProject);

router
  .route("/:id")
  .get(PC.getProjectById)
  .put(PC.updateProject)
  .delete(PC.deleteProject);

export default router;
