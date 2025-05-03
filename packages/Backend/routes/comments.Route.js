const express = require("express");
const CC = require("../app/controllers/comments.Controller.js");
const AC = require("../app/controllers/auth.Controller.js");
const RPP = require("../app/utils/requireProjectPermission.js");

const router = express.Router({ mergeParams: true });

router.use(AC.protect);

router
  .route("/")
  .get(RPP(["Read"]), CC.getComments)
  .post(RPP(["Read"]), CC.uploader, CC.createComment);

router
  .route("/:id")
  .get(CC.isMine, CC.getCommentById)
  .patch(CC.isMine, CC.uploader, CC.updateComment)
  .delete(CC.isMine, CC.deleteComment);

module.exports = router;
