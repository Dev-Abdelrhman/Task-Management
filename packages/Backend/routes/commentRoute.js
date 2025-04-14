const express = require("express");
const CC = require("../controllers/commentControllers.js");
const AC = require("../controllers/authControllers.js");

const router = express.Router({ mergeParams: true });

router.use(AC.protect);

router.route("/").get(CC.getComments).post(CC.createComment);

router.use(CC.isMine);

router
  .route("/:id")
  .get(CC.getCommentById)
  .patch(CC.updateComment)
  .delete(CC.deleteComment);

module.exports = router;
