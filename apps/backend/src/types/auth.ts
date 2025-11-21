//src/types/auth.ts

// Authentication-related types

// Authentication-related types

export interface CrossmintAccount {
  id: string;
  email?: string;
  name?: string;
  avatar?: string;
  stellarPublicKey: string;
  createdAt: string;
}

export interface VisionMeUser {
  id: string;
  socialUserId: string;
  email?: string;
  stellarPublicKey: string;
  avatarConfig?: {
    name: string;
    color: string;
    style: string;
  };
  sbtIssued: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthRequest {
  socialUserId: string;
  email?: string;
  stellarPublicKey: string;
}

export interface AuthResponse {
  user: VisionMeUser;
  token: string; // JWT
}

export interface JWTPayload {
  userId: string;
  stellarPublicKey: string;
  iat: number;
  exp: number;
}