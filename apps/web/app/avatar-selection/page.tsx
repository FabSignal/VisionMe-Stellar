// apps/web/app/avatar-selection/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Rutas corregidas según tu estructura: public/images/avatar/
const AVATARS = [
  { id: "image3", src: "/images/avatar/image3.svg", name: "Avatar 3" },
  { id: "man1", src: "/images/avatar/man1.svg", name: "Hombre 1" },
  { id: "man2", src: "/images/avatar/man2.svg", name: "Hombre 2" },
  { id: "man3", src: "/images/avatar/man3.svg", name: "Hombre 3" },
  { id: "man4", src: "/images/avatar/man4.svg", name: "Hombre 4" },
  { id: "woman1", src: "/images/avatar/woman1.svg", name: "Mujer 1" },
  { id: "woman2", src: "/images/avatar/woman2.svg", name: "Mujer 2" },
  { id: "woman3", src: "/images/avatar/woman3.svg", name: "Mujer 3" },
  { id: "woman4", src: "/images/avatar/woman4.svg", name: "Mujer 4" },
  { id: "woman5", src: "/images/avatar/woman5.png", name: "Mujer 5" }, // Este es .png
];

export default function AvatarSelection() {
  const router = useRouter();
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName] = useState("");

  // Auto-close modal and redirect after 3 seconds
  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showModal, router]);

  const handleAvatarSelect = (avatarId: string) => {
    setSelectedAvatar(avatarId);
    setShowModal(true);
  };

  const selectedAvatarData = AVATARS.find((a) => a.id === selectedAvatar);

  return (
    <div className="avatar-selection-page">
      {/* Header */}
      <div className="avatar-header">
        <h1>Elige tu YO del futuro</h1>
        <p>Selecciona el avatar que más te inspire</p>
      </div>

      {/* Avatar Grid */}
      <div className="avatar-grid">
        {AVATARS.map((avatar) => (
          <button
            key={avatar.id}
            onClick={() => handleAvatarSelect(avatar.id)}
            className={`avatar-card ${selectedAvatar === avatar.id ? "selected" : ""}`}
          >
            <div className="avatar-image-wrapper">
              <Image
                src={avatar.src}
                alt={avatar.name}
                width={60}
                height={60}
                style={{ objectFit: "contain" }}
                onError={(e) => {
                  console.log("Image failed to load:", avatar.src);
                }}
              />
            </div>
            <p className="avatar-name">{avatar.name}</p>
          </button>
        ))}
      </div>

      {/* Welcome Modal */}
      {showModal && selectedAvatarData && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-avatar">
              <Image
                src={selectedAvatarData.src}
                alt={selectedAvatarData.name}
                width={120}
                height={120}
                style={{ objectFit: "contain" }}
              />
            </div>

            <h2>¡Bienvenido/a {userName}!</h2>

            <p className="modal-text">
              Este es tu YO del futuro. Juntos lograremos tus metas financieras.
            </p>

            <p className="modal-redirect">Redirigiendo al dashboard...</p>
          </div>
        </div>
      )}
    </div>
  );
}