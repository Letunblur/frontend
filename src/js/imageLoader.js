// Datei: src/js/imageLoader.js

if (window.hasRunImageLoader) {
  console.log("ImageLoader bereits ausgeführt – skip");
} else {
  window.hasRunImageLoader = true;

  import("https://esm.sh/@supabase/supabase-js@2.39.5").then(({ createClient }) => {
    const supabase = createClient(
      "https://ilgwunzkstvsdnzugawo.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsZ3d1bnprc3R2c2RuenVnYXdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0NjUyOTQsImV4cCI6MjA1OTA0MTI5NH0.l932PSd2eAkBVe-WjsdZDKieCL-c8dnlpOGZb7HwHP4"
    );

    document.addEventListener("DOMContentLoaded", async () => {
      const slug = window.location.pathname.split("/buy/")[1];
      console.log("📦 Slug:", slug);

      const { data, error } = await supabase
        .from("file_metadata")
        .select("id, title, description, price, preview_url, slug")
        .eq("slug", slug)
        .single();

      console.log("🔍 Supabase Response:", { data, error });

      if (error || !data) {
        document.body.innerHTML = "<h1>❌ Datei nicht gefunden</h1>";
        return;
      }

      document.body.innerHTML = `
        <h1>${data.title}</h1>
        <p>${data.description}</p>
        <p><strong>Preis:</strong> €${parseFloat(data.price).toFixed(2)}</p>
        <img src="${data.preview_url}" style="max-width:100%;filter:blur(15px);">
        <input type="email" id="email" placeholder="Deine E-Mail">
        <button id="pay">💳 Jetzt bezahlen</button>
        <button id="report">🚨 Melden</button>
      `;

      document.getElementById("pay").addEventListener("click", async () => {
        const email = document.getElementById("email").value;
        const res = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Math.round(parseFloat(data.price) * 100),
            email,
            fileId: data.id,
          }),
        });
        const json = await res.json();
        if (json.url) window.location.href = json.url;
      });

      document.getElementById("report").addEventListener("click", () => {
        window.location.href = `/index.html#report?link=https://letunblur.com/buy/${slug}`;
      });
    });
  });
}
