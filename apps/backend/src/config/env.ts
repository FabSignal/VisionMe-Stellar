// Backend configuration from environment
export const ENV = {
  // Server
  PORT: parseInt(process.env.PORT || '3001', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Database
  SUPABASE_URL: 'https://jnhkpslnilfphwexpenk.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuaGtwc2xuaWxmcGh3ZXhwZW5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MTg3NDIsImV4cCI6MjA3OTE5NDc0Mn0._AN2y35DiSWrY7Kq8ALXfVbDCkC-rbR6KaivgFOkqGA',
  // DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/visionme',

  // Stellar
  HORIZON_URL: 'https://horizon-testnet.stellar.org',
  SOROBAN_RPC_URL: 'https://soroban-testnet.stellar.org',
  STELLAR_NETWORK: 'testnet',

  // Smart Contracts
  POCKET_CONTRACT_ID: 'CCB4CCPGZHLMLJVA5IUGTDEVU7TSR5SKAMPU6D5X3HUXIJB5B3BHYVFF',
  // SBT_CONTRACT_ID: process.env.SBT_CONTRACT_ID!,
  // SBT_ADMIN_SECRET: process.env.SBT_ADMIN_SECRET!,

  // Assets
  XLM_CONTRACT_ID: process.env.XLM_CONTRACT_ID || 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC',
  // USDC_CONTRACT_ID: process.env.USDC_CONTRACT_ID || 'CDWEFYYHMGEZEFC5TBUDXM3IJJ7K7W5BDGE765UIYQEV4JFWDOLSTOEK',

  // Soroswap
  SOROSWAP_API_KEY: 'sk_a1dd8ca12275f854230eaad60e7f8462b4abbef6debc3906804c469f5cd0073f',
  SOROSWAP_API_URL: 'https://api.soroswap.finance',

  // Crossmint
  CROSSMINT_API_KEY: 'sk_staging_29rYaWqHELSLENgbr7HdnSXBmJ6as9V2vVKD88imWDsdRM5Yt3zWo2inEc46NvHyYZX3G4rCDWKWE63nV3xQYH1EpscqjsYBnZT2URgSCRWoY735Ej2ZGRN4SYWVmwEtohiA4xp6NwuPT3qvA6LaKpDdPpETowx1L4jvLcSZN11JexXS5yRzmLQXpU1WrN7i8WKMMsJnBDtPNtaDdGyTMW2',
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
  // 'DATABASE_URL',
  'POCKET_CONTRACT_ID',
  'SBT_CONTRACT_ID',
  'SBT_ADMIN_SECRET',
  'SOROSWAP_API_KEY',
  'CROSSMINT_API_KEY',
  'JWT_SECRET',
];

//for (const key of required) {
  //if (!process.env[key]) {
    //throw new Error(`Missing required environment variable: ${key}`);
  //}
//}