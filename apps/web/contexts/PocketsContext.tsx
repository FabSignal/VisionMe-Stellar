// apps/web/contexts/PocketsContext.tsx
"use client";

import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';

// Tipos
export interface Pocket {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  isCompleted: boolean;
  emoji?: string;
}

interface PocketsContextType {
  pockets: Pocket[];
  isLoading: boolean;
  error: Error | null;
  fetchPockets: () => Promise<void>;
  createPocket: (data: CreatePocketData) => Promise<Pocket>;
  updatePocket: (id: string, data: Partial<Pocket>) => Promise<Pocket>;
  deletePocket: (id: string) => Promise<void>;
  getPocketById: (id: string) => Pocket | undefined;
}

interface CreatePocketData {
  name: string;
  targetAmount: number;
  currency?: string;
  emoji?: string;
}

// Contexto
const PocketsContext = createContext<PocketsContextType | undefined>(undefined);

// Provider
interface PocketsProviderProps {
  children: ReactNode;
}

export const PocketsProvider = ({ children }: PocketsProviderProps) => {
  const [pockets, setPockets] = useState<Pocket[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('visionme_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  };

  // Obtener todos los pockets
  const fetchPockets = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/pockets', {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Error al obtener los pockets');
      }

      const data = await response.json();
      setPockets(data.pockets || data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error desconocido');
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Crear pocket
  const createPocket = useCallback(async (data: CreatePocketData): Promise<Pocket> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/pockets', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el pocket');
      }

      const newPocket = await response.json();
      setPockets(prev => [...prev, newPocket]);
      return newPocket;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error desconocido');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Actualizar pocket
  const updatePocket = useCallback(async (id: string, data: Partial<Pocket>): Promise<Pocket> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/pockets/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el pocket');
      }

      const updatedPocket = await response.json();
      setPockets(prev => prev.map(p => p.id === id ? updatedPocket : p));
      return updatedPocket;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error desconocido');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Eliminar pocket
  const deletePocket = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/pockets/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el pocket');
      }

      setPockets(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error desconocido');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtener pocket por ID
  const getPocketById = useCallback((id: string): Pocket | undefined => {
    return pockets.find(p => p.id === id);
  }, [pockets]);

  const value: PocketsContextType = {
    pockets,
    isLoading,
    error,
    fetchPockets,
    createPocket,
    updatePocket,
    deletePocket,
    getPocketById,
  };

  return (
    <PocketsContext.Provider value={value}>
      {children}
    </PocketsContext.Provider>
  );
};

// Hook
export const usePockets = (): PocketsContextType => {
  const context = useContext(PocketsContext);
  
  if (context === undefined) {
    throw new Error('usePockets debe usarse dentro de un PocketsProvider');
  }
  
  return context;
};

export default PocketsContext;