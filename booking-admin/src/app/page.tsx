import Script from "next/script";
import ReservationForm from "@/components/ReservationForm";

export default function Home() {
  return (
    <main className="p-0">
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        strategy="afterInteractive"
      />
      <div className="grid md:grid-cols-2 grid-cols-1">
        <div className="h-screen">
          {/* Ana siteyi iframe ile gömüyoruz. Eğer site X-Frame-Options ile engellerse, burada görüntülenmez. */}
          <iframe
            src="https://www.teraturizm.com/"
            title="Tera Turizm"
            className="w-full h-full border-0"
          />
        </div>
        <div className="p-6 overflow-auto h-screen">
          <h1 className="text-2xl font-bold mb-3">Rezervasyon Talebi</h1>
          <ReservationForm />
        </div>
      </div>
    </main>
  );
}
