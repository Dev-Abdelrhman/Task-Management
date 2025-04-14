const multer = require("multer");
const fs = require("fs");
const path = require("path");
const fileURLToPath = require("url").fileURLToPath;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    cb(null, filename);
  },
});

const upload = multer({
  storage: MS,
  limits: { fileSize: 10 * 1024 * 1024 },
});

module.exports = upload;
