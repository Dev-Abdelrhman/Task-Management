const express = require("express");
const IC = require("../controllers/inviteControllers.js");
const AC = require("../controllers/authControllers.js");

const router = express.Router({ mergeParams: true });
router.use(AC.protect);

router.route("/sender").get(IC.getAllInvitesForSender);
router.route("/receiver").get(IC.getAllInvitesForReceiver);
router.route("/search").get(IC.searchUsersForInvite);

router.route("/:id/decline").post(IC.declineInvite);
router.route("/:id/accept").post(IC.acceptInvite);
router
  .route("/:id")
  .get(IC.getOneInvite)
  .patch(IC.updateInvite)
  .delete(IC.deleteInvite);

router.route("/sendInvite").post(IC.sendInvite);

module.exports = router;
