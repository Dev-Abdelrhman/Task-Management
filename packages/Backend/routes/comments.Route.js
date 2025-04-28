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

// router.use(CC.isMine);
router
  .route("/:id")
  .get(CC.getCommentById)
  .patch(CC.uploader, CC.updateComment)
  .delete(CC.deleteComment);

module.exports = router;
