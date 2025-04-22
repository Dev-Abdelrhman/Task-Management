const express = require("express");
const IC = require("../controllers/invite.Controller.js");
const AC = require("../controllers/auth.Controller.js");

const router = express.Router({ mergeParams: true });
router.use(AC.protect);

router.get("/sender", IC.getAllInvitesForSender);
router.get("/receiver", IC.getAllInvitesForReceiver);
router.get("/search", IC.searchUsersForInvite);

router.post("/:id/decline", IC.declineInvite);
router.post("/:id/accept", IC.acceptInvite);

router
  .route("/:id")
  .get(IC.getOneInvite)
  .patch(IC.updateInvite)
  .delete(IC.deleteInvite);

router.post("/sendInvite", IC.sendInvite);

module.exports = router;
