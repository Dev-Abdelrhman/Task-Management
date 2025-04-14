const express = require("express");
const UC = require("../controllers/userControllers.js");
const AC = require("../controllers/authControllers.js");

const ProjectsRoutes = require("./projectsRoute.js");
const InviteRouter = require("./inviteRoute.js");
const router = express();

router.route("/google").get(AC.googleAuth);
router.route("/google/callback").get(AC.googleAuthCallback);
router.route("/google/user").get(AC.protect, AC.getAuthUser);
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
router.use("/:id/invite", InviteRouter);

module.exports = router;
