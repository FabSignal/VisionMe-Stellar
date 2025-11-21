// src/types/sbt.ts

export interface SBTStatus {
  id: string;
  userId: string;
  stellarPublicKey: string;
  issued: boolean;
  issuedAt?: string;
  transactionHash?: string;
  metadata?: {
    streakDays: number;
    version: string;
  };
  createdAt: string;
  updatedAt: string;
}