"use client"

import type React from "react"

import { useState } from "react"

export default function Home() {
  const [tab, setTab] = useState("login")
  const [formData, setFormData] = useState({ email: "", password: "", name: "" })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Redirect to onboarding
    window.location.href = "/onboarding"
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", padding: "20px" }}>
      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: "60px", marginTop: "20px" }}>
        <div
          style={{
            width: "60px",
            height: "60px",
            margin: "0 auto 20px",
            background: "linear-gradient(135deg, #a855f7, #c026d3)",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "32px",
          }}
        >
          ◆
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="tab-container">
        <button className={`tab ${tab === "login" ? "active" : ""}`} onClick={() => setTab("login")}>
          Ingreso
        </button>
        <button className={`tab ${tab === "registro" ? "active" : ""}`} onClick={() => setTab("registro")}>
          Registro
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "0 auto", flex: 1 }}>
        {tab === "registro" && (
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "var(--text-secondary)" }}>
              Nombre / Apodo
            </label>
            <input
              type="text"
              name="name"
              placeholder="Ingresa tu nombre o apodo"
              className="input"
              value={formData.name}
              onChange={handleChange}
              required={tab === "registro"}
            />
          </div>
        )}

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "var(--text-secondary)" }}>
            Correo electrónico
          </label>
          <input
            type="email"
            name="email"
            placeholder="Ingresa tu correo electrónico"
            className="input"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "var(--text-secondary)" }}>
            Contraseña
          </label>
          <input
            type="password"
            name="password"
            placeholder="Ingresa tu contraseña"
            className="input"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {tab === "login" && (
          <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
            <input type="checkbox" className="checkbox" id="remember" />
            <label htmlFor="remember" style={{ fontSize: "14px", color: "var(--text-secondary)", cursor: "pointer" }}>
              Recordarme
            </label>
          </div>
        )}

        <button type="submit" className="btn-primary" style={{ marginTop: "40px" }}>
          {tab === "login" ? "Ingreso" : "Registrarse"}
        </button>
      </form>

      <div style={{ height: "40px" }} />
    </div>
  )
}
