const express = require("express");
const PC = require("../controllers/projectsControllers.js");
const AC = require("../controllers/authControllers.js");

const CommentRouter = require("./commentRoute.js");
const RoleRouter = require("./roleRoute.js");
const TaskRouter = require("./tasksRoute.js");
const InviteRouter = require("./inviteRoute.js");

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

module.exports = router;
