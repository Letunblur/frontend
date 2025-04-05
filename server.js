const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const uploadRoute = require("./upload-route.js");
const checkoutRoute = require("./checkout.js");

const app = express();

// CORS konfigurieren (nur für deine Live-Seite)
const corsOptions = {
  origin: 'https://letunblur.com',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// JSON Body Parsing
app.use(express.json());

// Statische Dateien aus dem Public-Ordner bereitstellen
app.use(express.static(path.join(__dirname, 'public')));

// API: Bildpfad nach Upload abrufen
app.get('/api/getImageUrl', (req, res) => {
  const uploadedImagesDirectory = path.join(__dirname, 'public', 'lovable-uploads');

  fs.readdir(uploadedImagesDirectory, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Fehler beim Abrufen der Bilder' });
    }

    const imageUrl = files.length > 0 ? `/lovable-uploads/${files[0]}` : null;
    res.json({ imageUrl: imageUrl });
  });
});

// Upload- & Checkout-APIs
app.use("/api", uploadRoute);
app.use("/api", checkoutRoute);

// 👉 SPA-Fallback: Jede andere Route auf index.html weiterleiten
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Server starten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf http://localhost:${PORT}`);
});
