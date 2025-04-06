import PaypalIcon from "@/components/icons/PaypalIcon";

export default function HomePage() {
  return (
    <main style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <div style={{ textAlign: "center" }}>
        <PaypalIcon className="w-16 h-auto text-blue-600" />
        <p style={{ marginTop: "1rem", fontSize: "1.25rem" }}>Mit PayPal bezahlen</p>
      </div>
    </main>
  );
}
