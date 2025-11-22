// apps/web/components/WalletDisplay.tsx

import React from 'react';

interface WalletDisplayProps {
  publicKey: string;
}

// Función para abreviar la clave pública: G...XYZ
const formatPublicKey = (key: string): string => {
  if (key.length < 10) return key;
  return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
};

export const WalletDisplay: React.FC<WalletDisplayProps> = ({ publicKey }) => {
  if (!publicKey) return null;

  const formattedKey = formatPublicKey(publicKey);

  return (
    <div className="flex items-center p-2 rounded-full bg-card-bg border border-primary-violet/50 shadow-md">
      {/* Icono de billetera */}
      <svg className="w-5 h-5 text-secondary-purple mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
      
      {/* Clave pública abreviada */}
      <span 
        className="text-sm font-mono text-white/90 cursor-pointer hover:text-primary-violet transition duration-200"
        title={publicKey} // Muestra la clave completa al pasar el ratón
      >
        {formattedKey}
      </span>
    </div>
  );
};