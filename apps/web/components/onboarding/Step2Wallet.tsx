"use client"

interface Step2WalletProps {
  onNext: () => void
  onBack: () => void
}

export default function Step2Wallet({ onNext, onBack }: Step2WalletProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "20px",
        textAlign: "center",
      }}
    >
      {/* Icon or Logo */}
      <div
        style={{
          fontSize: "64px",
          marginBottom: "40px",
        }}
      >
        💳
      </div>

      <h1 style={{ fontSize: "28px", marginBottom: "16px", color: "var(--text-primary)" }}>Conecta tu Billetera</h1>

      <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginBottom: "40px", maxWidth: "300px" }}>
        Necesitamos conectar tu billetera para gestionar tus ahorros y movimientos de dinero.
      </p>

      <div
        style={{
          width: "100%",
          maxWidth: "300px",
          marginBottom: "20px",
        }}
      >
        <button
          className="btn-primary"
          style={{
            marginBottom: "12px",
          }}
        >
          Conectar Billetera
        </button>

        <button
          className="btn-primary"
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "var(--text-primary)",
          }}
          onClick={onNext}
        >
          Continuar sin conectar
        </button>
      </div>

      <button
        onClick={onBack}
        style={{
          marginTop: "20px",
          background: "transparent",
          border: "none",
          color: "var(--text-muted)",
          cursor: "pointer",
          fontSize: "14px",
          textDecoration: "underline",
        }}
      >
        Volver
      </button>
    </div>
  )
}
