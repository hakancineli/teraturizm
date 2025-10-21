"use client";

import { useState, useEffect } from "react";

interface AccountingRecord {
  id: number;
  reservationId: number;
  amount: number;
  description: string | null;
  type: "INCOME" | "EXPENSE";
  paymentMethod: string | null;
  paymentDate: string;
  createdAt: string;
  updatedAt: string;
  reservation?: {
    id: number;
    from: string;
    to: string;
    date: string;
    time: string;
    phone: string;
    status: string;
    driver?: {
      id: number;
      name: string;
      phone: string;
      isExternal: boolean;
    };
  };
}

interface Totals {
  income: number;
  expense: number;
  net: number;
}

export default function AccountingTable() {
  const [records, setRecords] = useState<AccountingRecord[]>([]);
  const [totals, setTotals] = useState<Totals>({ income: 0, expense: 0, net: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [type, setType] = useState<"INCOME" | "EXPENSE" | "">("");
  const [today, setToday] = useState("");
  const [tomorrow, setTomorrow] = useState("");
  
  // Form state
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [recordType, setRecordType] = useState<"INCOME" | "EXPENSE">("INCOME");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentDate, setPaymentDate] = useState("");

  useEffect(() => {
    // Set today and tomorrow dates
    const todayDate = new Date();
    const tomorrowDate = new Date(todayDate);
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    
    setToday(todayDate.toISOString().split('T')[0]);
    setTomorrow(tomorrowDate.toISOString().split('T')[0]);
    
    // Set default filter to today
    setStartDate(todayDate.toISOString().split('T')[0]);
    setEndDate(todayDate.toISOString().split('T')[0]);
    
    fetchRecords();
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [startDate, endDate, type]);

  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Oturum bulunamadı");
      }

      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      if (type) params.append("type", type);

      const response = await fetch(`/api/accounting?${params.toString()}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Muhasebe kayıtları alınamadı");
      }

      const data = await response.json();
      setRecords(data.records);
      setTotals(data.totals);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Bir hata oluştu";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const addRecord = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Oturum bulunamadı");
      }

      const response = await fetch("/api/accounting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          description,
          type: recordType,
          paymentMethod,
          paymentDate: paymentDate || new Date().toISOString().split('T')[0],
        }),
      });

      if (!response.ok) {
        throw new Error("Kayıt eklenemedi");
      }

      // Close modal and refresh
      setShowAddModal(false);
      setAmount("");
      setDescription("");
      setRecordType("INCOME");
      setPaymentMethod("");
      setPaymentDate("");
      fetchRecords();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Bir hata oluştu";
      alert(errorMessage);
    }
  };

  const filterToday = () => {
    setStartDate(today);
    setEndDate(today);
  };

  const filterTomorrow = () => {
    setStartDate(tomorrow);
    setEndDate(tomorrow);
  };

  const openAddModal = () => {
    setPaymentDate(startDate || today);
    setShowAddModal(true);
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case "INCOME":
        return {
          padding: "4px 8px",
          borderRadius: "4px",
          fontSize: "12px",
          fontWeight: "bold",
          backgroundColor: "#d1fae5",
          color: "#065f46",
        };
      case "EXPENSE":
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

  const getTypeText = (type: string) => {
    switch (type) {
      case "INCOME":
        return "Gelir";
      case "EXPENSE":
        return "Gider";
      default:
        return type;
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
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Muhasebe</h1>
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
          onClick={openAddModal}
        >
          Kayıt Ekle
        </button>
      </div>

      {/* Filters */}
      <div style={{ 
        display: "flex", 
        gap: 12, 
        marginBottom: 16, 
        padding: 12, 
        background: "#f9fafb", 
        borderRadius: 6,
        flexWrap: "wrap"
      }}>
        <div>
          <label style={{ display: "block", marginBottom: 4, fontSize: 12, fontWeight: 600 }}>Başlangıç Tarihi</label>
          <input
            type="date"
            style={{
              padding: "6px 8px",
              border: "1px solid #d1d5db",
              borderRadius: 4,
              fontSize: 14,
            }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: 4, fontSize: 12, fontWeight: 600 }}>Bitiş Tarihi</label>
          <input
            type="date"
            style={{
              padding: "6px 8px",
              border: "1px solid #d1d5db",
              borderRadius: 4,
              fontSize: 14,
            }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: 4, fontSize: 12, fontWeight: 600 }}>Tür</label>
          <select
            style={{
              padding: "6px 8px",
              border: "1px solid #d1d5db",
              borderRadius: 4,
              fontSize: 14,
            }}
            value={type}
            onChange={(e) => setType(e.target.value as any)}
          >
            <option value="">Tümü</option>
            <option value="INCOME">Gelir</option>
            <option value="EXPENSE">Gider</option>
          </select>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
          <button
            style={{
              padding: "6px 12px",
              backgroundColor: "#10b981",
              color: "white",
              border: "none",
              borderRadius: 4,
              fontSize: 12,
              cursor: "pointer",
            }}
            onClick={filterToday}
          >
            Bugün
          </button>
          <button
            style={{
              padding: "6px 12px",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: 4,
              fontSize: 12,
              cursor: "pointer",
            }}
            onClick={filterTomorrow}
          >
            Yarın
          </button>
        </div>
      </div>

      {/* Totals */}
      <div style={{ 
        display: "flex", 
        gap: 16, 
        marginBottom: 16,
        flexWrap: "wrap"
      }}>
        <div style={{
          padding: 12,
          background: "#d1fae5",
          borderRadius: 6,
          flex: 1,
          minWidth: 150,
        }}>
          <div style={{ fontSize: 12, color: "#065f46", marginBottom: 4 }}>Toplam Gelir</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#065f46" }}>
            ₺{totals.income.toFixed(2)}
          </div>
        </div>
        <div style={{
          padding: 12,
          background: "#fee2e2",
          borderRadius: 6,
          flex: 1,
          minWidth: 150,
        }}>
          <div style={{ fontSize: 12, color: "#991b1b", marginBottom: 4 }}>Toplam Gider</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#991b1b" }}>
            ₺{totals.expense.toFixed(2)}
          </div>
        </div>
        <div style={{
          padding: 12,
          background: totals.net >= 0 ? "#dbeafe" : "#fee2e2",
          borderRadius: 6,
          flex: 1,
          minWidth: 150,
        }}>
          <div style={{ fontSize: 12, color: totals.net >= 0 ? "#1e40af" : "#991b1b", marginBottom: 4 }}>
            Net Kar/Zarar
          </div>
          <div style={{ 
            fontSize: 18, 
            fontWeight: 700, 
            color: totals.net >= 0 ? "#1e40af" : "#991b1b" 
          }}>
            ₺{totals.net.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Records Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>Tarih</th>
              <th style={th}>Tür</th>
              <th style={th}>Tutar</th>
              <th style={th}>Açıklama</th>
              <th style={th}>Ödeme Yöntemi</th>
              <th style={th}>Rezervasyon</th>
              <th style={th}>Şoför</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id}>
                <td style={td}>{new Date(r.paymentDate).toLocaleDateString()}</td>
                <td style={td}>
                  <span style={getTypeStyle(r.type)}>
                    {getTypeText(r.type)}
                  </span>
                </td>
                <td style={{ ...td, fontWeight: 600, color: r.type === "INCOME" ? "#065f46" : "#991b1b" }}>
                  {r.type === "INCOME" ? "+" : "-"}₺{r.amount.toFixed(2)}
                </td>
                <td style={td}>{r.description || "-"}</td>
                <td style={td}>{r.paymentMethod || "-"}</td>
                <td style={td}>
                  {r.reservation ? (
                    <div>
                      <div style={{ fontSize: 12 }}>
                        {r.reservation.from} → {r.reservation.to}
                      </div>
                      <div style={{ fontSize: 11, color: "#6b7280" }}>
                        {r.reservation.date} {r.reservation.time}
                      </div>
                    </div>
                  ) : (
                    "-"
                  )}
                </td>
                <td style={td}>
                  {r.reservation?.driver ? (
                    <div>
                      <div style={{ fontSize: 12 }}>{r.reservation.driver.name}</div>
                      <div style={{ fontSize: 11, color: "#6b7280" }}>
                        {r.reservation.driver.isExternal ? "Dış Şoför" : "Şirket Şoförü"}
                      </div>
                    </div>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Record Modal */}
      {showAddModal && (
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
              Muhasebe Kaydı Ekle
            </h2>
            
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
                Tür
              </label>
              <select
                style={{
                  width: "100%",
                  padding: 8,
                  border: "1px solid #d1d5db",
                  borderRadius: 4,
                  fontSize: 14,
                }}
                value={recordType}
                onChange={(e) => setRecordType(e.target.value as any)}
              >
                <option value="INCOME">Gelir</option>
                <option value="EXPENSE">Gider</option>
              </select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
                Tutar (₺)
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
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Tutarı girin"
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
                Açıklama
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Açıklama girin"
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
                Ödeme Yöntemi
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
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                placeholder="Ödeme yöntemi girin"
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
                Ödeme Tarihi
              </label>
              <input
                type="date"
                style={{
                  width: "100%",
                  padding: 8,
                  border: "1px solid #d1d5db",
                  borderRadius: 4,
                  fontSize: 14,
                }}
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
              />
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
                onClick={() => setShowAddModal(false)}
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
                onClick={addRecord}
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