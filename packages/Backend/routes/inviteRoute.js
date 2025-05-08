import express from "express";
import * as IC from "../controllers/inviteControllers.js";

const router = express();

router.route("/").get(IC.getAllInvites);

router.route("/:id").get(IC.getOneInvite).delete(IC.deleteInvite);

router.route("/sendInvite").post(IC.sendInvite);

router.route("/acceptOrDeclineInvite").patch(IC.acceptOrDeclineInvite);

export default router;
