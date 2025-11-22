import { useState, useCallback } from "react";

export interface DepositWithSwapRequest {
  pocketId: string;
  fromAsset: string; // Contract ID
  toAsset: string; // Contract ID
  amountIn: string; // Amount in smallest unit (stroops/dimmest)
  fromAddress: string; // Stellar public key
}

export interface DepositResult {
  transactionHash: string;
  amountOut: string;
  depositAmount: string;
  newStreakDays: number;
}

export function useDeposit() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const depositWithSwap = useCallback(
    async (
      request: DepositWithSwapRequest,
      visionMeJWT: string,
      crossmintToken: string
    ): Promise<DepositResult> => {
      try {
        setIsLoading(true);
        setError(null);

        // Use two separate tokens:
        // - Authorization: VisionMe backend JWT (for authentication)
        // - X-Crossmint-Token: Crossmint token (for transaction signing)
        const res = await fetch("/api/deposits/deposit-with-swap", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${visionMeJWT}`,
            "X-Crossmint-Token": crossmintToken,
          },
          body: JSON.stringify(request),
        });

        if (res.ok) {
          return await res.json();
        } else {
          const errorData = await res.json();
          throw new Error(errorData.error || "Deposit failed");
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Deposit error");
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    isLoading,
    error,
    depositWithSwap,
  };
}