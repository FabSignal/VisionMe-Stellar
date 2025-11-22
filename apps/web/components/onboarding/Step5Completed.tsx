"use client"

interface Step5CompletedProps {
  profileData: { name: string; bio: string }
  avatarData: { gender: string; skinTone: string; hair: string }
}

export default function Step5Completed({ profileData, avatarData }: Step5CompletedProps) {
  const skinTones: Record<string, string> = {
    light: "#f4a68a",
    medium: "#d9956f",
    tan: "#b8860b",
    dark: "#8b4513",
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: "100vh",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <div />

      {/* Avatar */}
      <div>
        <div
          style={{
            width: "200px",
            height: "200px",
            margin: "30px auto",
            background: `linear-gradient(135deg, ${skinTones[avatarData.skinTone as keyof typeof skinTones] || "#f4a68a"}, ${skinTones[avatarData.skinTone as keyof typeof skinTones] || "#f4a68a"})`,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "100px",
            boxShadow: "var(--shadow-glow)",
          }}
        >
          {avatarData.gender === "female" ? "👩" : "👨"}
        </div>

        <h1 style={{ fontSize: "32px", marginTop: "40px", marginBottom: "20px", color: "var(--text-primary)" }}>
          ¡Bienvenido/a!
        </h1>

        <p style={{ fontSize: "18px", color: "var(--text-secondary)", marginBottom: "10px" }}>
          {profileData.name || "Nuevo usuario"}
        </p>

        <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "40px" }}>
          Tu avatar está listo para acompañarte en tu viaje de ahorro
        </p>
      </div>

      <a href="/dashboard">
        <button className="btn-primary" style={{ maxWidth: "300px" }}>
          Ir al Dashboard
        </button>
      </a>
    </div>
  )
}
