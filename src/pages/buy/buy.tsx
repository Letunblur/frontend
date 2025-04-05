import { useParams } from "react-router-dom";
import { useFileData } from "@/hooks/useFileData"; // Der Hook, um die Datei zu holen
import BlurredImage from "@/components/images/BlurredImage"; // Zeigt das verpixelte Bild
import { useLanguage } from "@/hooks/useLanguage"; // Für die Übersetzungen

const BuyPage = () => {
  const { slug } = useParams<{ slug: string }>(); // Hole den Slug aus der URL
  const { file, isPaid, isLoading, directImageUrl } = useFileData(slug, true); // Hole Datei-Daten
  const { t } = useLanguage(); // Übersetzungen für die Seite

  const handlePayment = () => {
    // Funktion, die den Zahlungsprozess (Stripe) auslöst
    // Zum Beispiel, indem eine Checkout-Session erstellt wird
  };

  if (isLoading) {
    return <div>{t("loading")}</div>; // Ladeanzeige
  }

  if (!file) {
    return <div>{t("fileNotFound")}</div>; // Fehler, wenn keine Datei gefunden wird
  }

  return (
    <div className="container">
      <h1>{t("payToUnblur")}</h1> {/* Überschrift für den Kauf */}
      <div>
        {/* Das verpixelte Bild, das freigeschaltet wird, wenn bezahlt */}
        <BlurredImage
          src={directImageUrl || file?.fileUrl}
          alt={file?.name || "Image"}
          isPaid={isPaid}
        />
      </div>
      
      {/* Button zur Bezahlung, wenn das Bild noch nicht freigeschaltet ist */}
      {!isPaid && (
        <button onClick={handlePayment} className="pay-now-button">
          {t("payNow")} {/* Übersetzte "Pay Now"-Schaltfläche */}
        </button>
      )}
      
      {/* Anzeige, wenn das Bild erfolgreich freigeschaltet wurde */}
      {isPaid && <p>{t("imageUnlocked")}</p>}
    </div>
  );
};

export default BuyPage;
