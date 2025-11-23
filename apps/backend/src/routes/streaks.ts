// src/routes/streaks.ts
// Streak Routes

import express, { Router, Request, Response } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { streakService } from "../services/streakService";

const router = Router();

/**
 * GET /api/streaks/:pocketId
 * Get streak info for a pocket
 */
router.get(
  "/:pocketId",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const { pocketId } = req.params;

      const streakInfo = await streakService.getStreak(userId, pocketId);

      res.json(streakInfo);
    } catch (error: any) {
      console.error("Get streak error:", error);
      res.status(500).json({ error: "Failed to get streak" });
    }
  }
);

export default router;