import { useParams, useSearchParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { BlurredImage } from "@/components/images/BlurredImage";
import { useFileData } from "@/hooks/useFileData";
import { useDetectLanguage } from "@/hooks/useDetectLanguage";
import { Loader } from "lucide-react";

export default function BuyPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const lang = useDetectLanguage();
  const paymentSuccess = searchParams.get("success") === "true";

  const {
    file,
    isPaid,
    isLoading,
    directImageUrl,
  } = useFileData(slug, paymentSuccess);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <Loader className="animate-spin w-6 h-6 mb-2 text-muted-foreground" />
          <p className="text-muted-foreground">
            {lang === "de" ? "Lädt..." : "Loading..."}
          </p>
        </div>
      </MainLayout>
    );
  }

  if (!file) {
    return (
      <MainLayout>
        <div className="text-center py-20">
          <p className="text-muted-foreground">
            {lang === "de"
              ? "Diese Datei existiert nicht."
              : "This file does not exist."}
          </p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-4">{file.title}</h1>
        <BlurredImage
          src={directImageUrl || file.fileUrl}
          alt={file.title}
          isPaid={isPaid}
        />
      </div>
    </MainLayout>
  );
}
