const express = require("express");
const TC = require("../controllers/tasks.Controller.js");
const AC = require("../controllers/auth.Controller.js");
const RPP = require("../utils/requireProjectPermission.js");

const router = express.Router({ mergeParams: true });

router.use(AC.protect);

router
  .route("/")
  .get(RPP(["Read"]), TC.GetTasks)
  .post(RPP(["Add"]), TC.uploader, TC.CreateTask);
router.get("/userTasks", TC.GetUserTasks);

router
  .route("/:id")
  .get(RPP(["Read"]), TC.GetOneTask)
  .patch(RPP(["Edit"]), TC.isMine, TC.uploader, TC.UpdateTask)
  .delete(RPP(["Delete"]), TC.DeleteTask);

module.exports = router;
