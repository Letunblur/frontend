const express = require("express");
const cors = require("cors");
const path = require("path");
const uploadRoute = require("./upload-route.js");
const checkoutRoute = require("./checkout.js"); // 👈 NEU: Stripe Checkout einbinden

const app = express();

app.use(cors());
app.use(express.json()); // 👈 Wichtig für POST-Body (z. B. amount, email)

app.use(express.static(path.join(__dirname))); // Static files z. B. index.html

app.use("/api", uploadRoute);      // Datei-Upload-Routen
app.use("/api", checkoutRoute);    // Stripe Checkout-Routen

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf http://localhost:${PORT}`);
});
