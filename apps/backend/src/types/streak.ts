// src/types/streak.ts

export interface Streak {
  id: string;
  userId: string;
  pocketId: string;
  currentDays: number;
  maxDays: number;
  lastDepositDate: string;
  startDate: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  updatedAt: string;
}

export interface StreakResponse {
  currentDays: number;
  maxDays: number;
  lastDepositDate: string;
  sbtEligible: boolean;
  daysUntilSBT: number;
}