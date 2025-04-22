const express = require("express");
const TC = require("../controllers/tasks.Controller.js");
const AC = require("../controllers/auth.Controller.js");

const router = express.Router({ mergeParams: true });

router.use(AC.protect);

router.route("/").get(TC.GetTasks).post(TC.uploader, TC.CreateTask);
router.get("/userTasks", TC.GetUserTasks);

router
  .route("/:id")
  .get(TC.GetOneTask)
  .patch(TC.uploader, TC.UpdateTask)
  .delete(TC.DeleteTask);

module.exports = router;
