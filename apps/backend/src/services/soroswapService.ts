// src/services/soroswapService.ts
import {
  SoroswapSDK,
  SupportedNetworks,
  TradeType,
  SupportedProtocols,
} from '@soroswap/sdk';
import { TransactionBuilder, Networks, rpc } from '@stellar/stellar-sdk';
import { ENV } from '../config/env';

/**
 * Service for Soroswap integration
 * Handles quote → build → sign (with Crossmint) → send
 */
export class SoroswapService {
  private sdk: SoroswapSDK;
  private sorobanRpc: rpc.Server;

  constructor() {
    this.sdk = new SoroswapSDK({
      apiKey: ENV.SOROSWAP_API_KEY,
      baseUrl: ENV.SOROSWAP_API_URL,
      defaultNetwork: SupportedNetworks.TESTNET,
      timeout: 30000,
    });

    this.sorobanRpc = new rpc.Server(ENV.SOROBAN_RPC_URL);
  }

  /**
   * Get a quote from Soroswap for a swap
   */
  async getQuote(
    assetInId: string,
    assetOutId: string,
    amountIn: bigint,
    slippageBps: number = ENV.DEFAULT_SLIPPAGE_BPS
  ) {
    console.log(`\n📊 Getting Soroswap quote...`);
    console.log(`   Asset In: ${assetInId}`);
    console.log(`   Asset Out: ${assetOutId}`);
    console.log(`   Amount: ${Number(amountIn) / 10000000}`);

    const quoteResponse = await this.sdk.quote(
      {
        assetIn: assetInId,
        assetOut: assetOutId,
        amount: amountIn,
        tradeType: TradeType.EXACT_IN,
        protocols: [SupportedProtocols.SOROSWAP],
        slippageBps: slippageBps,
      },
      SupportedNetworks.TESTNET
    );

    console.log(`✅ Quote received:`);
    console.log(`   Input: ${Number(quoteResponse.amountIn) / 10000000}`);
    console.log(`   Output: ${Number(quoteResponse.amountOut) / 10000000}`);
    console.log(`   Price Impact: ${quoteResponse.priceImpactPct}%`);

    return quoteResponse;
  }

  /**
   * Build a transaction from a quote
   * Returns XDR that needs to be signed
   */
  async buildSwapTransaction(quote: any, userAddress: string) {
    console.log(`\n🏗️  Building swap transaction...`);

    const buildResponse = await this.sdk.build(
      {
        quote: quote,
        from: userAddress,
      },
      SupportedNetworks.TESTNET
    );

    console.log(`📄 Transaction XDR received`);
    return buildResponse.xdr;
  }

  /**
   * Send a signed swap transaction (called after Crossmint signing)
   * Returns the confirmed transaction and the output amount
   */
  async sendSignedSwap(
    signedXdr: string,
    expectedAmountOut: bigint
  ): Promise<{
    transactionHash: string;
    amountOut: bigint;
  }> {
    console.log(`\n📤 Submitting signed swap transaction...`);

    const swapResult = await this.sdk.send(
      signedXdr,
      false,
      SupportedNetworks.TESTNET
    );

    // Extract the actual output amount from the result
    // The structure depends on Soroswap SDK implementation
    const amountOut = BigInt(
      swapResult.returnValue?._value?.[1]?._value?._attributes?.lo?._value || 0
    );

    console.log(`✅ Swap confirmed!`);
    console.log(`   Transaction: ${swapResult.hash}`);
    console.log(`   Amount Out: ${Number(amountOut) / 10000000}`);

    return {
      transactionHash: swapResult.hash,
      amountOut: amountOut,
    };
  }

  /**
   * Wait for a transaction to be confirmed on Soroban
   */
  async waitForConfirmation(txHash: string): Promise<any> {
    let attempts = 0;
    const maxAttempts = 60; // 60 seconds max

    while (attempts < maxAttempts) {
      try {
        const response = await this.sorobanRpc.getTransaction(txHash);

        if (response.status !== 'NOT_FOUND') {
          console.log(`✅ Transaction confirmed: ${txHash}`);
          return response;
        }

        console.log(`⏳ Waiting for confirmation... (${attempts}s)`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
      } catch (error) {
        console.error('Error checking transaction:', error);
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
      }
    }

    throw new Error(`Transaction confirmation timeout: ${txHash}`);
  }
}

export const soroswapService = new SoroswapService();