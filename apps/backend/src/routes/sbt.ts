import express, { Router, Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";
import { authMiddleware } from "../middlewares/authMiddleware";
import { sbtService } from "../services/sbtService";
import { streakService } from "../services/streakService";
import { ENV } from "../config/env";

const router = Router();
const supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY);

/**
 * POST /api/sbt/check-and-mint
 * On-demand SBT minting endpoint
 * Checks if user is eligible and mints SBT if they are
 */
router.post("/check-and-mint", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { stellarPublicKey } = req.body;

    if (!stellarPublicKey) {
      return res.status(400).json({ error: "Missing stellarPublicKey" });
    }

    // Check if user is eligible
    const isEligible = await streakService.isSBTEligible(userId);

    if (!isEligible) {
      return res.status(200).json({
        eligible: false,
        message: "User is not yet eligible for SBT",
      });
    }

    // Mint SBT
    const metadata = JSON.stringify({
      userId,
      version: "1.0",
      mintedAt: new Date().toISOString(),
    });

    const txHash = await sbtService.mintSBT(stellarPublicKey, metadata);

    // Update user in database
    const { error: updateError } = await supabase
      .from('users')
      .update({
        sbt_issued: true,
        sbt_transaction_hash: txHash,
      })
      .eq('id', userId);

    if (updateError) throw updateError;

    res.status(200).json({
      eligible: true,
      minted: true,
      transactionHash: txHash,
    });
  } catch (error: any) {
    console.error("Check and mint SBT error:", error);
    res.status(500).json({ error: error.message || "Failed to mint SBT" });
  }
});

/**
 * GET /api/sbt/status/:userId
 * Check SBT status for a user
 */
router.get("/status/:userId", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: "User not found" });
    }

    const hasOnChainSBT = await sbtService.hasSBT(user.stellar_public_key);

    res.status(200).json({
      userId,
      sbtIssued: user.sbt_issued,
      hasOnChainSBT,
      transactionHash: user.sbt_transaction_hash,
    });
  } catch (error: any) {
    console.error("Get SBT status error:", error);
    res.status(500).json({ error: "Failed to get SBT status" });
  }
});

export default router;
