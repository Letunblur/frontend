// 🔄 Für LetUnblur: Upload & Bezahlung

let uploadedFileId = "";
let uploadedFileUrl = "";

async function upload() {
  const file = document.getElementById("fileInput")?.files?.[0];
  const email = document.getElementById("email")?.value;
  const price = document.getElementById("price")?.value;

  if (!file || !email || !price) {
    alert("Bitte Datei, E-Mail und Preis angeben.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    document.getElementById("output").innerText = "❌ Upload fehlgeschlagen.";
    return;
  }

  const data = await res.json();
  uploadedFileUrl = data.link;
  uploadedFileId = data.link.split("/").pop();

  const previewImage = document.getElementById("previewImage");
  const previewBox = document.getElementById("preview");
  if (previewImage && previewBox) {
    previewImage.src = uploadedFileUrl;
    previewBox.style.display = "block";
  }

  document.getElementById("output").innerText = "✅ Upload erfolgreich!";
}

async function bezahlen() {
  const email = document.getElementById("email")?.value;
  const price = document.getElementById("price")?.value;

  const res = await fetch("/api/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: parseInt(price) * 100,
      email: email,
      fileId: uploadedFileId,
    }),
  });

  const data = await res.json();
  if (data.url) {
    window.location.href = data.url;
  } else {
    alert("❌ Fehler bei der Bezahlung.");
  }
}

// 🛡️ Meldesystem (Report-Funktion)

async function sendReport() {
  const reportedLink = document.getElementById("link")?.value;
  const name = document.getElementById("name")?.value;
  const email = document.getElementById("reportEmail")?.value;
  const reason = document.getElementById("reason")?.value;
  const output = document.getElementById("reportOutput");

  if (!reportedLink || !name || !email || !reason) {
    output.innerHTML = "❌ Bitte alle Felder ausfüllen.";
    return;
  }

  output.innerHTML = "⏳ Bericht wird gesendet...";

  try {
    const res = await fetch("http://localhost:8000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reportId: crypto.randomUUID(),
        reportedLink,
        name,
        email,
        reason,
        createdAt: new Date().toISOString(),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Unbekannter Fehler");
    }

    output.innerHTML = "✅ Meldung erfolgreich gesendet!";
  } catch (err) {
    console.error(err);
    output.innerHTML = `❌ Fehler beim Senden:<br><code>${err.message}</code>`;
  }
}
