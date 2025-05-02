const multer = require("multer");
const fs = require("fs");
const path = require("path");

const MS = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    const Id = req.params.id || "new";
    const filename = `file-${Id}-${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}.${ext}`;

    const filePath = path.join(__dirname, "../uploads", filename);
    setTimeout(() => {
      fs.unlink(filePath, (err) => {
        if (err) console.error("Failed to delete temp file:", err);
        else console.log("🧹 Temp file deleted:", filePath);
      });
    }, 15 * 1000);

    cb(null, filename);
  },
});

const upload = multer({
  storage: MS,
});

module.exports = upload;
