const express = require("express");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

// 📁 Zielordner definieren
const uploadFolder = path.join(__dirname, "uploads");

// 🧠 Multer-Konfiguration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    const uniqueName = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

// 📜 Dateifilter für beliebte Formate
const erlaubteMimes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "application/zip",
  "application/x-rar-compressed",
  "video/mp4",
  "video/quicktime" // für .mov
];

const fileFilter = (req, file, cb) => {
  if (erlaubteMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    console.warn("⛔️ Upload geblockt. Nicht erlaubter MIME-Type:", file.mimetype);
    cb(new Error("❌ Dateiformat nicht erlaubt."), false);
  }
};

const upload = multer({ storage, fileFilter });

// 🚀 POST /api/upload
router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("❌ Keine Datei empfangen.");
  }

  // ✅ Lokaler Dateipfad (öffentlich zugänglich über express.static)
  const filePath = path.join("/uploads", req.file.filename);

  console.log("📥 Datei erfolgreich hochgeladen:", filePath);
  res.json({ link: filePath });
});

module.exports = router;
