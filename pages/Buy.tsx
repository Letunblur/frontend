import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { FileItem } from "../types/types";
import ReportLinkDialog from "./ReportLinkDialog"; // <-- Import des Meldeformulars

const BuyPage = () => {
  const searchParams = useSearchParams();
  const parentId = searchParams.get("parent");

  const [files, setFiles] = useState<FileItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p>Lade Dateien...</p>;
  if (!files.length) return <p>Keine Dateien gefunden für Set: {parentId}</p>;

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
        <h2>{files[activeIndex].title}</h2>
        <img
          src={`https://ilgwunzkstvsdnzugawo.supabase.co/storage/v1/object/public/media_uploads/${files[activeIndex].preview_url}`}
          alt={files[activeIndex].title}
          width="300"
        />
        <p>{files[activeIndex].description}</p>
        <p>Preis: {files[activeIndex].price} €</p>
        <a
          href={`https://ilgwunzkstvsdnzugawo.supabase.co/storage/v1/object/public/media_uploads/${files[activeIndex].original_url}`}
          download
        >
          <button style={{ marginTop: "1rem" }}>Download</button>
        </a>

        {/* 👇 Das ist dein Meldesystem */}
        <ReportLinkDialog fileTitle={files[activeIndex].title} />
      </div>
    </div>
  );
};

export default BuyPage;
