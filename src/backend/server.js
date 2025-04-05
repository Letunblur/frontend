const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");  // Dateisystemmodul für den Zugriff auf Dateien
const uploadRoute = require("./upload-route.js");
const checkoutRoute = require("./checkout.js");

const app = express();

// CORS und JSON-Middleware aktivieren
app.use(cors());
app.use(express.json());

// Stelle sicher, dass der statische Ordner für Bilder funktioniert
app.use(express.static(path.join(__dirname, 'public')));  // Public Ordner für Bilder

// Dynamische API-Route zum Abrufen des Bildpfads
app.post('/api/upload', uploadRoute);  // Nutze deine bestehende Upload-Route, um Bilder zu speichern

// API-Router zum Abrufen des Bildpfads nach dem Upload
app.get('/api/getImageUrl', (req, res) => {
  const uploadedImagesDirectory = path.join(__dirname, 'public', 'lovable-uploads');
  
  // Liste der hochgeladenen Bilddateien abrufen
  fs.readdir(uploadedImagesDirectory, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Fehler beim Abrufen der Bilder' });
    }

    // Generiere die URL für das erste Bild (oder mehrere Bilder, je nach Bedarf)
    const imageUrl = files.length > 0 ? `/lovable-uploads/${files[0]}` : null;  // Hier nimmst du das erste Bild als Beispiel

    // Sende den Pfad des Bildes zurück
    res.json({ imageUrl: imageUrl });
  });
});

// Deine bestehenden Routen für Stripe Checkout
app.use("/api", checkoutRoute);  // Stripe Checkout-Routen

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf http://localhost:${PORT}`);
});
