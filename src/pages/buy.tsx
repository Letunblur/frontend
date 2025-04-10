"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { FileItem } from "../../../types/types";

const BuyPage = () => {
  const searchParams = useSearchParams();
  const parentId = searchParams.get("parent");

  const [files, setFiles] = useState<FileItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const [reportName, setReportName] = useState("");
  const [reportEmail, setReportEmail] = useState("");
  const [reportReason, setReportReason] = useState("");
  const [sendingReport, setSendingReport] = useState(false);

  useEffect(() => {
    const fetchFiles = async () => {
      if (!parentId) return;

      setLoading(true);
      const { data, error } = await supabase
        .from("file_metadata")
        .select("*")
        .eq("parent_file_id", parentId);

      if (error) {
        console.error("Fehler beim Laden:", error.message);
      } else {
        setFiles(data as FileItem[]);
      }

      setLoading(false);
    };

    fetchFiles();
  }, [parentId]);

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentFile = files[activeIndex];

    const newReport = {
      reported_link: currentFile.file_id,
      name: reportName,
      email: reportEmail,
      reason: reportReason,
    };

    // Optional: auch im localStorage speichern
    const localReports = JSON.parse(localStorage.getItem("fileReports") || "[]");
    localReports.push({ ...newReport, reportedAt: new Date().toISOString() });
    localStorage.setItem("fileReports", JSON.stringify(localReports));

    // An Supabase senden
    setSendingReport(true);
    const { error } = await supabase.from("reports").insert([newReport]);
    setSendingReport(false);

    if (error) {
      alert("Beim Einreichen der Meldung ist ein Fehler aufgetreten.");
      console.error("Supabase Insert Error:", error);
    } else {
      alert("Danke für deine Meldung!");
      setReportName("");
      setReportEmail("");
      setReportReason("");
    }
  };

  if (loading) return <p>Lade Dateien...</p>;
  if (!files.length) return <p>Keine Dateien gefunden für Set: {parentId}</p>;

  const currentFile = files[activeIndex];

  return (
    <div>
      <h1>Download-Set</h1>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        {files.map((file, index) => (
          <button
            key={file.file_id}
            onClick={() => setActiveIndex(index)}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: index === activeIndex ? "#333" : "#eee",
              color: index === activeIndex ? "#fff" : "#000",
              border: "1px solid #ccc",
              cursor: "pointer",
            }}
          >
            {file.title}
          </button>
        ))}
      </div>

      <div>
        <h2>{currentFile.title}</h2>
        <img
          src={`https://ilgwunzkstvsdnzugawo.supabase.co/storage/v1/object/public/media_uploads/${currentFile.preview_url}`}
          alt={currentFile.title}
          width="300"
        />
        <p>{currentFile.description}</p>
        <p>Preis: {currentFile.price} €</p>
        <a
          href={`https://ilgwunzkstvsdnzugawo.supabase.co/storage/v1/object/public/media_uploads/${currentFile.original_url}`}
          download
        >
          <button style={{ marginTop: "1rem" }}>Download</button>
        </a>
      </div>

      {/* 🔔 Report-Meldung */}
      <div style={{ marginTop: "2rem", borderTop: "1px solid #ddd", paddingTop: "1rem" }}>
        <h3>Datei melden</h3>
        <form onSubmit={handleReportSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxWidth: "400px" }}>
          <input
            type="text"
            placeholder="Dein Name"
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Deine E-Mail (optional)"
            value={reportEmail}
            onChange={(e) => setReportEmail(e.target.value)}
          />
          <textarea
            placeholder="Grund der Meldung"
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            required
          />
          <button type="submit" disabled={sendingReport}>
            {sendingReport ? "Sende..." : "Meldung abschicken"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BuyPage;
