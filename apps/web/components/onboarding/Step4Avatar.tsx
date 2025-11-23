"use client"

interface AvatarData {
  gender: string
  skinTone: string
  hair: string
}

interface Step4AvatarProps {
  avatarData: AvatarData
  setAvatarData: (data: AvatarData) => void
  onNext: () => void
  onBack: () => void
}

export default function Step4Avatar({ avatarData, setAvatarData, onNext, onBack }: Step4AvatarProps) {
  const skinTones = [
    { id: "light", name: "Claro", color: "#f4a68a" },
    { id: "medium", name: "Medio", color: "#d9956f" },
    { id: "tan", name: "Bronceado", color: "#b8860b" },
    { id: "dark", name: "Oscuro", color: "#8b4513" },
  ]

  const hairStyles = [
    { id: "short", name: "Corto" },
    { id: "medium", name: "Medio" },
    { id: "long", name: "Largo" },
    { id: "curly", name: "Rizado" },
  ]

  const genders = [
    { id: "female", name: "Mujer", emoji: "👩" },
    { id: "male", name: "Hombre", emoji: "👨" },
  ]

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <div>
        <h2 style={{ fontSize: "28px", marginBottom: "30px", color: "var(--text-primary)" }}>Dale forma a tu YO</h2>

        {/* Avatar Preview */}
        <div
          style={{
            width: "180px",
            height: "180px",
            margin: "30px auto",
            background: `linear-gradient(135deg, ${skinTones.find((t) => t.id === avatarData.skinTone)?.color || "#f4a68a"}, ${skinTones.find((t) => t.id === avatarData.skinTone)?.color || "#f4a68a"})`,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "80px",
            boxShadow: "var(--shadow-glow)",
          }}
        >
          {avatarData.gender === "female" ? "👩" : "👨"}
        </div>

        {/* Gender Selection */}
        <div style={{ marginBottom: "30px" }}>
          <label style={{ display: "block", marginBottom: "12px", fontSize: "14px", color: "var(--text-secondary)" }}>
            Género
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
            {genders.map((g) => (
              <button
                key={g.id}
                onClick={() => setAvatarData({ ...avatarData, gender: g.id })}
                style={{
                  padding: "16px",
                  background: avatarData.gender === g.id ? "var(--gradient-cta)" : "rgba(255, 255, 255, 0.1)",
                  border: avatarData.gender === g.id ? "none" : "1px solid var(--border-input)",
                  borderRadius: "var(--radius-md)",
                  color: "var(--text-primary)",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "500",
                }}
              >
                {g.emoji} {g.name}
              </button>
            ))}
          </div>
        </div>

        {/* Skin Tone Selection */}
        <div style={{ marginBottom: "30px" }}>
          <label style={{ display: "block", marginBottom: "12px", fontSize: "14px", color: "var(--text-secondary)" }}>
            Tono de piel
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
            {skinTones.map((tone) => (
              <button
                key={tone.id}
                onClick={() => setAvatarData({ ...avatarData, skinTone: tone.id })}
                style={{
                  padding: "16px",
                  background: tone.color,
                  border: avatarData.skinTone === tone.id ? "3px solid var(--accent-purple)" : "1px solid transparent",
                  borderRadius: "var(--radius-md)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                title={tone.name}
              />
            ))}
          </div>
        </div>

        {/* Hair Selection */}
        <div style={{ marginBottom: "30px" }}>
          <label style={{ display: "block", marginBottom: "12px", fontSize: "14px", color: "var(--text-secondary)" }}>
            Peinado
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
            {hairStyles.map((h) => (
              <button
                key={h.id}
                onClick={() => setAvatarData({ ...avatarData, hair: h.id })}
                style={{
                  padding: "16px",
                  background: avatarData.hair === h.id ? "var(--gradient-cta)" : "rgba(255, 255, 255, 0.1)",
                  border: avatarData.hair === h.id ? "none" : "1px solid var(--border-input)",
                  borderRadius: "var(--radius-md)",
                  color: "var(--text-primary)",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "500",
                }}
              >
                {h.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <button
          onClick={onBack}
          style={{
            flex: 1,
            padding: "12px",
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid var(--border-input)",
            borderRadius: "var(--radius-pill)",
            color: "var(--text-secondary)",
            cursor: "pointer",
          }}
        >
          Atrás
        </button>
        <button className="btn-primary" onClick={onNext} style={{ flex: 1 }}>
          Guardar
        </button>
      </div>
    </div>
  )
}
