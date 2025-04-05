// Datei: src/js/imageLoader.js

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.5";

// Supabase-Client initialisieren
const supabase = createClient(
  "https://ilgwunzkstvsdnzugawo.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsZ3d1bnprc3R2c2RuenVnYXdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0NjUyOTQsImV4cCI6MjA1OTA0MTI5NH0.l932PSd2eAkBVe-WjsdZDKieCL-c8dnlpOGZb7HwHP4"
);

document.addEventListener("DOMContentLoaded", async () => {
  const slug = window.location.pathname.split("/buy/")[1];
  if (!slug) return;

  console.log("📦 Slug:", slug);

  const { data, error } = await supabase
    .from("file_metadata")
    .select("id, title, description, price, preview_url, slug")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    document.body.innerHTML = "<h1>❌ Datei nicht gefunden</h1>";
    console.error("Fehler bei Supabase:", error);
    return;
  }

  document.body.innerHTML = `
    <h1>${data.title || "📷 Bild"}</h1>
    <p>${data.description || "Keine Beschreibung"}</p>
    <p><strong>Preis:</strong> €${parseFloat(data.price).toFixed(2)}</p>
    <img src="${data.preview_url}" alt="Bild" style="max-width:100%;filter:blur(15px);border-radius:10px;">

    <input type="email" id="email" placeholder="Deine E-Mail" style="margin-top:20px;">
    <button id="pay">💳 Jetzt bezahlen</button>
    <br><br>
    <button id="report">🚨 Melden</button>
  `;

  // Stripe-Kauf
  document.getElementById("pay").addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    if (!email) return alert("Bitte gib eine E-Mail ein");

    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Math.round(parseFloat(data.price) * 100), // Stripe braucht Cent!
        email,
        fileId: data.id,
      }),
    });

    const json = await res.json();
    if (json.url) {
      window.location.href = json.url;
    } else {
      alert("Fehler beim Weiterleiten zu Stripe");
      console.error(json);
    }
  });

  // Report-Link
  document.getElementById("report").addEventListener("click", () => {
    window.location.href = `/index.html#report?link=https://letunblur.com/buy/${slug}`;
  });
});
