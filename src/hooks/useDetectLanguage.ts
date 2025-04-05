import { useEffect, useState } from "react";

export function useDetectLanguage() {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const browserLang = navigator.language || "en";
    setLanguage(browserLang.split("-")[0]); // z. B. "de-DE" => "de"
  }, []);

  return language;
}
