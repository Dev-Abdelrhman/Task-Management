import express from "express";

import * as AC from "../controllers/authControllers.js";

const router = express.Router({ mergeParams: true });

router.use(AC.protect);

router.route("/").get().post();
