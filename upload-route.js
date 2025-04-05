const express = require("express");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config(); // .env laden

const router = express.Router();

// 📁 Zielordner für lokalen Upload
const uploadFolder = path.join(__dirname, "../public/lovable-uploads");

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

// 🧠 Supabase-Client (mit Service Role Key!)
const supabase = createClient(
  "https://ilgwunzkstvsdnzugawo.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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

// 📜 Erlaubte MIME-Types
const erlaubteMimes = [
  "image/jpeg", "image/png", "image/webp", "image/gif",
  "application/pdf", "application/zip", "application/x-rar-compressed",
  "video/mp4", "video/quicktime"
];

const fileFilter = (req, file, cb) => {
  if (erlaubteMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    console.warn("⛔️ MIME-Type blockiert:", file.mimetype);
    cb(new Error("❌ Dateiformat nicht erlaubt."), false);
  }
};

const upload = multer({ storage, fileFilter });

// 🚀 POST /api/upload
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("❌ Keine Datei empfangen.");
    }

    const { user_id, price, title, description } = req.body;

    // 📎 Basisdaten
    const fileName = req.file.filename;
    const slug = `${fileName.split('.')[0]}-${crypto.randomBytes(3).toString("hex")}`;
    const fileUrl = `https://letunblur.com/lovable-uploads/${fileName}`;

    // 📥 In Supabase-Tabelle einfügen
    const { error } = await supabase.from("file_metadata").insert([{
      file_id: fileName,
      user_id,
      title: title || fileName,
      description: description || "Hochgeladene Datei",
      price: parseFloat(price) || 5,
      slug,
      preview_url: fileUrl,
      original_url: fileUrl,
      is_private: false
    }]);

    if (error) {
      console.error("❌ Fehler beim Supabase-Insert:", error);
      return res.status(500).json({ error: "Insert fehlgeschlagen" });
    }

    console.log("📥 Datei + Metadaten gespeichert:", slug);
    res.json({
      success: true,
      slug,
      link: `/buy/${slug}`,
      message: "Datei erfolgreich hochgeladen & gespeichert"
    });
  } catch (err) {
    console.error("❌ Serverfehler beim Upload:", err);
    res.status(500).json({ error: "Interner Serverfehler" });
  }
});

module.exports = router;
