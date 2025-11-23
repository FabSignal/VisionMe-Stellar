// src/services/pocketService.ts
// PocketContract Interaction

import {
  TransactionBuilder,
  Networks,
  Contract,
  Address,
  rpc,
  Keypair,
  Operation,
} from "@stellar/stellar-sdk";
// @ts-ignore
import * as scVal from "@stellar/stellar-base/lib/scval";
import { ENV } from "../config/env";

/**
 * Service for PocketContract interaction
 *
 * IMPORTANT: This contract does NOT move real token balances.
 * It only tracks a logical "saved amount" counter per pocket.
 *
 * The actual token transfers happen in:
 * - Soroswap (for asset swaps)
 * - Crossmint Social Wallet (stores user balances)
 *
 * Signing strategy:
 * - User operations (create_pocket, deposit, withdraw) MUST be signed by the user
 *   via Crossmint Social Wallet (which implements `require_auth(owner)`)
 * - This service only BUILDS the unsigned XDR, it does NOT sign
 */
export class PocketService {
  private sorobanRpc: rpc.Server;
  private pocketContractId: string;

  constructor() {
    this.sorobanRpc = new rpc.Server(ENV.SOROBAN_RPC_URL);
    this.pocketContractId = ENV.POCKET_CONTRACT_ID;
  }

