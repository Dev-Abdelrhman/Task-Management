const express = require("express");
const AC = require("../controllers/auth.Controller.js");
const AtC = require("../controllers/attachments.controller.js");

const router = express.Router({ mergeParams: true });

router.use(AC.protect);

router
  .route("/")
  .get(AtC.getAttachments)
  .post(AtC.uploader, AtC.createAttachment);

router.route("/delete").delete(AtC.removeFiles, AtC.deleteAttachment);
router.route("/download/:id").get(AtC.downloadAttachment);

module.exports = router;
