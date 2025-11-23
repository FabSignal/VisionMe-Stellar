// src/services/crossmintService.ts
// Crossmint Integration

import { ENV } from "../config/env";
import fetch from "node-fetch";
import { createCrossmint, CrossmintAuth } from "@crossmint/server-sdk";

// Initialize Crossmint with server-side API key
const crossmint = createCrossmint({
  apiKey: ENV.CROSSMINT_API_KEY,
});

// Get CrossmintAuth instance for user management
export const crossmintAuth = CrossmintAuth.from(crossmint);

/**
 * Service for Crossmint integration
 * Handles transaction signing via Crossmint Social Wallet
 *
 * IMPORTANT: Crossmint tokens and VisionMe JWTs are SEPARATE:
 * - VisionMe JWT: Backend auth token (for API calls via Authorization header)
 * - Crossmint Token: Social Wallet session token (for transaction signing only)
 */
export class CrossmintService {
  /**
   * Sign a transaction XDR using Crossmint Social Wallet
   *
   * This function bridges the backend with the Crossmint Social Wallet
   * to sign a Stellar transaction without exposing the private key.
   *
   * @param xdr - The unsigned transaction XDR to sign
   * @param userPublicKey - The Stellar public key of the user
   * @param crossmintToken - Crossmint session token (obtained from Crossmint SDK)
   *                         NOT the same as VisionMe JWT
   */
  async signTransactionXDR(
    xdr: string,
    userPublicKey: string,
    crossmintToken: string
  ): Promise<string> {
    console.log(`\n Requesting Crossmint to sign transaction...`);

    try {
      const response = await fetch(
        `${ENV.CROSSMINT_API_URL}/api/v1/wallets/stellar/sign`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${crossmintToken}`,
            "X-API-Key": ENV.CROSSMINT_API_KEY,
          },
          body: JSON.stringify({
            transactionXdr: xdr,
            publicKey: userPublicKey,
            network: "testnet",
          }),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Crossmint signing failed: ${error}`);
      }

      const result: any = await response.json();

      console.log(`Transaction signed by Crossmint`);
      return result.signedTransactionXdr;
    } catch (error) {
      console.error("Crossmint signing error:", error);
      throw error;
    }
  }

  /**
   * Verify a Crossmint JWT token
   * Can be used to validate user authentication
   */
  async verifyToken(
    token: string
  ): Promise<{ userId: string; email?: string }> {
    try {
      const response = await fetch(
        `${ENV.CROSSMINT_API_URL}/api/v1/auth/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": ENV.CROSSMINT_API_KEY,
          },
          body: JSON.stringify({ token }),
        }
      );

      if (!response.ok) {
        throw new Error("Token verification failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Token verification error:", error);
      throw error;
    }
  }

  /**
   * Get user profile from Crossmint (using server SDK)
   * Requires @crossmint/server-sdk installed
   *
   * @param userId - User's Crossmint ID
   * @returns User object with profile data (email, google, farcaster, etc.)
   */
  async getUserProfile(userId: string) {
    try {
      console.log(`[CrossmintService] Fetching user profile for: ${userId}`);
      const user = await crossmintAuth.getUser(userId);
      console.log(`[CrossmintService] User profile fetched successfully`);
      return user;
    } catch (error: any) {
      console.error("[CrossmintService] Error fetching user profile:", error);
      throw new Error(`Failed to fetch Crossmint user: ${error.message}`);
    }
  }
}

export const crossmintService = new CrossmintService();
