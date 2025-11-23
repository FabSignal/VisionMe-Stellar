"use client"

interface Step1WelcomeProps {
  onNext: () => void
}

export default function Step1Welcome({ onNext }: Step1WelcomeProps) {
  return (
    <div className="step1-container">
      <div className="animated-background">
        {/* Estrellas parpadeantes */}
        <div className="star star-1"></div>
        <div className="star star-2"></div>
        <div className="star star-3"></div>
        <div className="star star-4"></div>
        <div className="star star-5"></div>
        <div className="star star-6"></div>
        <div className="star star-7"></div>
        <div className="star star-8"></div>

        {/* Brillos en forma de cruz */}
        <div className="glow glow-white glow-1"></div>
        <div className="glow glow-violet glow-2"></div>
        <div className="glow glow-white glow-3"></div>
        <div className="glow glow-violet glow-4"></div>
        <div className="glow glow-white glow-5"></div>
      </div>

      <div className="step1-content">
        {/* Avatar Placeholder */}
        <div className="avatar-placeholder" />

        <h1 style={{ fontSize: "32px", marginTop: "40px", marginBottom: "20px", color: "var(--text-primary)" }}>
          VisionMe
        </h1>

        <p style={{ fontSize: "18px", color: "var(--text-secondary)", marginBottom: "60px", maxWidth: "300px" }}>
          Todavía no tengo forma, pero soy vos...
        </p>

        <button className="btn-primary" onClick={onNext} style={{ maxWidth: "300px" }}>
          Conocé a tu YO del futuro
        </button>
      </div>
    </div>
  )
}
