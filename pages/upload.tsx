import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../lib/supabaseClient";
import { FileItem } from "../types/types"; // FileItem-Typ eingebunden

const Upload = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (selected && selected.length > 10) {
      setMessage("Maximal 10 Dateien erlaubt.");
      return;
    }
    setFiles(selected);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!files || files.length === 0) {
      setMessage("Bitte wähle Dateien aus.");
      return;
    }

    setUploading(true);
    const parentId = uuidv4();

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const { data, error } = await supabase.storage
        .from("media_uploads")
        .upload(`${parentId}/${file.name}`, file);

      if (error) {
        console.error(error);
        setMessage("Fehler beim Hochladen.");
        setUploading(false);
        return;
      }

      const fileMeta: Omit<FileItem, "id"> = {
        file_id: uuidv4(),
        user_id: "user_xyz", // später ersetzen durch echten Benutzer
        title: file.name,
        description: "Hochgeladen via Upload",
        slug: file.name.toLowerCase().replace(/\s/g, "-"),
        price: 0,
        original_url: data?.path ?? "",
        preview_url: data?.path ?? "",
        is_private: false,
        parent_file_id: parentId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        expire_at: null,
      };

      await supabase.from("file_metadata").insert([fileMeta]);
    }

    setMessage("Upload erfolgreich.");
    setUploading(false);
    setFiles(null);
  };

  return (
    <div>
      <h1>Upload</h1>
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Wird hochgeladen..." : "Hochladen"}
      </button>
      <p>{message}</p>
    </div>
  );
};

export default Upload;
