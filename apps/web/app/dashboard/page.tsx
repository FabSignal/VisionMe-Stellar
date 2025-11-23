
"use client"

import Link from "next/link"
import { useState } from "react"

type ActionType = "deposit" | "withdraw" | "transfer" | "create"

export default function Dashboard() {
  const [balance, setBalance] = useState(1250.5)
  const [savings, setSavings] = useState([
    { name: "Viaje a Italia", amount: 500, goal: 2000, progress: 25 },
    { name: "Nuevo auto", amount: 1250.5, goal: 5000, progress: 25 },
    { name: "Fondo de emergencia", amount: 2300, goal: 3000, progress: 77 },
  ])

  const options: Array<{ icon: string; label: string; action: ActionType }> = [
    { icon: "💰", label: "Ingresar dinero", action: "deposit" },
    { icon: "💸", label: "Sacar dinero", action: "withdraw" },
    { icon: "🔄", label: "Cambiar", action: "transfer" },
    { icon: "🎯", label: "Crear pocket", action: "create" },
  ]

  return (
    <div style={{ minHeight: "100vh", background: "var(--gradient-bg)", paddingBottom: "40px" }}>
      {/* Navbar */}
      <div
        style={{
          padding: "20px",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h1 style={{ fontSize: "24px", color: "var(--text-primary)" }}>VisionMe</h1>
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #a855f7, #c026d3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
          }}
        >
          👩
        </div>
      </div>

      {/* Balance Card */}
      <div className="card" style={{ margin: "20px", marginBottom: "30px" }}>
        <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "8px" }}>Balance Total</p>
        <h2 style={{ fontSize: "36px", color: "var(--text-primary)", marginBottom: "20px" }}>${balance.toFixed(2)}</h2>
        <div
          style={{ display: "flex", gap: "8px", alignItems: "center", color: "var(--text-muted)", fontSize: "14px" }}
        >
          <span>🔥 5 días de racha</span>
        </div>
      </div>

      {/* Quick Actions */}
      <h3
        style={{
          fontSize: "18px",
          color: "var(--text-primary)",
          padding: "0 20px",
          marginBottom: "16px",
          fontWeight: "600",
        }}
      >
        Acciones rápidas
      </h3>
      <div className="dashboard-container">
        {options.map((opt) => (
          <Link href={`/dashboard/${opt.action}` as any} key={opt.action}>
            <div className="option-card">
              <div className="option-icon">{opt.icon}</div>
              <div className="option-label">{opt.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Mis Ahorros */}
      <h3 style={{ fontSize: "18px", color: "var(--text-primary)", padding: "20px 20px 16px", fontWeight: "600" }}>
        Mis Ahorros
      </h3>
      <div style={{ padding: "0 20px" }}>
        {savings.map((saving, idx) => (
          <div key={idx} className="card" style={{ marginBottom: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <div>
                <h4 style={{ color: "var(--text-primary)", marginBottom: "4px" }}>{saving.name}</h4>
                <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  ${saving.amount} / ${saving.goal}
                </p>
              </div>
              <p style={{ color: "var(--accent-purple)", fontWeight: "600" }}>{saving.progress}%</p>
            </div>
            <div
              style={{
                width: "100%",
                height: "8px",
                background: "var(--bg-input)",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${saving.progress}%`,
                  height: "100%",
                  background: "var(--gradient-cta)",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
