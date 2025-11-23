// src/routes/deposits.ts
// Deposit Routes (Main Flow)

import express, { Router, Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";
import { authMiddleware } from "../middlewares/authMiddleware";
import { soroswapService } from "../services/soroswapService";
import { crossmintService } from "../services/crossmintService";
import { pocketService } from "../services/pocketService";
import { streakService } from "../services/streakService";
import { ENV } from "../config/env";

const router = Router();
const supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY);

/**
 * POST /api/deposits/deposit-with-swap
 * NOTE: This is the ONLY endpoint in this router (router is mounted at /api/deposits)
 *
 * Main orchestration endpoint:
 * 1. Get quote from Soroswap
 * 2. Build swap XDR
 * 3. Sign swap XDR with Crossmint
 * 4. Submit signed swap
 * 5. Build deposit XDR for PocketContract
 * 6. Sign deposit XDR with Crossmint
 * 7. Submit signed deposit
 * 8. Record deposit in database & calculate streaks
 *
 * AUTHENTICATION:
 * - Authorization: Bearer <VisionMe JWT> (for backend auth)
 * - X-Crossmint-Token: <Crossmint token> (for transaction signing)
 */
router.post(
  "/deposit-with-swap",
  authMiddleware,
  async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { pocketId, fromAsset, toAsset, amountIn, fromAddress } = req.body;

    // Extract both tokens from headers
    const visionMeJWT = req.headers.authorization?.substring(7); // Bearer token
    const crossmintToken = req.headers["x-crossmint-token"] as string;

    try {
      console.log(`\n🔄 Starting deposit-with-swap flow...`);

      if (!pocketId || !fromAsset || !toAsset || !amountIn || !fromAddress) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      if (!crossmintToken) {
        return res
          .status(401)
          .json({ error: "Missing X-Crossmint-Token header" });
      }

      // ==================== PHASE 1: SOROSWAP ====================

      // Step 1: Get quote from Soroswap
      const quote = await soroswapService.getQuote(
        fromAsset,
        toAsset,
        BigInt(amountIn)
      );

      // Step 2: Build swap transaction XDR (unsigned)
      const swapXDR = await soroswapService.buildSwapTransaction(
        quote,
        fromAddress
      );

      // Step 3: Sign swap XDR with Crossmint (user signs with their Social Wallet)
      const signedSwapXDR = await crossmintService.signTransactionXDR(
        swapXDR,
        fromAddress,
        crossmintToken
      );

      // Step 4: Submit signed swap transaction
      const swapResult = await soroswapService.sendSignedSwap(
        signedSwapXDR,
        quote.amountOut
      );

      const amountOut = swapResult.amountOut;

      // ==================== PHASE 2: POCKET DEPOSIT ====================

      // Step 5: Build deposit transaction XDR (unsigned)
      const depositXDR = await pocketService.buildDepositXDR(
        pocketId,
        fromAddress,
        amountOut
      );

      // Step 6: Sign deposit XDR with Crossmint (user signs with their Social Wallet)
      const signedDepositXDR = await crossmintService.signTransactionXDR(
        depositXDR,
        fromAddress,
        crossmintToken
      );

      // Step 7: Submit signed deposit transaction
      const depositTxHash = await pocketService.submitSignedDeposit(
        signedDepositXDR
      );

      // ==================== PHASE 3: RECORD & CALCULATE ====================

      // Step 8: Record deposit in database
      const { data: deposit, error: depositError } = await supabase
        .from('deposits')
        .insert({
          user_id: userId,
          pocket_id: pocketId,
          amount: amountOut.toString(),
          asset: toAsset,
          transaction_hash: depositTxHash,
        })
        .select();

      if (depositError) throw depositError;

      // Step 9: Calculate streaks (on-demand, during deposit)
      const streakInfo = await streakService.calculateStreaks(userId, pocketId);

      console.log(`✅ Deposit-with-swap completed successfully!`);

      res.status(200).json({
        transactionHash: depositTxHash,
        amountOut: amountOut.toString(),
        depositAmount: amountOut.toString(),
        newStreakDays: streakInfo.currentDays,
        deposit,
      });
    } catch (error: any) {
      console.error("Deposit-with-swap error:", error);
      res.status(500).json({
        error: error.message || "Deposit failed",
      });
    }
  }
);

export default router;
