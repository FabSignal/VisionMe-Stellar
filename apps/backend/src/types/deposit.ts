// src/types/deposit.ts

export interface DepositWithSwapRequest {
  pocketId: string;
  fromAsset: string;
  toAsset: string;
  amountIn: string;
  fromAddress: string;
}

export interface DepositWithSwapResponse {
  transactionHash: string;
  amountOut: string;
  depositAmount: string;
  newStreakDays: number;
  sbtEligible: boolean;
}

export interface Deposit {
  id: string;
  pocketId: string;
  userId: string;
  amount: string;
  asset: string;
  transactionHash: string;
  createdAt: string;
}