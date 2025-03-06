import express from "express";
import * as CC from "../controllers/commentControllers.js";
import * as AC from "../controllers/authControllers.js";

const router = express.Router({ mergeParams: true });

router.use(AC.protect);

router.route("/").get(CC.getComments).post(CC.createComment);

router.use(CC.isMine);

router
  .route("/:id")
  .get(CC.getCommentById)
  .put(CC.updateComment)
  .delete(CC.deleteComment);

export default router;
