# VisionMe

> *Building sustainable saving habits through emotional connection and blockchain technology*

[![Stellar](https://img.shields.io/badge/Built%20on-Stellar-black?style=flat&logo=stellar)](https://stellar.org)
[![Soroban](https://img.shields.io/badge/Smart%20Contracts-Soroban-purple?style=flat)](https://soroban.stellar.org)
[![USDC](https://img.shields.io/badge/Stablecoin-USDC-blue?style=flat)](https://www.circle.com/usdc)
[![Crossmint](https://img.shields.io/badge/Wallet-Crossmint-orange?style=flat)](https://www.crossmint.com/)

## Table of Contents

- [Overview](#overview)
- [The Problem](#the-problem)
- [Our Solution](#our-solution)
- [Why This Architecture?](#why-this-architecture)
- [Why Stellar?](#why-stellar)
- [Core Features](#core-features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [User Benefits](#user-benefits)
- [Getting Started](#getting-started)
- [Smart Contracts](#smart-contracts)
- [Team](#team)

## Overview

VisionMe is an emotional savings application: a habit-building platform guided by an avatar representing the user's Future Self, built on the Stellar network, with Soroban smart contracts that automate micro-savings in a secure, transparent, and efficient way.

### Target User: Lucia's Story

**Lucia, 29** — Freelance Designer from Argentina
- **Monthly Income**: USD 800–1,500 (variable)
- **Challenge**: Emotional relationship with money (guilt, anxiety, avoidance)
- **Pattern**: Motivation → Effort → Distraction → Guilt → Giving up
- **Dreams**: Travel to Brazil, buy better equipment, create an emergency fund

**VisionMe transforms her story from cycles of guilt to sustainable progress.**

## The Problem

### Critical Statistics
- **70%+** of LATAM population cannot maintain monthly savings habits
- Most abandon savings plans within **90 days**
- Millions lack emergency funds, vulnerable to economic shocks

### Root Causes
This isn't about willpower—it's behavioral:
- Human minds are biased toward the present
- Financial management creates mental overload
- Traditional tools fail to address emotional barriers
- High fees prevent meaningful micro-savings
- **Crypto complexity** scares away potential users

### Who's Affected?
- Informal workers and freelancers with variable income
- Families without access to financial security mechanisms
- Anyone seeking financial inclusion in LATAM
- **Non-crypto users** who need simple, familiar onboarding

## Our Solution

VisionMe creates a **simple, emotionally secure, and sustainable savings system** that doesn't depend on constant discipline, high motivation, or crypto knowledge.

### Core Innovation: The Future Self Avatar

Your Future Self acts as a personal financial mentor:
- **Tracks progress** toward your goals
- **Celebrates milestones** and maintains motivation
- **Provides education** through contextual insights
- **Offers encouragement** during the journey

### User Journey

```
1. Sign Up with Google (Web2 Login)
   ↓
2. Create Future Self Avatar
   ↓
3. Set Financial Goal (emergency fund, travel, education)
   ↓
4. Schedule Automated Micro-Savings
   ↓
5. Avatar Guides & Celebrates Progress
   ↓
6. Achieve Goal with Transparent On-Chain Tracking
   ↓
7. Earn Non-Transferable Achievement SBT
```

## Why This Architecture?

### User-Centric Design Benefits

Our architecture solves critical user pain points:

#### 1. **Web2 Onboarding for Web3 Benefits**
**The Problem**: Traditional crypto wallets require:
- Understanding private keys and seed phrases
- Managing complex wallet software
- Fear of losing funds forever
- High technical barrier to entry

**Our Solution**: Crossmint Social Wallet
- **Login with Google** - exactly like any web app
- **No seed phrases** - social recovery via email
- **Automatic Stellar account creation** - happens behind the scenes
- **Progressive disclosure** - users learn crypto gradually

**User Benefit**: Lucia can start saving in 30 seconds, just like signing up for Netflix. No crypto knowledge required.

#### 2. **Smart Contract Independence for Security**
**The Problem**: Complex cross-contract calls create:
- Higher attack surface
- Difficult-to-audit code
- Single point of failure
- Gas/fee amplification

**Our Solution**: Independent Contracts
- **PocketContract**: Pure savings logic, user-controlled
- **SBTContract**: Pure achievement tokens, admin-controlled
- **No inter-contract dependencies**

**User Benefit**: Your savings are isolated from achievement logic. Even if one system fails, your funds remain safe.

#### 3. **Off-Chain Business Logic for Flexibility**
**The Problem**: On-chain logic is:
- Expensive to update
- Rigid once deployed
- Difficult to debug
- Limited in complexity

**Our Solution**: Backend Orchestration
- **Streak calculation** - free and instant updates
- **SBT eligibility** - flexible criteria without redeploy
- **Business rule changes** - adapt to user feedback quickly
- **Analytics and insights** - rich data processing

**User Benefit**: We can improve your experience daily without waiting for blockchain updates. New features arrive fast.

#### 4. **Dual-Token Authentication for Security**
**The Problem**: Single authentication creates:
- Backend can sign transactions for you (security risk)
- User loses control of funds
- Trust required in centralized service

**Our Solution**: Dual-Token System
- **VisionMe JWT**: Authenticates API calls to our backend
- **Crossmint Token**: Signs YOUR transactions on YOUR behalf
- **Backend never has signing power** - you remain in control

**User Benefit**: We can never move your funds without your permission. You have true ownership while enjoying Web2 convenience.

#### 5. **Stablecoin + DEX Integration**
**The Problem**: Volatility and liquidity
- Crypto price swings destroy savings plans
- Limited token choices
- Expensive conversions

**Our Solution**: USDC + Soroswap
- **Save in USDC** - stable value matching USD
- **Automatic swaps** - convert any token to savings
- **DEX liquidity** - best rates, no centralized exchange

**User Benefit**: Save in dollars (via USDC) regardless of market chaos. Deposit XLM, automatically convert to stable savings.

## Why Stellar?

Stellar makes VisionMe possible by solving critical technical barriers:

| Challenge | Stellar Solution | User Benefit |
|-----------|------------------|--------------|
| **High fees eating micro-savings** | Near-zero transaction costs (~$0.00001) | Save $1 without losing 30% to fees |
| **Slow confirmations** | 3-5 second finality | Instant gratification, no waiting |
| **Price volatility** | USDC stablecoin integration | Your $100 stays $100, not $70 tomorrow |
| **Complex onboarding** | Crossmint Social Wallet (Web2 login) | Sign up like any app, get crypto benefits |
| **Lack of transparency** | Horizon API for real-time tracking | See every transaction, verify everything |
| **Smart contract needs** | Soroban for automated savings logic | Set it and forget it, avatar handles the rest |

### Stellar Ecosystem Components Used

- **Stellar Network**: Fast, low-cost transactions
- **Soroban Smart Contracts**: On-chain Vision Pockets + SBTs
- **Crossmint Social Wallet SDK**: Frictionless Web2 authentication
- **Horizon API**: Real-time operation status and balance queries
- **Soroswap DEX**: Decentralized asset swapping
- **USDC on Stellar**: Stable value preservation

## Core Features

### 1. Web2 Authentication with Crossmint Social Wallet
**What it does:**
- **Google login** with automatic Stellar account creation
- Social recovery (email-based, no seed phrases)
- Embedded wallet UI for seamless UX

**Why it matters:**
- Removes crypto complexity barrier
- Familiar login flow (OAuth)
- Users control funds without technical knowledge
- Progressive disclosure: learn crypto gradually

**User Benefit**: "I signed up like any normal app, but I'm actually using blockchain technology for better security and transparency."

### 2. Future Self Avatar — Habit Motivation Engine
**What it does:**
- Visual representation of user's future self
- Progress tracking and streak visualization
- Emotional layer driving savings behavior
- Personalized encouragement system
- Celebration animations on milestones

**Why it matters:**
- Addresses emotional barriers to saving
- Creates psychological connection with future goals
- Gamification increases engagement
- Makes finance less stressful

**User Benefit**: "My avatar celebrates with me when I save. It's like having a supportive friend who never judges."

### 3. PocketContract (Soroban Smart Contracts)
**What it does:**
- Create savings pockets for specific goals
- Record contributions transparently on-chain
- Query pocket state anytime
- Withdraw funds under your control

**Why it matters:**
- Transparent, immutable savings records
- You own your data and funds
- No third party can freeze or confiscate
- Audit trail for every transaction

**User Benefit**: "My savings are truly mine. No bank can freeze my account. I can verify every transaction."

### 4. Automatic Asset Swapping via Soroswap
**What it does:**
- Deposit any supported asset (XLM, USDC, etc.)
- Automatically swap to your preferred savings asset
- Best available rates from DEX liquidity
- Single-click conversion flow

**Why it matters:**
- Flexibility in how you contribute
- No need to manually convert tokens
- Decentralized exchange = better rates
- Seamless user experience

**User Benefit**: "I can save in USDC even if I only have XLM. The app handles conversion automatically."

### 5. Streak System + Financial Identity SBT
**What it does:**
- **Off-chain**: Backend tracks contributions and calculates streaks
- **On-chain**: SBT minting when key milestones are achieved (e.g., 90 days)
- Non-transferable "VisionMe Financial Identity" token
- Proof of consistent saving habit

**Why it matters:**
- Gamification meets verifiable achievement
- Portable reputation across DeFi
- Non-transferable = authentic identity
- Milestone recognition drives motivation

**User Benefit**: "After 90 days of saving, I earned a badge that proves my financial discipline. It's like a credit score, but for my saving habits."

### 6. End-to-End Demo (Testnet)
Complete workflow demonstration:
```
Web2 Login → Avatar Activation → Create Pocket →
Contribute (with auto-swap) → Streak Increases →
Avatar Celebrates → SBT Earned
```

## Architecture

### System Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                      Frontend (React/Next.js)                   │
│  • Crossmint Social Wallet UI                                    │
│  • Avatar visualization                                          │
│  • Pocket CRUD, Deposit flow                                     │
│  • Streak & SBT display                                          │
│                                                                  │
│  AUTHENTICATION:                                                 │
│  • VisionMe JWT - API authentication (localStorage)             │
│  • Crossmint Token - Transaction signing (from SDK)             │
└────────────────┬─────────────────────────────────┬───────────────┘
                 │                                 │
        ┌────────▼──────────┐           ┌─────────▼──────────┐
        │  Crossmint SDK    │           │  Backend API       │
        │  (Social Wallet)  │           │  (Express/Next.js) │
        │                   │           │                    │
        │ • OAuth (Google)  │           │ • Auth endpoint    │
        │ • Stellar account │           │   (JWT issue)      │
        │ • Transaction     │           │ • Pocket CRUD      │
        │   signing         │           │ • Deposit-swap     │
        │ • Token export    │           │ • Streaks          │
        └────────┬──────────┘           │ • SBT check        │
                 │                      └─────────┬──────────┘
                 │                                │
        ┌────────▼────────────────────────────────▼──────────┐
        │            Stellar Testnet (Soroban RPC)          │
        │                                                    │
        │  ┌──────────────────────────────────────────────┐  │
        │  │     PocketContract (Savings Logic)           │  │
        │  │     - require_auth(owner) on all ops         │  │
        │  │     - Tracks progress counter only           │  │
        │  │     - No token custody (user controls)       │  │
        │  │                                              │  │
        │  │ Functions (all require user signature):      │  │
        │  │ • create_pocket(owner, asset, goal)         │  │
        │  │ • deposit(pocket_id, from, amount)          │  │
        │  │ • withdraw(pocket_id, to, amount)           │  │
        │  │ • get_pocket(pocket_id)                     │  │
        │  └──────────────────────────────────────────────┘  │
        │                                                    │
        │  ┌──────────────────────────────────────────────┐  │
        │  │     SBTContract (Achievement Token)          │  │
        │  │     - require_auth(admin) for minting        │  │
        │  │     - Issues non-transferable SBTs            │  │
        │  │     - Independent from PocketContract        │  │
        │  │                                              │  │
        │  │ Functions:                                   │  │
        │  │ • mint(to, metadata) - admin only           │  │
        │  │ • has_sbt(owner) - public view              │  │
        │  │ • update_admin(new_admin) - admin only      │  │
        │  └──────────────────────────────────────────────┘  │
        │                                                    │
        │  ┌──────────────────────────────────────────────┐  │
        │  │     Soroswap Router (DEX Integration)        │  │
        │  │     - Liquidity pools for asset swaps        │  │
        │  │     - Best rate calculation                  │  │
        │  │     - Slippage protection                    │  │
        │  └──────────────────────────────────────────────┘  │
        │                                                    │
        │  Horizon API (read-only Stellar state queries)     │
        └────────────────────────────────────────────────────┘
                 │
        ┌────────▼──────────────┐
        │  Supabase PostgreSQL  │
        │                       │
        │ • users               │
        │ • pockets             │
        │ • deposits            │
        │ • streaks             │
        │ • sbt_status          │
        └───────────────────────┘
```

### Key Architectural Principles

#### Security First
- **Backend NEVER signs user transactions**
- Dual-token authentication separates concerns
- Smart contracts require explicit user authorization
- Private keys stay with Crossmint (user-controlled)

#### Data Flow: Complete User Journey

```
1. REGISTRATION & LOGIN
   User → Google OAuth → Crossmint creates Stellar account
   → Frontend receives stellarPublicKey
   → Backend registers user in DB → Issues VisionMe JWT

2. AVATAR CREATION
   User customizes avatar → Backend stores config in DB
   → Frontend displays personalized Future Self

3. POCKET CREATION
   User inputs goal details → Backend calls PocketContract.create_pocket()
   → Crossmint SDK signs transaction (user approval)
   → On-chain pocket_id returned → Backend stores metadata in DB

4. DEPOSIT + SWAP FLOW
   User inputs amount and asset → Backend:
      a) Queries Soroswap for best rate
      b) Builds swap transaction XDR
      c) Frontend signs with Crossmint token
      d) Executes swap → receives output amount
      e) Calls PocketContract.deposit() with result
      f) Records deposit in DB
      g) Updates streak calculation
   → Frontend shows success + new streak

5. STREAK VISUALIZATION & SBT ELIGIBILITY
   Backend cron job:
      a) Reads all user deposits
      b) Calculates consecutive streaks
      c) Checks SBT eligibility (e.g., 90 days)
      d) If eligible: calls SBTContract.mint()
      e) Marks user as sbt_issued in DB
   → Frontend displays streak progress and SBT status
```

### Component Responsibilities

#### Frontend (React + Next.js)
- VisionMe dashboard UI
- Crossmint Social Wallet SDK integration
- Direct Soroban contract interaction (via Crossmint signing)
- Avatar visualization and animations
- Streak and progress display
- Real-time balance queries (Horizon API)

#### Backend (Express.js + Supabase)
- Map Web2 identity ↔ Stellar publicKey
- Issue and verify VisionMe JWTs
- Orchestrate deposit-swap flow
- Calculate streaks and eligibility (off-chain)
- Trigger SBT minting (on-chain)
- Serve real-time data to frontend
- Cron jobs for periodic tasks

#### Smart Contracts (Soroban)
Two independent contracts on Stellar testnet:

1. **PocketContract**
   - Create savings pockets
   - Process deposits (requires user signature)
   - Allow withdrawals (requires user signature)
   - Query pocket state (public)
   - **Does NOT hold tokens** (user retains custody)

2. **SBTContract**
   - Mint non-transferable achievement tokens
   - Admin-controlled issuance
   - Public ownership verification
   - **Independent of PocketContract** (no cross-calls)

#### Data Storage
- **Supabase Postgres**: User data, mappings, streaks, SBT status, pocket metadata
- **On-chain (Soroban)**: Canonical pocket state, SBT ownership
- **Crossmint**: Account abstraction, key custody, social recovery

## Technology Stack

### Frontend
- **Framework**: Next.js 16 (React 19)
- **Styling**: Tailwind CSS 4
- **Wallet SDK**: Crossmint Social Wallet SDK
- **Blockchain SDK**: @stellar/stellar-sdk
- **State Management**: React Context + hooks
- **HTTP Client**: fetch API

### Backend
- **Framework**: Express.js + TypeScript
- **Database**: Supabase (Backend-as-a-Service)
- **ORM**: Prisma
- **Blockchain SDKs**:
  - @stellar/stellar-sdk
  - @soroswap/sdk (DEX integration)
- **Authentication**: JWT + Crossmint verification
- **Job Queue**: Node-cron (streak calculation)

### Blockchain
- **Network**: Stellar Testnet
- **Smart Contracts**: Soroban (Rust)
- **Wallet Integration**: Crossmint Social Wallet
- **DEX**: Soroswap (liquidity provider)
- **API**: Horizon (read-only queries)
- **Assets**: USDC, XLM (testnet)

### DevOps & Tools
- Git & GitHub
- Vercel (frontend deployment)
- Render/Railway (backend deployment)
- Stellar CLI
- Soroban CLI
- Crossmint Dashboard

## User Benefits

### For Non-Crypto Users (Primary Audience)

1. **No Technical Barriers**
   - Sign up with Google, just like Gmail
   - No wallet software to download
   - No seed phrases to memorize or lose
   - Interface looks like any modern app

2. **Financial Control Without Complexity**
   - You own your savings (Stellar account)
   - Transparent, verifiable transactions
   - No bank can freeze your account
   - But you don't need to understand blockchain

3. **Emotional Support**
   - Avatar provides motivation and encouragement
   - Gamification makes saving fun
   - Streak system builds habits gradually
   - Celebration of small wins

4. **Real USD Savings**
   - Save in USDC (1 USDC = 1 USD)
   - No crypto volatility risk
   - Withdraw to cash anytime
   - International accessibility (LATAM focus)

5. **Progressive Learning**
   - Start with familiar Web2 UX
   - Gradually learn about blockchain benefits
   - Optional education through avatar insights
   - Path to broader DeFi ecosystem

### For Crypto-Native Users (Secondary Audience)

1. **True Ownership**
   - Non-custodial architecture
   - On-chain savings records
   - Portable SBT reputation
   - No centralized control

2. **DeFi Integration**
   - Soroswap DEX for best rates
   - Stellar ecosystem access
   - Future composability potential
   - Verifiable achievement tokens

3. **Privacy & Security**
   - Backend can't sign transactions
   - Open-source smart contracts
   - Auditable on-chain data
   - Social recovery via Crossmint

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm
- Stellar testnet account (auto-created via Crossmint)
- Crossmint API key
- Supabase account

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/visionme-dapp.git
   cd visionme-dapp
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   # Frontend (.env.local)
   NEXT_PUBLIC_CROSSMINT_API_KEY=your_crossmint_key
   NEXT_PUBLIC_API_URL=http://localhost:3001
   NEXT_PUBLIC_POCKET_CONTRACT_ID=your_deployed_contract_id
   NEXT_PUBLIC_SBT_CONTRACT_ID=your_deployed_sbt_contract_id

   # Backend (.env)
   DATABASE_URL=your_supabase_connection_string
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   JWT_SECRET=your_jwt_secret
   SBT_ADMIN_SECRET=your_stellar_private_key
   CROSSMINT_API_KEY=your_crossmint_key
   POCKET_CONTRACT_ID=your_deployed_contract_id
   SBT_CONTRACT_ID=your_deployed_sbt_contract_id
   ```

4. **Deploy Smart Contracts**
   ```bash
   cd contracts/pocket-contract
   soroban contract build
   soroban contract deploy \
     --wasm target/wasm32-unknown-unknown/release/pocket_contract.wasm \
     --source YOUR_ADMIN_SECRET \
     --network testnet

   cd ../sbt-contract
   soroban contract build
   soroban contract deploy \
     --wasm target/wasm32-unknown-unknown/release/sbt_contract.wasm \
     --source YOUR_ADMIN_SECRET \
     --network testnet
   ```

5. **Run Database Migrations**
   ```bash
   cd apps/backend
   pnpm prisma migrate dev
   ```

6. **Start Development Servers**
   ```bash
   # Terminal 1 - Backend
   cd apps/backend
   pnpm dev

   # Terminal 2 - Frontend
   cd apps/web
   pnpm dev
   ```

7. **Access the App**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Backend Health: http://localhost:3001/health

### Testing the Flow

1. Visit http://localhost:3000
2. Click "Login with Google"
3. Authorize Crossmint
4. Create your Future Self avatar
5. Create a savings pocket (goal: $100, frequency: daily)
6. Deposit XLM → auto-converts to USDC
7. Watch your streak grow
8. After 90 days: receive SBT achievement token

## Smart Contracts

### PocketContract (Soroban)

**Location**: `/contracts/pocket-contract/src/lib.rs`

**Purpose**: Manage user savings pockets on-chain

**Key Functions**:
```rust
// Create a new savings pocket
pub fn create_pocket(
    env: Env,
    owner: Address,
    asset: Address,
    goal_amount: i128
) -> String

// Deposit funds (requires user signature)
pub fn deposit(
    env: Env,
    pocket_id: String,
    from: Address,
    amount: i128
) -> ()

// Withdraw funds (requires user signature)
pub fn withdraw(
    env: Env,
    pocket_id: String,
    to: Address,
    amount: i128
) -> ()

// Query pocket state (public)
pub fn get_pocket(
    env: Env,
    pocket_id: String
) -> PocketData
```

**Security Features**:
- All write operations require `require_auth(user)`
- No admin override capabilities
- Users retain full custody of funds
- Transparent state queries

### SBTContract (Soroban)

**Location**: `/contracts/sbt-contract/src/lib.rs`

**Purpose**: Issue non-transferable achievement tokens

**Key Functions**:
```rust
// Mint SBT (admin only)
pub fn mint(
    env: Env,
    to: Address,
    metadata: String
) -> ()

// Check SBT ownership (public)
pub fn has_sbt(
    env: Env,
    owner: Address
) -> bool

// Update admin (admin only)
pub fn update_admin(
    env: Env,
    new_admin: Address
) -> ()
```

**Security Features**:
- Only admin can mint SBTs
- Tokens are non-transferable (soulbound)
- Admin can be updated (decentralization path)
- Metadata stored on-chain

### Contract Deployment (Testnet)

```bash
# Build contracts
cd contracts/pocket-contract && soroban contract build
cd ../sbt-contract && soroban contract build

# Deploy to testnet
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/pocket_contract.wasm \
  --source ADMIN_SECRET_KEY \
  --network testnet

stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/sbt_contract.wasm \
  --source ADMIN_SECRET_KEY \
  --network testnet
```

## Team

| Name                | Role                     | LinkedIn                                                |
|---------------------|---------------------------|----------------------------------------------------------|
| **Natalia Loreto**  | Product Manager           | [Profile](https://www.linkedin.com/in/soylaloreto/)     |
| **Fabiana Fernández** | Smart Contract & Backend Developer • Product Designer | [Profile](https://www.linkedin.com/in/fabiana-fernandez/) |
| **Julieta Heit**    | Smart Contract Developer • Product Designer | [Profile](https://www.linkedin.com/in/julieta-heit/)     |
| **Verónica Rebolleda** | Frontend Developer     | [Profile](https://www.linkedin.com/in/m-veronica-rebolleda/) |
| **Sol Gayarin**     | Designer                  | [Profile](https://www.linkedin.com/in/sol-gayarin/)      |

## License

MIT License - see [LICENSE](LICENSE) file for details

---

<p align="center">
  <strong>Built for Stellar Hack+ 2025</strong>
  <br>
  <em>Transforming financial habits through emotional connection, one micro-saving at a time</em>
  <br><br>
  <strong>Web2 Simplicity + Web3 Benefits = Financial Inclusion for Everyone</strong>
</p>
