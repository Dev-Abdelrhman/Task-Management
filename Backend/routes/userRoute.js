import express from "express";
import * as UC from "../controllers/userControllers.js";
import * as AC from "../controllers/authControllers.js";

const router = express();

router.route("/google").get(AC.googleAuth);
router.route("/google/callback").get(AC.googleAuthCallback);
router.route("/signup").post(AC.signup);
router.route("/signin").post(AC.signin);

router.route("/").get(UC.getAllUsers).post(UC.createUser);

router
  .route("/:id")
  .get(UC.getUserById)
  .put(UC.updateUser)
  .delete(UC.deleteUser);

export default router;
