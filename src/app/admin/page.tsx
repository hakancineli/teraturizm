"use client";

import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import ReservationsTable from "@/components/ReservationsTable";
import AccountingTable from "@/components/AccountingTable";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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
