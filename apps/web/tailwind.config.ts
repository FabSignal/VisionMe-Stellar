import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-violet': 'rgb(90, 102, 240)', // Botones, acentos
        'secondary-purple': 'rgb(173, 21, 169)', // Acentos más fuertes
        'dark-bg': 'rgb(15, 23, 42)', // Fondo base
        'card-bg': 'rgba(30, 41, 59, 0.6)', // Fondo para tarjetas con transparencia
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(135deg, rgb(15, 23, 42) 0%, rgb(20, 30, 70) 50%, rgb(60, 10, 80) 100%)',
        'gradient-cta': 'linear-gradient(90deg, rgb(90, 102, 240) 0%, rgb(173, 21, 169) 100%)', // Para CTAs y botones
      },
    },
  },
  plugins: [],
};

export default config;