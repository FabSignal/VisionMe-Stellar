// src/services/streakService.ts
// Streak Calculation

import { createClient } from "@supabase/supabase-js";
import { ENV } from "../config/env";

const supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY);

/**
 * Service for streak calculation and management
 */
export class StreakService {
  /**
   * Calculate streaks for a user based on deposits
   */
  async calculateStreaks(userId: string, pocketId: string) {
    console.log(
      `\n📊 Calculating streaks for user ${userId}, pocket ${pocketId}`
    );

    try {
      // Get all deposits for this pocket, ordered by date
      const { data: deposits, error: depositsError } = await supabase
        .from('deposits')
        .select('*')
        .eq('pocket_id', pocketId)
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (depositsError) throw depositsError;

      if (deposits.length === 0) {
        return {
          currentDays: 0,
          maxDays: 0,
          lastDepositDate: null,
        };
      }

      // Group deposits by day
      const depositDays = new Set<string>();
      for (const deposit of deposits) {
        const dateStr = deposit.created_at.toISOString().split("T")[0];
        depositDays.add(dateStr);
      }

      // Calculate consecutive days
      const sortedDays = Array.from(depositDays).sort();
      let currentStreak = 1;
      let maxStreak = 1;

      for (let i = 1; i < sortedDays.length; i++) {
        const current = new Date(sortedDays[i]);
        const previous = new Date(sortedDays[i - 1]);
        const daysDiff = Math.floor(
          (current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysDiff === 1) {
          currentStreak++;
          maxStreak = Math.max(maxStreak, currentStreak);
        } else {
          currentStreak = 1;
        }
      }

      const lastDepositDate = new Date(sortedDays[sortedDays.length - 1]);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Check if streak is still active (deposit today or yesterday)
      const daysSinceLastDeposit = Math.floor(
        (today.getTime() - lastDepositDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      const isStreakActive = daysSinceLastDeposit <= 1;
      const finalCurrentDays = isStreakActive ? currentStreak : 0;

      // Save to database (upsert: insert or update)
      const { error: streakError } = await supabase
        .from('streaks')
        .upsert({
          user_id: userId,
          pocket_id: pocketId,
          current_days: finalCurrentDays,
          max_days: maxStreak,
          last_deposit_date: lastDepositDate,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,pocket_id'
        });

      if (streakError) throw streakError;

      console.log(
        `✅ Streak calculated: ${finalCurrentDays} current, ${maxStreak} max`
      );

      return {
        currentDays: finalCurrentDays,
        maxDays: maxStreak,
        lastDepositDate,
      };
    } catch (error) {
      console.error("Error calculating streaks:", error);
      throw error;
    }
  }

  /**
   * Get streak info for a pocket
   */
  async getStreak(userId: string, pocketId: string) {
    const { data: streak, error } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', userId)
      .eq('pocket_id', pocketId)
      .single();

    if (error || !streak) {
      return {
        currentDays: 0,
        maxDays: 0,
        sbtEligible: false,
        daysUntilSBT: ENV.STREAK_GOAL_DAYS,
      };
    }

    const sbtEligible = streak.current_days >= ENV.STREAK_GOAL_DAYS;
    const daysUntilSBT = Math.max(
      0,
      ENV.STREAK_GOAL_DAYS - streak.current_days
    );

    return {
      currentDays: streak.current_days,
      maxDays: streak.max_days,
      sbtEligible,
      daysUntilSBT,
    };
  }

  /**
   * Check if user is eligible for SBT
   */
  async isSBTEligible(userId: string): Promise<boolean> {
    // Get all pockets for the user
    const { data: pockets, error } = await supabase
      .from('pockets')
      .select('*')
      .eq('owner_id', userId);

    if (error || !pockets || pockets.length === 0) return false;

    // Check if any pocket has streak >= goal
    for (const pocket of pockets) {
      const streak = await this.getStreak(userId, pocket.id);
      if (streak.sbtEligible) {
        return true;
      }
    }

    return false;
  }
}

export const streakService = new StreakService();