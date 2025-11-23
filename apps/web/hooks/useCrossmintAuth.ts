// apps/web/hooks/useCrossmintAuth.ts

// ... (Imports y interfaces previas)

interface User {
  socialUserId: string;
  email?: string;
  stellarPublicKey: string;
  visionMeJWT: string; // <-- Nuevo: JWT de sesión para autenticar llamadas a la API
  crossmintToken: string; // <-- Nuevo: Token de Crossmint para autorizar firmas
}

interface UseCrossmintAuthReturn {
  // ... (Propiedades existentes)
  user: User | null; // El usuario ahora contiene los tokens
  login: () => Promise<void>;
  // ...
}

export function useCrossmintAuth(): UseCrossmintAuthReturn {
  // ... (Estados, SDK init)

  // Función interna para procesar la respuesta del backend
  const handleAuthSuccess = async (account: any) => {
    // El 'account' de Crossmint contiene el token que necesitamos
    const crossmintToken = account.token;

    // Llama al backend para registrar/iniciar sesión y obtener el JWT de VisionMe
    const res = await fetch("/api/auth/callback", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        // Enviamos el token de Crossmint para que el backend lo pueda verificar
        "X-Crossmint-Token": crossmintToken, 
      },
      body: JSON.stringify({
        socialUserId: account.id,
        stellarPublicKey: account.stellarPublicKey,
        email: account.email,
      }),
    });

    if (res.ok) {
      const userData = await res.json();
      
      // Combinamos los datos del usuario del backend (que incluye el JWT) 
      // con el Crossmint Token
      const fullUserData: User = {
        ...userData,
        crossmintToken,
      };
      setUser(fullUserData);
    } else {
      throw new Error("Backend registration/login failed");
    }
  };

  // useEffect para verificar el estado de autenticación (similar, ajustando la llamada a /api/auth/user)
  // ...

  const login = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Trigger Crossmint OAuth flow
      const account = await crossmintSDK.login({
        provider: "google",
        // Aquí podrías usar 'redirectUrl' si es necesario, 
        // pero la llamada al backend se hace internamente tras el login
      });

      if (account && account.stellarPublicKey) {
        await handleAuthSuccess(account);
      } else {
        throw new Error("Crossmint login failed to return public key");
      }
      
    } catch (err) {
      // ... (manejo de errores)
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ... (logout)

  return {
    // ... (retorno)
  };
}