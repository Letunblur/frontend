import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface BlurredImageProps {
  src: string;
  alt: string;
  isPaid: boolean;
  className?: string;
  blurAmount?: number;
}

const BlurredImage = ({
  src,
  alt,
  isPaid = false,
  className = "",
  blurAmount = 17,
}: BlurredImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRevealed, setIsRevealed] = useState(isPaid);
  const [imgError, setImgError] = useState(false);

  // Setze Reveal-State, wenn Bild bezahlt ist
  useEffect(() => {
    if (isPaid) {
      const timeout = setTimeout(() => setIsRevealed(true), 300);
      return () => clearTimeout(timeout);
    }
  }, [isPaid]);

  // Bild preloaden
  useEffect(() => {
    if (!src) return;
    const img = new Image();
    img.src = src;
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setImgError(true);
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  if (imgError) {
    return (
      <div className={`bg-muted flex items-center justify-center ${className}`}>
        <p className="text-sm text-muted-foreground">❌ Bild konnte nicht geladen werden</p>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && <Skeleton className="absolute inset-0 w-full h-full" />}

      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`w-full h-full object-cover transition-all duration-1000 ease-out ${
          isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
        }`}
        style={{
          filter: isRevealed ? "none" : `blur(${blurAmount}px)`,
        }}
        onLoad={() => setIsLoaded(true)}
        onError={() => setImgError(true)}
      />

      {/* Overlay bei unscharfem Bild */}
      {isLoaded && !isRevealed && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-white font-medium transition-opacity duration-500">
          <span className="px-3 py-2 bg-primary/80 rounded text-sm backdrop-blur-sm">
            Pay to Unblur
          </span>
        </div>
      )}

      {/* „Unlocked“-Badge */}
      {isLoaded && isRevealed && (
        <div className="absolute bottom-0 right-0 m-4 px-3 py-1 bg-primary/60 text-white text-xs rounded backdrop-blur-sm animate-fade-in">
          ✅ Unlocked
        </div>
      )}
    </div>
  );
};

export default BlurredImage;
