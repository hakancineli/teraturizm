import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const reservations = await prisma.reservation.findMany({
    include: { passengers: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Rezervasyonlar</h1>
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
