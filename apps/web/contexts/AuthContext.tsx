// apps/web/contexts/AuthContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';

// Tipos
export interface User {
  id: string;
  email: string;
  name?: string;
  stellarPublicKey?: string;
  avatarUrl?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithCrossmint: () => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// Contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const isAuthenticated = !!user;

  // Verificar sesión existente al cargar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('visionme_token');
        
        if (!token) {
          setIsLoading(false);
          return;
        }

        // Verificar token con el backend
        const response = await fetch('/api/auth/user', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          // Token inválido, limpiar
          localStorage.removeItem('visionme_token');
        }
      } catch (err) {
        console.error('Error verificando autenticación:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login tradicional
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al iniciar sesión');
      }

      const { user: userData, token } = await response.json();
      
      localStorage.setItem('visionme_token', token);
      setUser(userData);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error desconocido');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Login con Crossmint (Stellar wallet)
  const loginWithCrossmint = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Redirigir a Crossmint OAuth o abrir modal
      // La implementación depende de cómo esté configurado Crossmint
      const response = await fetch('/api/auth/crossmint/init', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Error al iniciar autenticación con Crossmint');
      }

      const { authUrl } = await response.json();
      
      // Redirigir al usuario a Crossmint
      window.location.href = authUrl;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error desconocido');
      setError(error);
      setIsLoading(false);
      throw error;
    }
  }, []);

  // Registro
  const register = useCallback(async (email: string, password: string, name?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al registrarse');
      }

      const { user: userData, token } = await response.json();
      
      localStorage.setItem('visionme_token', token);
      setUser(userData);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error desconocido');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem('visionme_token');
    localStorage.removeItem('crossmint_token');
    setUser(null);
    setError(null);
  }, []);

  // Limpiar error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    loginWithCrossmint,
    register,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar el contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  
  return context;
};

export default AuthContext;