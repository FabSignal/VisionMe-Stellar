// src/routes/pockets.ts
// Pocket Routes - Using Supabase Client

import express, { Router, Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";
import { TransactionBuilder, Networks } from "@stellar/stellar-sdk";
import { pocketService } from "../services/pocketService";
import { authMiddleware } from "../middlewares/authMiddleware";
import { ENV } from "../config/env";

const router = Router();

// Initialize Supabase client
const supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY);

/**
 * POST /api/pockets
 * Create a new pocket
 *
 * IMPORTANT: This endpoint builds an unsigned XDR and returns it to the frontend.
 * The frontend must sign it with Crossmint before the transaction is submitted.
 *
 * For MVP simplicity, this is a simplified flow:
 * - Backend builds XDR
 * - Frontend signs with Crossmint
 * - Frontend submits signed XDR back to backend (or directly to Soroban RPC)
 */
router.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { owner, asset, goalAmount, name, frequency } = req.body;

    // Validate inputs
    if (!owner || !asset || !goalAmount || !name) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Build unsigned create_pocket XDR
    const unsignedXDR = await pocketService.buildCreatePocketXDR(
      owner,
      asset,
      BigInt(goalAmount)
    );

    // Return XDR to frontend for signing (frontend will sign + submit)
    res.status(200).json({
      unsignedXDR,
      message:
        "Please sign this transaction with Crossmint and submit via /api/pockets/submit-create",
      metadata: {
        owner,
        asset,
        goalAmount,
        name,
        frequency,
        userId,
      },
    });
  } catch (error: any) {
    console.error("Create pocket error:", error);
    res.status(500).json({ error: error.message || "Failed to create pocket" });
  }
});

/**
 * POST /api/pockets/submit-create
 * Submit a signed create_pocket transaction
 */
router.post(
  "/submit-create",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const { signedXDR, name, frequency, asset, goalAmount, owner } = req.body;

      if (!signedXDR) {
        return res.status(400).json({ error: "Missing signedXDR" });
      }

      // Submit signed transaction to blockchain
      const pocketId = await pocketService.submitSignedCreatePocket(signedXDR);

      // Store in database
      const { data: pocket, error } = await supabase
        .from("pockets")
        .insert({
          owner_id: userId,
          owner_address: owner,
          pocket_id: pocketId,
          asset,
          goal_amount: goalAmount,
          current_amount: "0",
          name,
          frequency,
        })
        .select()
        .single();

      if (error) throw error;

      res.status(201).json(pocket);
    } catch (error: any) {
      console.error("Submit create pocket error:", error);
      res
        .status(500)
        .json({ error: error.message || "Failed to submit pocket creation" });
    }
  }
);

/**
 * GET /api/pockets
 * List all pockets for a user
 */
router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { owner } = req.query;

    let query = supabase
      .from("pockets")
      .select("*")
      .eq("owner_id", userId);

    // Add optional filter by owner_address
    if (owner) {
      query = query.eq("owner_address", owner as string);
    }

    const { data: pockets, error } = await query;

    if (error) throw error;

    res.json(pockets || []);
  } catch (error: any) {
    console.error("List pockets error:", error);
    res.status(500).json({ error: "Failed to list pockets" });
  }
});

/**
 * GET /api/pockets/:id
 * Get a specific pocket
 */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data: pocket, error } = await supabase
      .from("pockets")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !pocket) {
      return res.status(404).json({ error: "Pocket not found" });
    }

    res.json(pocket);
  } catch (error: any) {
    console.error("Get pocket error:", error);
    res.status(500).json({ error: "Failed to get pocket" });
  }
});

export default router;