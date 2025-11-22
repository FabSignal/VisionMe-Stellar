import { useState, useCallback } from "react";

export interface Pocket {
  id: string;
  pocket_id: string; // On-chain pocket ID
  owner_id: string;
  asset: string; // Contract ID
  goal_amount: string;
  current_amount: string;
  name: string;
  frequency: string; // 'daily', 'weekly', 'monthly'
  created_at: string;
}

export function usePockets() {
  const [pockets, setPockets] = useState<Pocket[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPockets = useCallback(
    async (stellarPublicKey: string, visionMeJWT: string) => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/pockets?owner=" + stellarPublicKey, {
          headers: { Authorization: `Bearer ${visionMeJWT}` },
        });
        if (res.ok) {
          const data = await res.json();
          setPockets(data);
        } else {
          throw new Error("Failed to fetch pockets");
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Fetch error"));
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const createPocket = useCallback(
    async (pocket: Omit<Pocket, "id" | "created_at">, visionMeJWT: string) => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/pockets", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${visionMeJWT}`,
          },
          body: JSON.stringify(pocket),
        });

        if (res.ok) {
          const newPocket: Pocket = await res.json();
          setPockets([...pockets, newPocket]);
          return newPocket;
        } else {
          throw new Error("Failed to create pocket");
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Create error"));
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [pockets]
  );

  const getPocket = useCallback(
    async (pocketId: string, visionMeJWT: string): Promise<Pocket | null> => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/pockets/${pocketId}`, {
          headers: { Authorization: `Bearer ${visionMeJWT}` },
        });
        if (res.ok) {
          return await res.json();
        }
        return null;
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Fetch error"));
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    pockets,
    isLoading,
    error,
    fetchPockets,  
    createPocket,
    getPocket,
  };
}