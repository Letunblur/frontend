// main.js
export async function sendReport() {
  const reportedLink = document.getElementById("link").value;
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const reason = document.getElementById("reason").value;
  const output = document.getElementById("output");

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
