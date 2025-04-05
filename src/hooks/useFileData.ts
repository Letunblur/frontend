import { useEffect, useState } from "react";

export const useFileData = (slug: string | undefined, paymentSuccess: boolean) => {
  const [file, setFile] = useState<any>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [directImageUrl, setDirectImageUrl] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false); // Verhindert Dauer-Refetch

  useEffect(() => {
    // Verhindere erneutes Abrufen der Daten, wenn slug nicht vorhanden oder bereits abgefragt wurde
    if (!slug || hasFetched) return;

    setIsLoading(true);

    try {
      // Hole die Datei-Informationen aus localStorage
      const stored = localStorage.getItem("uploadedFiles");
      const files = stored ? JSON.parse(stored) : [];
      const found = files.find((f: any) => f.slug === slug);

      if (found) {
        // Wenn die Datei gefunden wurde, setze die Zustände
        setFile(found);
        if (paymentSuccess) {
          setIsPaid(true);
          setDirectImageUrl(found.fileUrl); // Setze die URL des freigeschalteten Bildes
        }
      } else {
        console.warn("⚠️ Datei mit Slug nicht gefunden:", slug);
      }

      setHasFetched(true); // Markiere den Abruf als abgeschlossen
    } catch (err) {
      console.error("Fehler beim Parsen von localStorage:", err);
    } finally {
      setIsLoading(false);
    }
  }, [slug, paymentSuccess, hasFetched]); // Abhängigkeit von slug, paymentSuccess und hasFetched

  return { file, isPaid, isLoading, directImageUrl };
};
