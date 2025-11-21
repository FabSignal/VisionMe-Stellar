// src/config/env.ts
// Backend configuration from environment
// src/config/env.ts
// Backend configuration from environment
export const ENV = {
  // Server
  PORT: parseInt(process.env.PORT || '3001', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Database
  SUPABASE_URL: process.env.SUPABASE_URL!,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
  DATABASE_URL: process.env.DATABASE_URL!,

  // Stellar
  HORIZON_URL: 'https://horizon-testnet.stellar.org',
  SOROBAN_RPC_URL: 'https://soroban-testnet.stellar.org',
  STELLAR_NETWORK: 'testnet',

  // Smart Contracts
  POCKET_CONTRACT_ID: process.env.POCKET_CONTRACT_ID!,
  SBT_CONTRACT_ID: process.env.SBT_CONTRACT_ID!,
  SBT_ADMIN_SECRET: process.env.SBT_ADMIN_SECRET!,

  // Assets
  XLM_CONTRACT_ID: process.env.XLM_CONTRACT_ID || 'CBQVD2B37Z5GVINV7TSVWFEH3FVJLEG5ZSYWFBQ6TQLQ5BNJXG5HSQJ',
  USDC_CONTRACT_ID: process.env.USDC_CONTRACT_ID || 'CDWEFYYHMGEZEFC5TBUDXM3IJJ7K7W5BDGE765UIYQEV4JFWDOLSTOEK',

  // Soroswap
  SOROSWAP_API_KEY: process.env.SOROSWAP_API_KEY!,
  SOROSWAP_API_URL: 'https://api.soroswap.finance',

  // Crossmint
  CROSSMINT_API_KEY: process.env.CROSSMINT_API_KEY!,
  CROSSMINT_API_URL: 'https://staging.api.crossmint.com',

  // Business Logic
  STREAK_GOAL_DAYS: 90,
  DEFAULT_SLIPPAGE_BPS: 500,

  // JWT
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_EXPIRATION: '7d',
};

// Validation
const required = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'DATABASE_URL',
  'POCKET_CONTRACT_ID',
  'SBT_CONTRACT_ID',
  'SBT_ADMIN_SECRET',
  'SOROSWAP_API_KEY',
  'CROSSMINT_API_KEY',
  'JWT_SECRET',
];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}