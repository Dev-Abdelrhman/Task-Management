import express from "express";
import * as TC from "../controllers/tasksControllers.js";
import * as AC from "../controllers/authControllers.js";

const router = express.Router({ mergeParams: true });

router.use(AC.protect);

router.route("/").get(TC.GetTasks).post(TC.CreateTask);
router.route("/userTasks").get(TC.GetUserTasks);
router.use(TC.isMine);

router
  .route("/:id")
  .get(TC.GetOneTask)
  .patch(TC.UpdateTask)
  .delete(TC.DeleteTask);

export default router;
