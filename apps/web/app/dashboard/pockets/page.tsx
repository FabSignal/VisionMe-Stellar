// apps/web/app/dashboard/pockets/page.tsx

"use client"; // Necesario para usar hooks en Next.js App Router

import React, { useEffect } from 'react';
import { usePockets } from '../../../hooks/usePockets';
import { useAuth } from '../../../contexts/AuthContext';
import { PocketCard } from '../../../components/PocketCard';
import { LoadingSpinner } from '../../../components/LoadingSpinner'; // Implementación simple
import Link from 'next/link';

const PocketsPage: React.FC = () => {
  const { user } = useAuth();
  const { pockets, isLoading, error, fetchPockets } = usePockets();

  useEffect(() => {
    if (user?.stellarPublicKey) {
      fetchPockets(user.stellarPublicKey);
    }
  }, [user, fetchPockets]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500 text-center mt-10">Error al cargar bolsillos: {error.message}</p>;

  return (
    <div className="container mx-auto p-8">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-extrabold text-white">
          Mis Bolsillos de Ahorro 💰
        </h1>
        <Link href="/dashboard/pockets/create" passHref>
          <button className="px-6 py-3 rounded-lg font-bold text-white bg-gradient-cta shadow-lg hover:shadow-secondary-purple/50 transition duration-300">
            + Crear Nuevo Bolsillo
          </button>
        </Link>
      </header>
      
      {pockets.length === 0 ? (
        <div className="text-center p-20 bg-card-bg/50 rounded-lg border border-primary-violet/30">
          <p className="text-lg text-gray-300 mb-4">Aún no tienes bolsillos creados. ¡Empieza tu primera meta de ahorro!</p>
          <Link href="/dashboard/pockets/create" passHref className="text-primary-violet hover:underline font-semibold">
            Crear ahora
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pockets.map((pocket) => (
            <PocketCard key={pocket.id} pocket={pocket} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PocketsPage;