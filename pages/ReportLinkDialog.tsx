import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";

interface ReportLinkDialogProps {
  fileTitle: string;
}

const ReportLinkDialog = ({ fileTitle }: ReportLinkDialogProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !reason) {
      setMessage("Bitte fülle alle Felder aus.");
      return;
    }

    const { error } = await supabase.from("reports").insert({
      name,
      email,
      reason,
      reported_link: window.location.href,
    });

    if (error) {
      console.error(error);
      setMessage("Fehler beim Senden.");
    } else {
      setMessage("Danke für deine Meldung 🙏");
      setName("");
      setEmail("");
      setReason("");
    }
  };

  return (
    <div style={{ marginTop: "2rem", padding: "1rem", border: "1px solid #ccc" }}>
      <h3>Inhalt melden: {fileTitle}</h3>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Dein Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        /><br />
        <input
          type="email"
          placeholder="Deine E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br />
        <textarea
          placeholder="Warum meldest du diesen Inhalt?"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        /><br />
        <button type="submit">Melden</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ReportLinkDialog;
