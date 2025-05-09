const express = require("express");
const UC = require("../app/controllers/user.Controller.js");
const AC = require("../app/controllers/auth.Controller.js");
const { generalLimiter, authLimiter } = require("../app/utils/rateLimite.js");

const ProjectsRoutes = require("./projects.Route.js");
const InviteRouter = require("./invite.Route.js");
const router = express();

router.get("/google", generalLimiter, AC.googleAuth);
router.get("/google/callback", generalLimiter, AC.googleAuthCallback);
router.post("/continueSignUpWithGoogle", AC.completeGoogleSignup);
router.post("/signup", authLimiter, AC.signup);
router.post("/signin", authLimiter, AC.signin);
router.post("/forgotPassword", authLimiter, AC.forgotPassword);
router.patch("/resetPassword/:token", authLimiter, AC.resetPassword);
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
