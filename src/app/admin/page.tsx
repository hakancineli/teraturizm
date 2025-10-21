<<<<<<< HEAD
import { prisma } from "@/lib/prisma";
=======
"use client";

import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import ReservationsTable from "@/components/ReservationsTable";
import AccountingTable from "@/components/AccountingTable";
>>>>>>> c4ab0881ba48a6fae05f14bd3afcba6d8f9750eb

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

<<<<<<< HEAD
export default async function AdminPage() {
  let reservations: Awaited<ReturnType<typeof prisma.reservation.findMany>> = [];
  let error: string | null = null;
  try {
    reservations = await prisma.reservation.findMany({
      include: { passengers: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (e: any) {
    error = e?.message || "Database error";
  }

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Rezervasyonlar</h1>
      {error && (
        <div style={{ padding: 12, marginBottom: 16, background: "#fff7ed", border: "1px solid #fdba74", color: "#9a3412", borderRadius: 6 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Hata</div>
          <div>{error}</div>
          <div style={{ marginTop: 8, fontSize: 12, color: "#a16207" }}>
            Lütfen Vercel'de <code>DATABASE_URL</code> değerinin doğru olduğundan ve build sırasında <code>prisma db push</code>'ın çalıştığından emin olun.
          </div>
        </div>
      )}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>Tarih</th>
              <th style={th}>Saat</th>
              <th style={th}>Nereden</th>
              <th style={th}>Nereye</th>
              <th style={th}>Telefon</th>
              <th style={th}>Uçuş</th>
              <th style={th}>Kişi</th>
              <th style={th}>Bagaj</th>
              <th style={th}>Yolcular</th>
              <th style={th}>Durum</th>
              <th style={th}>Oluşturulma</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => (
              <tr key={r.id}>
                <td style={td}>{r.date}</td>
                <td style={td}>{r.time}</td>
                <td style={td}>{r.from}</td>
                <td style={td}>{r.to}</td>
                <td style={td}>{r.phone}</td>
                <td style={td}>{r.flightCode || "-"}</td>
                <td style={td}>{r.passengerCount}</td>
                <td style={td}>{r.luggageCount}</td>
                <td style={td}>
                  {r.passengers && r.passengers.length
                    ? r.passengers.map((p) => p.name).join(", ")
                    : "-"}
                </td>
                <td style={td}>{r.status}</td>
                <td style={td}>{new Date(r.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

const th: React.CSSProperties = {
  textAlign: "left",
  padding: "8px 10px",
  borderBottom: "1px solid #e5e7eb",
  background: "#f9fafb",
  fontWeight: 600,
  fontSize: 13,
  whiteSpace: "nowrap",
};

const td: React.CSSProperties = {
  padding: "8px 10px",
  borderBottom: "1px solid #f1f5f9",
  fontSize: 13,
  verticalAlign: "top",
  whiteSpace: "nowrap",
};
=======
export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("reservations");

  return (
    <AdminLayout>
      <div style={{ width: "100%" }}>
        <div style={{ 
          display: "flex", 
          borderBottom: "1px solid #e5e7eb", 
          marginBottom: 16 
        }}>
          <button
            style={{
              padding: "12px 16px",
              backgroundColor: activeTab === "reservations" ? "#3b82f6" : "transparent",
              color: activeTab === "reservations" ? "white" : "#6b7280",
              border: "none",
              borderBottom: activeTab === "reservations" ? "2px solid #3b82f6" : "2px solid transparent",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              borderRadius: "4px 4px 0 0",
            }}
            onClick={() => setActiveTab("reservations")}
          >
            Rezervasyonlar
          </button>
          <button
            style={{
              padding: "12px 16px",
              backgroundColor: activeTab === "accounting" ? "#3b82f6" : "transparent",
              color: activeTab === "accounting" ? "white" : "#6b7280",
              border: "none",
              borderBottom: activeTab === "accounting" ? "2px solid #3b82f6" : "2px solid transparent",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              borderRadius: "4px 4px 0 0",
            }}
            onClick={() => setActiveTab("accounting")}
          >
            Muhasebe
          </button>
        </div>
        
        <div>
          {activeTab === "reservations" && <ReservationsTable />}
          {activeTab === "accounting" && <AccountingTable />}
        </div>
      </div>
    </AdminLayout>
  );
}
>>>>>>> c4ab0881ba48a6fae05f14bd3afcba6d8f9750eb
