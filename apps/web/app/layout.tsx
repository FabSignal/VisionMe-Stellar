import type React from "react"
import type { Metadata } from "next"
import "@/styles/globals.css"

export const metadata: Metadata = {
  title: "VisionMe - Ahorro Gamificado",
  description: "Tu visión del futuro comienza aquí",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
