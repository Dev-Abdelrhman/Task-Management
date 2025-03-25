import express from "express";
import * as RC from "../controllers/rolesControllers.js";
import * as AC from "../controllers/authControllers.js";

const router = express.Router({ mergeParams: true });

router.use(AC.protect);

router.route("/").get(RC.getAllRoles).post(RC.createRole);

router.use(RC.isMine);

router
  .route("/:id")
  .get(RC.getRoleById)
  .patch(RC.updateRole)
  .delete(RC.deleteRole);

export default router;
