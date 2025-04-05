async function upload() {
  const file = document.getElementById("fileInput")?.files?.[0];
  const email = document.getElementById("email")?.value;
  const price = document.getElementById("price")?.value;

  if (!file || !email || !price) {
    alert("Bitte Datei, E-Mail und Preis angeben.");
    return;
  }

  const user = await supabase.auth.getUser();
  const user_id = user?.data?.user?.id;

  if (!user_id) {
    alert("Du musst eingeloggt sein, um hochzuladen.");
    return;
  }

  const fileName = `${Date.now()}-${file.name}`;
  const filePath = `media_uploads/${user_id}/${fileName}`;

  try {
    // 1. Datei in Supabase hochladen
    const { error: uploadError } = await supabase.storage
      .from("media_uploads")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // 2. Öffentliche URL generieren
    const { publicURL, error: urlError } = supabase
      .storage
      .from("media_uploads")
      .getPublicUrl(filePath);

    if (urlError) throw urlError;

    uploadedFileUrl = publicURL;
    uploadedFileId = fileName;

    // 3. Metadaten an dein Node.js Backend senden
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id,
        file_name: fileName,
        price,
        title: file.name,
        description: "Hochgeladen von User",
      }),
    });

    const result = await res.json();

    if (!result.success) {
      throw new Error("Fehler beim Speichern der Metadaten.");
    }

    // 4. Vorschau anzeigen
    const previewImage = document.getElementById("previewImage");
    const previewBox = document.getElementById("preview");
    if (previewImage && previewBox) {
      previewImage.src = uploadedFileUrl;
      previewBox.style.display = "block";
    }

    document.getElementById("output").innerHTML = `
      ✅ Upload erfolgreich!<br>
      🔗 <a href="${result.link}" target="_blank">${result.link}</a>
    `;

  } catch (error) {
    console.error(error);
    document.getElementById("output").innerText = `❌ Fehler beim Upload: ${error.message}`;
  }
}
