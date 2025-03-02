import express from "express";
import * as UC from "../controllers/userControllers.js";

const router = express();

router.route("/").get(UC.getAllUsers).post(UC.createUser);

router
  .route("/:id")
  .get(UC.getUserById)
  .put(UC.updateUser)
  .delete(UC.deleteUser);

export default router;
