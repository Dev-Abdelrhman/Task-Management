const express = require("express");
const RC = require("../controllers/rolesControllers.js");
const AC = require("../controllers/authControllers.js");

const router = express.Router({ mergeParams: true });

router.use(AC.protect);

router.route("/").get(RC.getAllRoles).post(RC.createRole);

router.use(RC.isMine);

router
  .route("/:id")
  .get(RC.getRoleById)
  .patch(RC.updateRole)
  .delete(RC.deleteRole);

module.exports = router;
