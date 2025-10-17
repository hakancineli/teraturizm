import ReservationForm from "@/components/ReservationForm";
import Script from "next/script";

export const dynamic = "force-dynamic";

export default function ReservePage() {
  return (
    <main className="p-6">
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        strategy="afterInteractive"
      />
      <h1 className="text-2xl font-bold mb-3">Rezervasyon Talebi</h1>
      <ReservationForm />
    </main>
  );
}
