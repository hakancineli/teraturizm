"use client";

import { useEffect, useMemo, useState, useRef } from "react";

type ReservationPayload = {
  from: string;
  to: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  phone: string;
  flightCode?: string;
  passengers: string[];
  luggageCount: number;
};

declare global {
  interface Window {
    google: any;
    initAutocomplete: () => void;
  }
}

export default function ReservationFormWithAutocomplete() {
  const today = useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const nowTime = useMemo(() => {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    return `${hh}:${mi}`;
  }, []);

  const [payload, setPayload] = useState<ReservationPayload>({
    from: "",
    to: "",
    date: today,
    time: nowTime,
    phone: "",
    flightCode: "",
    passengers: [""],
    luggageCount: 0,
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  
  const fromInputRef = useRef<HTMLInputElement>(null);
  const toInputRef = useRef<HTMLInputElement>(null);
  const fromAutocompleteRef = useRef<any>(null);
  const toAutocompleteRef = useRef<any>(null);

  useEffect(() => {
    // Load Google Maps API
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initAutocomplete`;
    script.async = true;
    script.defer = true;
    
    window.initAutocomplete = () => {
      setGoogleMapsLoaded(true);
      
      if (fromInputRef.current && window.google) {
        fromAutocompleteRef.current = new window.google.maps.places.Autocomplete(fromInputRef.current, {
          types: ['address'],
          componentRestrictions: { country: 'tr' }
        });
        
        fromAutocompleteRef.current.addListener('place_changed', () => {
          const place = fromAutocompleteRef.current.getPlace();
          if (place.formatted_address) {
            setField("from", place.formatted_address);
          }
        });
      }
      
      if (toInputRef.current && window.google) {
        toAutocompleteRef.current = new window.google.maps.places.Autocomplete(toInputRef.current, {
          types: ['address'],
          componentRestrictions: { country: 'tr' }
        });
        
        toAutocompleteRef.current.addListener('place_changed', () => {
          const place = toAutocompleteRef.current.getPlace();
          if (place.formatted_address) {
            setField("to", place.formatted_address);
          }
        });
      }
    };
    
    script.onerror = () => {
      console.error('Google Maps API failed to load');
      setGoogleMapsLoaded(false);
    };
    
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const setField = (k: keyof ReservationPayload, v: any) => {
    setPayload((p) => ({ ...p, [k]: v }));
  };

  const setPassengerName = (i: number, v: string) => {
    setPayload((p) => {
      const arr = [...p.passengers];
      arr[i] = v;
      return { ...p, passengers: arr };
    });
  };

  const setPassengerCount = (count: number) => {
    setPayload((p) => {
      const c = Math.max(1, Math.min(50, count || 1));
      const arr = [...p.passengers];
      if (arr.length < c) arr.push(...Array(c - arr.length).fill(""));
      if (arr.length > c) arr.length = c;
      return { ...p, passengers: arr };
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          passengers: payload.passengers.filter((x) => x && x.trim() !== ""),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Kayıt başarısız");
      setMessage("Rezervasyon talebiniz alındı.");
      // Reset minimal
      setPayload((p) => ({
        ...p,
        from: "",
        to: "",
        phone: "",
        flightCode: "",
        passengers: [""],
        luggageCount: 0,
      }));
    } catch (err: any) {
      setMessage(err?.message || "Hata oluştu");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-4">
      <div>
        <label className="block text-sm font-medium">Nereden</label>
        <input 
          ref={fromInputRef}
          className="border rounded px-3 py-2 w-full" 
          placeholder="Çıkış noktası"
          value={payload.from}
          onChange={(e) => setField("from", e.target.value)} 
          required 
        />
        {!googleMapsLoaded && (
          <p className="text-xs text-gray-500 mt-1">
            Google Maps API yüklenemedi. Manuel adres girebilirsiniz.
          </p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium">Nereye</label>
        <input 
          ref={toInputRef}
          className="border rounded px-3 py-2 w-full" 
          placeholder="Varış noktası"
          value={payload.to}
          onChange={(e) => setField("to", e.target.value)} 
          required 
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Tarih</label>
          <input type="date" className="border rounded px-3 py-2 w-full"
            value={payload.date}
            onChange={(e) => setField("date", e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium">Saat</label>
          <input type="time" className="border rounded px-3 py-2 w-full"
            value={payload.time}
            onChange={(e) => setField("time", e.target.value)} required />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium">İletişim Numarası</label>
        <input className="border rounded px-3 py-2 w-full" placeholder="+90..."
          value={payload.phone}
          onChange={(e) => setField("phone", e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-medium">Uçuş Kodu (opsiyonel)</label>
        <input className="border rounded px-3 py-2 w-full" placeholder="TK1234"
          value={payload.flightCode}
          onChange={(e) => setField("flightCode", e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium">Kişi Sayısı</label>
          <input type="number" min={1} max={50} className="border rounded px-3 py-2 w-full"
            value={payload.passengers.length}
            onChange={(e) => setPassengerCount(parseInt(e.target.value, 10))} />
        </div>
        <div>
          <label className="block text-sm font-medium">Bagaj Sayısı</label>
          <input type="number" min={0} max={99} className="border rounded px-3 py-2 w-full"
            value={payload.luggageCount}
            onChange={(e) => setField("luggageCount", parseInt(e.target.value, 10) || 0)} />
        </div>
      </div>
      <div className="space-y-2">
        <div className="font-medium">Yolcu İsimleri</div>
        {payload.passengers.map((name, idx) => (
          <input key={idx} className="border rounded px-3 py-2 w-full" placeholder={`Yolcu ${idx + 1} adı`}
            value={name}
            onChange={(e) => setPassengerName(idx, e.target.value)} />
        ))}
      </div>
      <button disabled={submitting} className="bg-black text-white rounded px-4 py-2">
        {submitting ? "Gönderiliyor..." : "Rezervasyon Talebi Gönder"}
      </button>
      {message && <p className="text-sm mt-2">{message}</p>}
    </form>
  );
}