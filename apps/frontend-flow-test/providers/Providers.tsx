// apps/frontend-flow-test/providers/Providers.tsx
import React from "react";
import {
  CrossmintProvider,
  CrossmintAuthProvider,
} from "@crossmint/client-sdk-react-ui";

type ProvidersProps = {
  children: React.ReactNode;
};

const CROSSMINT_API_KEY = import.meta.env.VITE_CROSSMINT_CLIENT_ID ?? "";

/**
 * Crossmint Providers Setup
 *
 * Hierarchy:
 * 1. CrossmintProvider - Top level, requires apiKey (client-side public key)
 * 2. CrossmintAuthProvider - Handles authentication with social logins
 *
 * Supported login methods:
 * - email: Email/password authentication
 * - google: Google OAuth
 */
export function Providers({ children }: ProvidersProps) {
  // Validate API key
  if (!CROSSMINT_API_KEY) {
    console.error(
      "[Providers] VITE_CROSSMINT_CLIENT_ID is not set in .env.local"
    );
  }

  return (
    <CrossmintProvider apiKey={CROSSMINT_API_KEY}>
      <CrossmintAuthProvider
        loginMethods={[
          "email",
          "google",
        ]}
      >
        {children}
      </CrossmintAuthProvider>
    </CrossmintProvider>
  );
}

export default Providers;