  /**
   * Build (but do NOT sign) a create_pocket transaction XDR
   * The returned XDR must be signed by the user via Crossmint
   */
  async buildCreatePocketXDR(
    ownerAddress: string,
    assetContractId: string,
    goalAmount: bigint
  ): Promise<string> {
    console.log(`\n📝 Building create_pocket XDR...`);
    console.log(`   Owner: ${ownerAddress}`);
    console.log(`   Asset: ${assetContractId}`);
    console.log(`   Goal: ${Number(goalAmount) / 10000000}`);

    try {
      const contract = new Contract(this.pocketContractId);
      const ownerAddr = new Address(ownerAddress).toScVal();
      const assetAddr = new Address(assetContractId).toScVal();
      const goalVal = scVal.i128(goalAmount);

      const operation = contract.call(
        "create_pocket",
        ownerAddr,
        assetAddr,
        goalVal
      );

      // Use owner as the source account (not admin)
      const account = await this.sorobanRpc.getAccount(ownerAddress);
      const transaction = new TransactionBuilder(account, {
        fee: "2000",
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(operation)
        .setTimeout(300)
        .build();

      // Simulate to finalize
      await this.sorobanRpc.simulateTransaction(transaction);

      console.log(`✅ create_pocket XDR built (ready for Crossmint signing)`);
      return transaction.toXDR();
    } catch (error) {
      console.error("Error building create_pocket XDR:", error);
      throw error;
    }
  }

  /**
   * Submit a signed create_pocket transaction and return pocket ID
   */
  async submitSignedCreatePocket(signedXdr: string): Promise<string> {
    try {
      const transaction = TransactionBuilder.fromXDR(
        signedXdr,
        Networks.TESTNET
      );
      const result = await this.sorobanRpc.sendTransaction(transaction);

      console.log(`✅ Pocket creation submitted: ${result.hash}`);

      // Wait for confirmation and extract pocket ID
      const confirmedTx = await this._waitForConfirmation(result.hash);
      const pocketId = confirmedTx.result?.retval?.lo?.toString() || "";

      console.log(`✅ Pocket created with ID: ${pocketId}`);
      return pocketId;
    } catch (error) {
      console.error("Error submitting create_pocket:", error);
      throw error;
    }
  }

  /**
   * Build (but do NOT sign) a deposit transaction XDR
   * The returned XDR must be signed by the user via Crossmint
   */
  async buildDepositXDR(
    pocketId: string,
    userAddress: string,
    amount: bigint
  ): Promise<string> {
    console.log(`\n💰 Building deposit XDR...`);
    console.log(`   Pocket ID: ${pocketId}`);
    console.log(`   User: ${userAddress}`);
    console.log(`   Amount: ${Number(amount) / 10000000}`);

    try {
      const contract = new Contract(this.pocketContractId);
      const pocketIdVal = scVal.i128(BigInt(pocketId));
      const userAddr = new Address(userAddress).toScVal();
      const amountVal = scVal.i128(amount);

      const operation = contract.call(
        "deposit",
        pocketIdVal,
        userAddr,
        amountVal
      );

      // Use user as the source account (not admin)
      const account = await this.sorobanRpc.getAccount(userAddress);
      const transaction = new TransactionBuilder(account, {
        fee: "2000",
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(operation)
        .setTimeout(300)
        .build();

      // Simulate to finalize
      await this.sorobanRpc.simulateTransaction(transaction);

      console.log(`✅ Deposit XDR built (ready for Crossmint signing)`);
      return transaction.toXDR();
    } catch (error) {
      console.error("Error building deposit XDR:", error);
      throw error;
    }
  }

  /**
   * Submit a signed deposit transaction
   */
  async submitSignedDeposit(signedXdr: string): Promise<string> {
    try {
      const transaction = TransactionBuilder.fromXDR(
        signedXdr,
        Networks.TESTNET
      );
      const result = await this.sorobanRpc.sendTransaction(transaction);

      console.log(`✅ Deposit submitted: ${result.hash}`);
      await this._waitForConfirmation(result.hash);
      return result.hash;
    } catch (error) {
      console.error("Error submitting deposit:", error);
      throw error;
    }
  }

  /**
   * Get pocket data from on-chain
   * Note: This is a read-only operation, doesn't require signing
   */
  async getPocket(pocketId: string): Promise<{
    pocketId: string;
    owner: string;
    asset: string;
    goalAmount: bigint;
    currentAmount: bigint;
  }> {
    console.log(`\n📖 Fetching pocket data...`);

    try {
      const contract = new Contract(this.pocketContractId);
      const pocketIdVal = scVal.i128(BigInt(pocketId));

      const operation = contract.call("get_pocket", pocketIdVal);

      // Use any public account for read-only queries (doesn't need auth)
      // Get a dummy account - read operations don't require real source account
      const dummyAccount = {
        accountId: () => this.pocketContractId,
        sequenceNumber: () => "0",
        incrementSequenceNumber: () => {},
      };

      const transaction = new TransactionBuilder(dummyAccount as any, {
        fee: "2000",
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(operation)
        .setTimeout(300)
        .build();

      const simulated: any = await this.sorobanRpc.simulateTransaction(
        transaction
      );
      const result = simulated.result?.retval;

      // Parse result based on Pocket struct format
      return {
        pocketId: pocketId,
        owner: result?.fields?.[0]?.value || "",
        asset: result?.fields?.[1]?.value || "",
        goalAmount: BigInt(result?.fields?.[2]?.value || 0),
        currentAmount: BigInt(result?.fields?.[3]?.value || 0),
      };
    } catch (error) {
      console.error("Error fetching pocket:", error);
      throw error;
    }
  }

  /**
   * Build (but do NOT sign) a withdraw transaction XDR
   * The returned XDR must be signed by the user via Crossmint
   */
  async buildWithdrawXDR(
    pocketId: string,
    toAddress: string,
    amount: bigint
  ): Promise<string> {
    console.log(`\n🏧 Building withdraw XDR...`);
    console.log(`   Pocket ID: ${pocketId}`);
    console.log(`   To: ${toAddress}`);
    console.log(`   Amount: ${Number(amount) / 10000000}`);

    try {
      const contract = new Contract(this.pocketContractId);
      const pocketIdVal = scVal.i128(BigInt(pocketId));
      const toAddr = new Address(toAddress).toScVal();
      const amountVal = scVal.i128(amount);

      const operation = contract.call(
        "withdraw",
        pocketIdVal,
        toAddr,
        amountVal
      );

      // Use recipient as the source account (not admin)
      const account = await this.sorobanRpc.getAccount(toAddress);
      const transaction = new TransactionBuilder(account, {
        fee: "2000",
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(operation)
        .setTimeout(300)
        .build();

      // Simulate to finalize
      await this.sorobanRpc.simulateTransaction(transaction);

      console.log(`✅ Withdraw XDR built (ready for Crossmint signing)`);
      return transaction.toXDR();
    } catch (error) {
      console.error("Error building withdraw XDR:", error);
      throw error;
    }
  }

  /**
   * Submit a signed withdraw transaction
   */
  async submitSignedWithdraw(signedXdr: string): Promise<string> {
    try {
      const transaction = TransactionBuilder.fromXDR(
        signedXdr,
        Networks.TESTNET
      );
      const result = await this.sorobanRpc.sendTransaction(transaction);

      console.log(`✅ Withdrawal submitted: ${result.hash}`);
      await this._waitForConfirmation(result.hash);
      return result.hash;
    } catch (error) {
      console.error("Error submitting withdraw:", error);
      throw error;
    }
  }

  /**
   * Wait for transaction confirmation
   */
  private async _waitForConfirmation(txHash: string): Promise<any> {
    let attempts = 0;
    const maxAttempts = 60;

    while (attempts < maxAttempts) {
      try {
        const response = await this.sorobanRpc.getTransaction(txHash);
        if (response.status !== "NOT_FOUND") {
          return response;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
        attempts++;
      } catch (error) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        attempts++;
      }
    }

    throw new Error(`Confirmation timeout: ${txHash}`);
  }
}

export const pocketService = new PocketService();