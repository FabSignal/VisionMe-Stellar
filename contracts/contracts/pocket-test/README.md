# VisionMe Pocket Contract - Test Suite with DeFindex

## Overview

This document contains the complete test suite for the **VisionMe Pocket** smart contract on the Stellar Testnet, integrated with the **DeFindex** protocol for automatic yield generation on USDC deposits.

## Purpose

The `pocket-test-complete.ts` script is designed to:

1. **Validate the integration** between the Pocket contract and the DeFindex vault
2. **Test the complete flow** of pocket creation and deposits
3. **Verify automatic generation** of yields through dfTokens
4. **Calculate and project** yields based on DeFindex protocol APY
5. **Monitor the status** of the vault and balances in real-time

## System Architecture

### Main Components

- **Pocket Contract**: Manages users' savings "pockets"
- **DeFindex Vault**: Yield farming protocol that generates returns
- **USDC Token**: Base asset for deposits and calculations
- **dfTokens**: Vault participation tokens representing capital + yields

### Operating Flow

```
User → USDC Deposit → Pocket Contract → DeFindex Vault → dfTokens
                                                ↓
                                        Yield Generation
                                                ↓
                                    Increase in dfTokens value
```

## Implemented Features

### 1. Contract Management

- **`initializeContract()`**: Initializes the Pocket contract with vault and asset addresses
- **`invokeContract()`**: Generic function to invoke contract methods with error handling and transaction confirmation

### 2. Pocket Operations

#### Creation and Query
- **`createPocket()`**: Creates a new pocket with a defined savings goal
- **`getPocket()`**: Retrieves complete pocket data
- **`getPocketWithYield()`**: Gets pocket, real value, and yield in a single call (optimized)

#### Deposits and Withdrawals
- **`deposit()`**: Deposits USDC that automatically gets invested in DeFindex
- **`withdraw()`**: Withdraws dfTokens from the pocket

### 3. Yield Analysis

- **`getRealValue()`**: Calculates the current value of the pocket including generated yield
- **`getYieldEarned()`**: Gets accumulated yield
- **`calculateAPY()`**: Calculates the current APY (Annual Percentage Yield)

### 4. DeFindex Integration

- **`getVaultBalance()`**: Queries the total balance of the DeFindex vault
- **`getDfTokenValue()`**: Calculates the USDC value of a quantity of dfTokens

### 5. Utilities

- **`formatAmount()`**: Formats amounts with decimals for display
- **`delay()`**: Helper function for delays between operations

## Configuration

```typescript
const CONFIG = {
  NETWORK_PASSPHRASE: Networks.TESTNET,
  RPC_URL: 'https://soroban-testnet.stellar.org',
  POCKET_CONTRACT_ID: 'CDN7VZRCW3XB6EC2AMX4KFGTXEUCNEKM4AKFEFOF4GO23PE6CW3VUTQN',
  DEFINDEX_VAULT_ID: 'CDVBWOYLVZ34TZOEU7CCGBKV5C6PNDRKWTQEL262LRHWIWYRXA7ENMSC',
  USDC_CONTRACT_ID: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC',
  DEPOSIT_AMOUNT: '100000000', // 10 USDC
  TARGET_AMOUNT: '10000000000', // 1000 USDC
};
```

## Complete Test Flow

### STEP 1: Account Creation
- Generates a random keypair
- Requests XLM airdrop for fees

### STEP 2: Initialization
- Verifies or initializes the Pocket contract
- Configures vault and asset addresses

### STEP 3: Pocket Creation
- Creates a pocket with a 1000 USDC goal
- Obtains the pocket_id for subsequent operations

### STEP 4: First Deposit
- Deposits 10 USDC
- Contract automatically invests in DeFindex
- Receives dfTokens in return

### STEP 5: Post-Deposit Verification
- Queries the pocket status
- Verifies the amount of dfTokens received
- Calculates progress toward the goal

### STEP 6: Vault Query
- Gets the total balance managed by DeFindex
- Queries the total shares (dfTokens issued)
- Verifies vault fees

### STEP 7: Real Value Calculation
- Calculates the current value of dfTokens
- Compares with deposited amount
- Determines generated yield

### STEP 8: Second Deposit
- Deposits an additional 5 USDC
- Updates dfTokens balance

### STEP 9: Updated Balance
- Shows total deposited
- Calculates total progress

### STEP 10: Yield Projection
- Projects yields based on typical 6% APY
- Shows expected returns for 1 day, 7 days, 30 days, and 1 year

## Output Data

The test provides detailed information about:

- ✅ **Transaction confirmation** with hashes and links to Stellar Expert
- 📊 **Pocket progress** toward the goal
- 💎 **Amount of dfTokens** accumulated
- 📈 **Real value** of the pocket (capital + yield)
- ✨ **Generated yield** in USDC
- 💹 **Current yield percentage**
- 🏦 **DeFindex vault status**

## Use Cases

### 1. Complete Yield Report

```typescript
const pocketData = await getPocket(pocketId, caller);
const realValue = await getRealValue(pocketId, caller);
const yieldEarned = await getYieldEarned(pocketId, caller);
const apy = await calculateAPY(pocketId, caller);
```

### 2. Optimized Query

```typescript
const { pocket, realValue, yieldEarned } = await getPocketWithYield(pocketId, caller);
```

## Real-Time Monitoring

The script provides links for:

- **Stellar Expert**: View transactions and operations
- **DeFindex Dashboard**: Monitor vault status (if available)
- **Periodic queries**: Verify yield growth

## Important Considerations

### Yield Generation
- Yields accumulate over time
- Typical APY is 5-8%
- It's recommended to wait 24-48 hours to see significant returns

### Value Calculation
The formula to calculate real value is:
```
current_value = (dfTokens × total_managed_funds) / total_shares
yield = current_value - current_amount
```

### Error Handling
- Simulation validation before submission
- 180-second timeout for complex operations
- High fees (10,000,000 stroops) to guarantee execution

## Data Structures

### PocketData
```typescript
interface PocketData {
  owner: string;           // Owner's address
  asset: string;           // Token address (USDC)
  goal_amount: bigint;     // Savings goal
  current_amount: bigint;  // Deposited amount
  df_tokens: bigint;       // Accumulated dfTokens
  first_deposit?: bigint;  // First deposit timestamp
  last_deposit?: bigint;   // Last deposit timestamp
}
```

### VaultBalance
```typescript
interface VaultBalance {
  total_managed_funds: bigint;  // Total funds in the vault
  fee: bigint;                  // Vault commission
  total_shares: bigint;         // Total dfTokens issued
}
```

## Dependencies

```json
{
  "@stellar/stellar-sdk": "^12.x"
}
```

## Execution

```bash
ts-node pocket-test-complete.ts
```

## Expected Result

Upon successful completion, the script displays:

- ✅ Confirmation of all operations
- 📊 Complete pocket summary
- 💡 Instructions to verify yield in the future
- 🔗 Links to blockchain explorers
- 📈 Yield projections

## Version Notes

This file corresponds to a **complete test version** that includes:
- Real integration with DeFindex on Testnet
- Yield and APY calculations
- Vault monitoring
- Yield projections

For production versions, the following should be adjusted:
- Network configuration (Mainnet)
- Contract addresses
- Fee and timeout parameters
- Error handling for production environment

