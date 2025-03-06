// Core configuration
export const POOLS = {
  CRANS_SHITZU: 5954,    // CRANS/SHITZU pool
  CRANS_BD: 5612,        // CRANS/BD pool
  CRANS_NEAR: 5423,      // CRANS/NEAR pool
  SHITZU_BD: 4372,       // SHITZU/BD pool
  SHITZU_NEAR: 4369,     // SHITZU/NEAR pool
  BD_NEAR: 4276,         // BD/NEAR pool
  SIN_NEAR: 5583,        // SIN/NEAR pool
  PUMP_NEAR: 3066,       // PUMP/NEAR pool
  CRANS_SIN: 5584,       // CRANS/SIN pool
  CRANS_PUMP: 5718,      // CRANS/PUMP pool
  STNEAR_NEAR: 535       // stNEAR/NEAR pool
};

export const TOKENS = {
  CRANS: "crans.tkn.near",
  SHITZU: "token.0xshitzu.near",
  BD: "blackdragon.tkn.near", 
  NEAR: "wrap.near",
  SIN: "sin-339.meme-cooking.near",
  PUMP: "token.pumpopoly.near",
  STNEAR: "meta-pool.near"
};

export const TOKEN_DECIMALS = {
  [TOKENS.CRANS]: 24,    // CRANS has 24 decimals with 1M total supply
  [TOKENS.SHITZU]: 18,
  [TOKENS.BD]: 24,       // BD has 24 decimals with ~100B total supply
  [TOKENS.NEAR]: 24,
  [TOKENS.SIN]: 18,
  [TOKENS.PUMP]: 24,
  [TOKENS.STNEAR]: 24
};

// Constants
export const MAX_GAS = "300000000000000"; // 300 TGas
export const SAFETY_MARGIN = 0.999; // 99.9% safety margin

// Common types
export interface RouteStep {
  poolId: number;
  tokenIn: string;
  tokenOut: string;
}

export interface RouteDefinition {
  path: string;
  pools: RouteStep[];
}

export interface RouteSimulation {
  path: string;
  outputAmount: string;
  difference?: string;
  isLoading: boolean;
  error?: string;
}

// Utility functions
export async function viewFunction(methodName: string, args: any): Promise<string> {
  try {
    const response = await fetch('https://free.rpc.fastnear.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'dontcare',
        method: 'query',
        params: {
          request_type: 'call_function',
          finality: 'final',
          account_id: 'v2.ref-finance.near',
          method_name: methodName,
          args_base64: btoa(JSON.stringify(args))
        }
      })
    });

    const result = await response.json();
    if (result.error) throw new Error(result.error.message || 'RPC call failed');

    return JSON.parse(Buffer.from(result.result.result).toString());
  } catch (error) {
    console.error('View function error:', error);
    throw error;
  }
} 