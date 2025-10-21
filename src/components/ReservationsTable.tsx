"use client";

import { useState, useEffect } from "react";

interface Passenger {
  id: number;
  name: string;
  reservationId: number;
}

interface Driver {
  id: number;
  name: string;
  phone: string;
  isExternal: boolean;
  vehicle?: {
    plate: string;
    brand: string;
    model: string;
  };
}

interface Reservation {
  id: number;
  from: string;
  to: string;
  date: string;
  time: string;
  phone: string;
  flightCode: string | null;
  passengerCount: number;
  luggageCount: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  price?: number;
  paymentStatus?: "UNPAID" | "PAID" | "PARTIALLY_PAID" | "REFUNDED";
  driverId?: number;
  isExternal?: boolean;
  externalDriverName?: string;
  externalDriverPhone?: string;
  driver?: Driver;
  createdAt: string;
  updatedAt: string;
  passengers?: Passenger[];
}

export default function ReservationsTable() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<number | null>(null);
  const [isExternalDriver, setIsExternalDriver] = useState(false);
  const [externalDriverName, setExternalDriverName] = useState("");
  const [externalDriverPhone, setExternalDriverPhone] = useState("");
  const [price, setPrice] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<Reservation["paymentStatus"]>("UNPAID");

  useEffect(() => {
    fetchReservations();
    fetchDrivers();
  }, []);

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Oturum bulunamadı");
      }

      const response = await fetch("/api/reservations", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Rezervasyonlar alınamadı");
      }

      const data = await response.json();
      if (data.ok) {
        setReservations(data.data);
      } else {
        throw new Error(data.error || "Bilinmeyen hata");
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Bir hata oluştu";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchDrivers = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Oturum bulunamadı");
      }

      const response = await fetch("/api/drivers", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Şoförler alınamadı");
      }

      const data = await response.json();
      setDrivers(data);
    } catch (err: unknown) {
      console.error("Error fetching drivers:", err);
    }
  };

  const updateReservationStatus = async (id: number, status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED") => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Oturum bulunamadı");
      }

      const response = await fetch(`/api/reservations/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Durum güncellenemedi");
      }

      // Refresh the reservations list
      fetchReservations();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Bir hata oluştu";
      alert(errorMessage);
    }
  };

  const assignDriver = async () => {
    if (!selectedReservation) return;

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Oturum bulunamadı");
      }

      const updateData: any = {
        driverId: selectedDriver,
        isExternal: isExternalDriver,
      };

      if (isExternalDriver) {
        updateData.externalDriverName = externalDriverName;
        updateData.externalDriverPhone = externalDriverPhone;
      }

      if (price) updateData.price = parseFloat(price);
      if (paymentStatus) updateData.paymentStatus = paymentStatus;

      const response = await fetch(`/api/reservations/${selectedReservation.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error("Şoför atanamadı");
      }

      // Close modal and refresh
      setShowDriverModal(false);
      setSelectedReservation(null);
      setSelectedDriver(null);
      setIsExternalDriver(false);
      setExternalDriverName("");
      setExternalDriverPhone("");
      setPrice("");
      setPaymentStatus("UNPAID");
      fetchReservations();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Bir hata oluştu";
      alert(errorMessage);
    }
  };

  const openDriverModal = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setSelectedDriver(reservation.driverId || null);
    setIsExternalDriver(reservation.isExternal || false);
    setExternalDriverName(reservation.externalDriverName || "");
    setExternalDriverPhone(reservation.externalDriverPhone || "");
    setPrice(reservation.price?.toString() || "");
    setPaymentStatus(reservation.paymentStatus || "UNPAID");
    setShowDriverModal(true);
  };

  const deleteReservation = async (id: number) => {
    if (!confirm("Bu rezervasyonu silmek istediğinizden emin misiniz?")) {
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Oturum bulunamadı");
      }

      const response = await fetch(`/api/reservations/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Rezervasyon silinemedi");
      }

      // Refresh the reservations list
      fetchReservations();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Bir hata oluştu";
      alert(errorMessage);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PENDING":
        return {
          padding: "4px 8px",
          borderRadius: "4px",
          fontSize: "12px",
          fontWeight: "bold",
          backgroundColor: "#fef3c7",
          color: "#92400e",
        };
      case "CONFIRMED":
        return {
          padding: "4px 8px",
          borderRadius: "4px",
          fontSize: "12px",
          fontWeight: "bold",
          backgroundColor: "#d1fae5",
          color: "#065f46",
        };
      case "CANCELLED":
        return {
          padding: "4px 8px",
          borderRadius: "4px",
          fontSize: "12px",
          fontWeight: "bold",
          backgroundColor: "#fee2e2",
          color: "#991b1b",
        };
      case "COMPLETED":
        return {
          padding: "4px 8px",
          borderRadius: "4px",
          fontSize: "12px",
          fontWeight: "bold",
          backgroundColor: "#e0e7ff",
          color: "#3730a3",
        };
      default:
        return {};
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Beklemede";
      case "CONFIRMED":
        return "Onaylandı";
      case "CANCELLED":
        return "İptal Edildi";
      case "COMPLETED":
        return "Tamamlandı";
      default:
        return status;
    }
  };

  const getPaymentStatusStyle = (status: string) => {
    switch (status) {
      case "UNPAID":
        return {
          padding: "4px 8px",
          borderRadius: "4px",
          fontSize: "12px",
          fontWeight: "bold",
          backgroundColor: "#fef3c7",
          color: "#92400e",
        };
      case "PAID":
        return {
          padding: "4px 8px",
          borderRadius: "4px",
          fontSize: "12px",
          fontWeight: "bold",
          backgroundColor: "#d1fae5",
          color: "#065f46",
        };
      case "PARTIALLY_PAID":
        return {
          padding: "4px 8px",
          borderRadius: "4px",
          fontSize: "12px",
          fontWeight: "bold",
          backgroundColor: "#e0e7ff",
          color: "#3730a3",
        };
      case "REFUNDED":
        return {
          padding: "4px 8px",
          borderRadius: "4px",
          fontSize: "12px",
          fontWeight: "bold",
          backgroundColor: "#fee2e2",
          color: "#991b1b",
        };
      default:
        return {};
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case "UNPAID":
        return "Ödenmedi";
      case "PAID":
        return "Ödendi";
      case "PARTIALLY_PAID":
        return "Kısmi Ödeme";
      case "REFUNDED":
        return "İade Edildi";
      default:
        return status;
    }
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: 12, marginBottom: 16, background: "#fff7ed", border: "1px solid #fdba74", color: "#9a3412", borderRadius: 6 }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Hata</div>
        <div>{error}</div>
        <div style={{ marginTop: 8, fontSize: 12, color: "#a16207" }}>
          Lütfen veritabanı bağlantısının doğru olduğundan ve <code>prisma db push</code>'ın çalıştığından emin olun.
        </div>
      </div>
    );
  }

  return (
    <div>
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
              <th style={th}>Şoför</th>
              <th style={th}>Fiyat</th>
              <th style={th}>Ödeme</th>
              <th style={th}>Durum</th>
              <th style={th}>İşlemler</th>
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
                <td style={td}>
                  {r.driver ? (
                    <div>
                      <div style={{ fontWeight: 600 }}>{r.driver.name}</div>
                      <div style={{ fontSize: 11, color: "#6b7280" }}>
                        {r.driver.isExternal ? "Dış Şoför" : "Şirket Şoförü"}
                      </div>
                      {r.driver.vehicle && (
                        <div style={{ fontSize: 11, color: "#6b7280" }}>
                          {r.driver.vehicle.plate} - {r.driver.vehicle.brand} {r.driver.vehicle.model}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span style={{ color: "#9ca3af" }}>Atanmadı</span>
                  )}
                </td>
                <td style={td}>
                  {r.price ? `₺${r.price.toFixed(2)}` : "-"}
                </td>
                <td style={td}>
                  {r.paymentStatus ? (
                    <span style={getPaymentStatusStyle(r.paymentStatus)}>
                      {getPaymentStatusText(r.paymentStatus)}
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
                <td style={td}>
                  <span style={getStatusStyle(r.status)}>
                    {getStatusText(r.status)}
                  </span>
                </td>
                <td style={td}>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <button 
                      style={{
                        padding: "4px 8px",
                        backgroundColor: "#3b82f6",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "12px",
                        cursor: "pointer",
                      }}
                      onClick={() => openDriverModal(r)}
                    >
                      Şoför Ata
                    </button>
                    <button 
                      style={{
                        padding: "4px 8px",
                        backgroundColor: "#10b981",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "12px",
                        cursor: "pointer",
                        opacity: r.status === "CONFIRMED" || r.status === "COMPLETED" ? 0.5 : 1,
                      }}
                      onClick={() => updateReservationStatus(r.id, "CONFIRMED")}
                      disabled={r.status === "CONFIRMED" || r.status === "COMPLETED"}
                    >
                      Onayla
                    </button>
                    <button 
                      style={{
                        padding: "4px 8px",
                        backgroundColor: "#ef4444",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "12px",
                        cursor: "pointer",
                        opacity: r.status === "CANCELLED" ? 0.5 : 1,
                      }}
                      onClick={() => updateReservationStatus(r.id, "CANCELLED")}
                      disabled={r.status === "CANCELLED"}
                    >
                      İptal
                    </button>
                    <button 
                      style={{
                        padding: "4px 8px",
                        backgroundColor: "#8b5cf6",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "12px",
                        cursor: "pointer",
                        opacity: r.status === "COMPLETED" ? 0.5 : 1,
                      }}
                      onClick={() => updateReservationStatus(r.id, "COMPLETED")}
                      disabled={r.status === "COMPLETED"}
                    >
                      Tamamla
                    </button>
                    <button 
                      style={{
                        padding: "4px 8px",
                        backgroundColor: "#6b7280",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "12px",
                        cursor: "pointer",
                      }}
                      onClick={() => deleteReservation(r.id)}
                    >
                      Sil
                    </button>
                  </div>
                </td>
                <td style={td}>{new Date(r.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Driver Assignment Modal */}
      {showDriverModal && selectedReservation && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: "white",
            borderRadius: 8,
            padding: 24,
            width: "90%",
            maxWidth: 500,
            maxHeight: "90vh",
            overflowY: "auto",
          }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
              Şoför Ata - {selectedReservation.from} → {selectedReservation.to}
            </h2>
            
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
                Şoför Tipi
              </label>
              <select
                style={{
                  width: "100%",
                  padding: 8,
                  border: "1px solid #d1d5db",
                  borderRadius: 4,
                  fontSize: 14,
                }}
                value={isExternalDriver ? "external" : "company"}
                onChange={(e) => setIsExternalDriver(e.target.value === "external")}
              >
                <option value="company">Şirket Şoförü</option>
                <option value="external">Dış Şoför</option>
              </select>
            </div>

            {isExternalDriver ? (
              <>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
                    Şoför Adı
                  </label>
                  <input
                    type="text"
                    style={{
                      width: "100%",
                      padding: 8,
                      border: "1px solid #d1d5db",
                      borderRadius: 4,
                      fontSize: 14,
                    }}
                    value={externalDriverName}
                    onChange={(e) => setExternalDriverName(e.target.value)}
                    placeholder="Şoför adını girin"
                  />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
                    Şoför Telefon
                  </label>
                  <input
                    type="tel"
                    style={{
                      width: "100%",
                      padding: 8,
                      border: "1px solid #d1d5db",
                      borderRadius: 4,
                      fontSize: 14,
                    }}
                    value={externalDriverPhone}
                    onChange={(e) => setExternalDriverPhone(e.target.value)}
                    placeholder="Şoför telefonunu girin"
                  />
                </div>
              </>
            ) : (
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
                  Şoför Seç
                </label>
                <select
                  style={{
                    width: "100%",
                    padding: 8,
                    border: "1px solid #d1d5db",
                    borderRadius: 4,
                    fontSize: 14,
                  }}
                  value={selectedDriver || ""}
                  onChange={(e) => setSelectedDriver(e.target.value ? parseInt(e.target.value) : null)}
                >
                  <option value="">Şoför Seç</option>
                  {drivers.filter(d => !d.isExternal).map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {driver.name} - {driver.vehicle ? `${driver.vehicle.plate} (${driver.vehicle.brand} ${driver.vehicle.model})` : "Araç Atanmamış"}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
                Fiyat (₺)
              </label>
              <input
                type="number"
                step="0.01"
                style={{
                  width: "100%",
                  padding: 8,
                  border: "1px solid #d1d5db",
                  borderRadius: 4,
                  fontSize: 14,
                }}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Fiyatı girin"
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
                Ödeme Durumu
              </label>
              <select
                style={{
                  width: "100%",
                  padding: 8,
                  border: "1px solid #d1d5db",
                  borderRadius: 4,
                  fontSize: 14,
                }}
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as any)}
              >
                <option value="UNPAID">Ödenmedi</option>
                <option value="PAID">Ödendi</option>
                <option value="PARTIALLY_PAID">Kısmi Ödeme</option>
                <option value="REFUNDED">İade Edildi</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#6b7280",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                  fontSize: 14,
                  cursor: "pointer",
                }}
                onClick={() => setShowDriverModal(false)}
              >
                İptal
              </button>
              <button
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                  fontSize: 14,
                  cursor: "pointer",
                }}
                onClick={assignDriver}
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
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