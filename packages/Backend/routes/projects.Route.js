const express = require("express");
const PC = require("../app/controllers/projects.Controller.js");
const AC = require("../app/controllers/auth.Controller.js");
const RPP = require("../app/utils/requireProjectPermission.js");

const CommentRouter = require("./comments.Route.js");
const RoleRouter = require("./roles.Route.js");
const TaskRouter = require("./tasks.Route.js");
const InviteRouter = require("./invite.Route.js");

const router = express.Router({ mergeParams: true });

router.use(AC.protect);

router.route("/").get(PC.getProjects).post(PC.uploader, PC.createProject);
router.get("/:projectId/members");
router
  .route("/:id")
  .get(RPP(["Read"]), PC.getProjectById)
  .patch(RPP(["Edit"]), PC.uploader, PC.updateProject)
  .delete(RPP(["Delete"]), PC.deleteProject);

router.get("/:id/members", RPP(["Add"]), PC.getProjectMembers);
router.patch("/:id/removeImage", RPP(["Edit"]), PC.removeImages);

router.use("/:id/comments", CommentRouter);
router.use("/:id/roles", RoleRouter);
router.use("/:id/tasks", TaskRouter);
router.use("/:id/invite", InviteRouter);

module.exports = router;
