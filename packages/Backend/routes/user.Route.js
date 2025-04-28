const express = require("express");
const UC = require("../app/controllers/user.Controller.js");
const AC = require("../app/controllers/auth.Controller.js");

const ProjectsRoutes = require("./projects.Route.js");
const InviteRouter = require("./invite.Route.js");
const router = express();

router.get("/google", AC.googleAuth);
router.get("/google/callback", AC.googleAuthCallback);
router.post("/continueSignUpWithGoogle", AC.completeGoogleSignup);
router.post("/signup", AC.signup);
router.post("/signin", AC.signin);
router.post("/forgotPassword", AC.forgotPassword);
router.patch("/resetPassword/:token", AC.resetPassword);
router.post("/logout", AC.logout);

router.use(AC.protect);

router.get("/google/user", UC.getUser);
router.patch("/updateMyPassword", UC.updatePassword);
router.get("/me", UC.getMe, UC.getUser);
router.patch("/updateMe", UC.uploader, UC.updateMe);
router.patch("/:id/removeImage", UC.removeImages);
router.delete("/deleteMe", UC.deleteMe);

router.use("/:id/projects", ProjectsRoutes);
router.use("/:id/invite", InviteRouter);

module.exports = router;
