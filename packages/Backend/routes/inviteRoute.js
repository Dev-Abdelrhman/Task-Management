import express from "express";
import * as IC from "../controllers/inviteControllers.js";
import * as AC from "../controllers/authControllers.js";

const router = express.Router({ mergeParams: true });
router.use(AC.protect);

router.route("/sender").get(IC.getAllInvitesForSender);
router.route("/receiver").get(IC.getAllInvitesForReceiver);
router.route("/search").get(IC.searchUsersForInvite);

router.route("/:id/decline").post(IC.declineInvite);
router.route("/:id/accept").post(IC.acceptInvite);
router.route("/:id").get(IC.getOneInvite).delete(IC.deleteInvite);

router.route("/sendInvite").post(IC.sendInvite);

export default router;
