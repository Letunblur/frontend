// buyPage.js
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.5";

// Supabase-Client initialisieren
const supabase = createClient("https://ilgwunzkstvsdnzugawo.supabase.co", "DEIN_PUBLIC_ANON_KEY");

document.addEventListener("DOMContentLoaded", async () => {
  const slug = window.location.pathname.split("/buy/")[1];
  if (!slug) return;

  console.log("📦 Slug:", slug);

  const { data, error } = await supabase
    .from("uploads") // ✅ deine Tabelle in Supabase
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    document.body.innerHTML = "<h1>❌ Datei nicht gefunden</h1>";
    console.error("Fehler bei Supabase:", error);
    return;
  }

  // HTML-Bereiche einfügen oder befüllen
  document.body.innerHTML = `
    <h1>${data.title || "📷 Unbenanntes Bild"}</h1>
    <p>${data.description || "Keine Beschreibung vorhanden"}</p>
    <p><strong>Preis:</strong> €${(data.price / 100).toFixed(2)}</p>
    <img src="${data.image_url}" alt="Bild" style="max-width:100%;filter:blur(15px);">
    
    <input type="email" id="email" placeholder="Deine E-Mail">
    <button id="pay">💳 Jetzt bezahlen</button>
    <br><br>
    <button id="report">🚨 Melden</button>
  `;

  document.getElementById("pay").addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    if (!email) return alert("Bitte gib eine E-Mail ein");

    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: data.price,
        email,
        fileId: data.id,
      }),
    });

    const json = await res.json();
    if (json.url) window.location.href = json.url;
    else alert("Fehler beim Weiterleiten zu Stripe");
  });

  document.getElementById("report").addEventListener("click", () => {
    window.location.href = `/index.html#report?link=https://letunblur.com/buy/${slug}`;
  });
});
