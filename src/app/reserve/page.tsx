<<<<<<< HEAD
import ReservationForm from "@/components/ReservationForm";
import Script from "next/script";
=======
import ReservationFormWithAutocomplete from "@/components/ReservationFormWithAutocomplete";
>>>>>>> c4ab0881ba48a6fae05f14bd3afcba6d8f9750eb

export const dynamic = "force-dynamic";

export default function ReservePage() {
  return (
    <main className="p-6">
<<<<<<< HEAD
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        strategy="afterInteractive"
      />
      <h1 className="text-2xl font-bold mb-3">Rezervasyon Talebi</h1>
      <ReservationForm />
=======
      <h1 className="text-2xl font-bold mb-3">Rezervasyon Talebi</h1>
      <ReservationFormWithAutocomplete />
>>>>>>> c4ab0881ba48a6fae05f14bd3afcba6d8f9750eb
    </main>
  );
}
