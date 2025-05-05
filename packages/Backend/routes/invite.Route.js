const express = require("express");
const IC = require("../app/controllers/invite.Controller.js");
const AC = require("../app/controllers/auth.Controller.js");
const RPP = require("../app/utils/requireProjectPermission.js");

const router = express.Router({ mergeParams: true });
router.use(AC.protect);

router.get("/sender", IC.getAllInvitesForSender);
router.get("/receiver", IC.getAllInvitesForReceiver);

router.post("/:id/decline", IC.declineInvite);
router.post("/:id/accept", IC.acceptInvite);

router.use(RPP(["Admin"]));

router.get("/search", IC.searchUsersForInvite);

router.post("/sendInvite", IC.sendInvite);

router.delete("/:id", IC.deleteInvite);

module.exports = router;
