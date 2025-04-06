"use client";

import { useState } from "react";
import PaypalIcon from "@/components/icons/PaypalIcon";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [price, setPrice] = useState("");

  const handleUpload = () => {
    console.log("Upload gedrückt!", { email, price });
    // Hier kannst du deine Upload- oder Backend-Logik einbauen
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white p-8">
      <div className="flex flex-col items-center space-y-4 mb-8">
        <PaypalIcon className="w-16 h-auto text-blue-600" />
        <p className="text-xl font-medium">Mit PayPal bezahlen</p>
      </div>

      <div className="w-full max-w-md space-y-4 border-t pt-8">
        <h2 className="text-lg font-semibold">LetUnblur – Medien hochladen</h2>

        <input
          type="email"
          placeholder="E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full rounded"
        />

        <input
          type="number"
          placeholder="Preis (€)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-2 w-full rounded"
        />

        <button
          type="button"
          onClick={handleUpload}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Link generieren
        </button>
      </div>
    </main>
  );
}
