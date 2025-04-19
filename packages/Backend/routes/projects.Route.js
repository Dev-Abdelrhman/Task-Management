const express = require("express");
const PC = require("../controllers/projects.Controller.js");
const AC = require("../controllers/auth.Controller.js");

const CommentRouter = require("./comments.Route.js");
const RoleRouter = require("./roles.Route.js");
const TaskRouter = require("./tasks.Route.js");
const InviteRouter = require("./invite.Route.js");

const router = express.Router({ mergeParams: true });

router.use(AC.protect);

router.route("/").get(PC.getProjects).post(PC.uploader, PC.createProject);

router.route("/invited").get(PC.getInvitedProjects);

router
  .route("/:id")
  .get(PC.getProjectById)
  .patch(PC.uploader, PC.updateProject)
  .delete(PC.deleteProject);

router.route("/:id/removeImage").patch(PC.removeImages);

router.use("/:id/comments", CommentRouter);
router.use("/:id/roles", RoleRouter);
router.use("/:id/tasks", TaskRouter);
router.use("/:id/invite", InviteRouter);

module.exports = router;
