import express from "express";
import * as UC from "../controllers/userControllers.js";
import * as AC from "../controllers/authControllers.js";

import ProjectsRoutes from "./projectsRoute.js";

const router = express();

router.route("/google").get(AC.googleAuth);
router.route("/google/callback").get(AC.googleAuthCallback);
router.route("/continueSignUpWithGoogle").post(AC.completeGoogleSignup);
router.route("/refresh").get(AC.refreshAccessToken);
router.route("/signup").post(AC.signup);
router.route("/signin").post(AC.signin);
router.route("/forgotPassword").post(AC.forgotPassword);
router.route("/resetPassword/:token").patch(AC.resetPassword);
router.route("/logout").post(AC.logout);
router.patch("/updateMyPassword", AC.updatePassword);

router.route("/").get(UC.getAllUsers).post(UC.createUser);

router
  .route("/:id")
  .get(UC.getUserById)
  .put(UC.updateUser)
  .delete(UC.deleteUser);

router.use("/:id/projects", ProjectsRoutes);

export default router;
