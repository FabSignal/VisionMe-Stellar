// src/routes/auth.ts
// Authentication Routes - Using Supabase Client
import express, { Router, Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env";

const router = Router();

// Initialize Supabase client
const supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY);

/**
 * POST /api/auth/callback
 * Crossmint redirects here after user logs in
 */
router.post("/callback", async (req: Request, res: Response) => {
  try {
    const { socialUserId, email, stellarPublicKey } = req.body;

    if (!socialUserId || !stellarPublicKey) {
      return res.status(400).json({
        error: "Missing required fields: socialUserId, stellarPublicKey",
      });
    }

    // Check if user exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("social_user_id", socialUserId)
      .single();

    let user;

    if (existingUser) {
      // Update existing user
      const { data: updatedUser, error: updateError } = await supabase
        .from("users")
        .update({
          email,
          stellar_public_key: stellarPublicKey,
          updated_at: new Date().toISOString(),
        })
        .eq("social_user_id", socialUserId)
        .select()
        .single();

      if (updateError) throw updateError;
      user = updatedUser;
    } else {
      // Create new user
      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert({
          social_user_id: socialUserId,
          email,
          stellar_public_key: stellarPublicKey,
        })
        .select()
        .single();

      if (createError) throw createError;
      user = newUser;
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        stellarPublicKey: user.stellar_public_key,
      },
      ENV.JWT_SECRET as any,
      { expiresIn: ENV.JWT_EXPIRATION } as any
    );

    res.json({
      user: {
        id: user.id,
        socialUserId: user.social_user_id,
        email: user.email,
        stellarPublicKey: user.stellar_public_key,
      },
      token,
    });
  } catch (error) {
    console.error("Auth callback error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
});

/**
 * GET /api/auth/user
 * Get current logged-in user
 */
router.get("/user", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing authorization token" });
    }

    const token = authHeader.substring(7);
    const decoded: any = jwt.verify(token, ENV.JWT_SECRET as any);

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", decoded.userId)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      id: user.id,
      socialUserId: user.social_user_id,
      email: user.email,
      stellarPublicKey: user.stellar_public_key,
    });
  } catch (error: any) {
    console.error("Get user error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
});

export default router;