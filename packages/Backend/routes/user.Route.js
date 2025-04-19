const express = require("express");
const UC = require("../controllers/user.Controller.js");
const AC = require("../controllers/auth.Controller.js");

const ProjectsRoutes = require("./projects.Route.js");
const InviteRouter = require("./invite.Route.js");
const router = express();

router.route("/google").get(AC.googleAuth);
router.route("/google/callback").get(AC.googleAuthCallback);
router.route("/google/user").get(AC.protect, AC.getAuthUser);
router.route("/continueSignUpWithGoogle").post(AC.completeGoogleSignup);
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
