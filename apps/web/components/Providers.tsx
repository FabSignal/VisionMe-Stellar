"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { SupabaseProvider } from "@/contexts/SupabaseContext";
import { SorobanProvider } from "@/contexts/SorobanContext";
import { WalletsKitProvider } from "@/contexts/WalletsKitContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SupabaseProvider>
        <SorobanProvider>
          <WalletsKitProvider>
            {children}
          </WalletsKitProvider>
        </SorobanProvider>
      </SupabaseProvider>
    </AuthProvider>
  );
}
