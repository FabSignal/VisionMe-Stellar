"use client"

interface Step3ProfileProps {
  profileData: { name: string; bio: string }
  setProfileData: (data: { name: string; bio: string }) => void
  onNext: () => void
  onBack: () => void
}

export default function Step3Profile({ profileData, setProfileData, onNext, onBack }: Step3ProfileProps) {
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
        <h2 style={{ fontSize: "28px", marginBottom: "30px", color: "var(--text-primary)" }}>Creá tu perfil</h2>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "var(--text-secondary)" }}>
            Nombre/Apodo
          </label>
          <input
            type="text"
            className="input"
            placeholder="¿Cuál es tu nombre?"
            value={profileData.name}
            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "var(--text-secondary)" }}>
            Bio (Opcional)
          </label>
          <textarea
            className="input"
            placeholder="Cuéntanos sobre ti..."
            value={profileData.bio}
            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
            style={{ minHeight: "100px", resize: "vertical" }}
          />
        </div>

        <div className="card">
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>✓ Tu perfil vivirá en la blockchain de Stellar</p>
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
          Siguiente
        </button>
      </div>
    </div>
  )
}
