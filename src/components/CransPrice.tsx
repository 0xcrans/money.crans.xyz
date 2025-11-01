import React, { useState, useEffect } from 'react';
import { POOLS, TOKENS, TOKEN_DECIMALS } from '../utils/trading-routes';
import { JsonRpcProvider } from 'near-api-js/lib/providers';
import { Big } from 'big.js';
import styles from '../styles/Money.module.css';

const getReturn = async (args: {
  pool_id: number;
  token_in: string;
  token_out: string;
  amount_in: string;
}): Promise<string | null> => {
  try {
    const provider = new JsonRpcProvider({ url: 'https://free.rpc.fastnear.com' });
    const args_base64 = Buffer.from(JSON.stringify(args)).toString('base64');
    
    const response: any = await provider.query({
      request_type: 'call_function',
      account_id: 'v2.ref-finance.near',
      method_name: 'get_return',
      args_base64,
      finality: 'final'
    });
    
    if (response && response.result) {
      const resultBytes = Buffer.from(response.result);
      const resultText = new TextDecoder().decode(resultBytes);
      return JSON.parse(resultText);
    }
    
    return null;
  } catch (error) {
    console.error('Error in getReturn:', error);
    return null;
  }
};

// Get NEAR price in USDC
const getNearPriceInUSDC = async (): Promise<Big> => {
  try {
    const USDC = '17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1';
    const NEAR_USDC_POOL = 4512;
    
    const provider = new JsonRpcProvider({ url: 'https://free.rpc.fastnear.com' });
    const args = {
      pool_id: NEAR_USDC_POOL,
      token_in: TOKENS.NEAR,
      token_out: USDC,
      amount_in: '1000000000000000000000000' // 1 NEAR (24 decimals)
    };
    const args_base64 = Buffer.from(JSON.stringify(args)).toString('base64');
    
    const response: any = await provider.query({
      request_type: 'call_function',
      account_id: 'v2.ref-finance.near',
      method_name: 'get_return',
      args_base64,
      finality: 'final'
    });
    
    if (response && response.result) {
      const resultBytes = Buffer.from(response.result);
      const resultText = new TextDecoder().decode(resultBytes);
      const usdcAmount = JSON.parse(resultText);
      
      return new Big(usdcAmount).div(new Big(10).pow(6));
    }
    
    return new Big(0);
  } catch (error) {
    console.error('Error getting NEAR price:', error);
    return new Big(0);
  }
};

// Get pool data including token reserves
const getPoolData = async (poolId: number): Promise<any> => {
  try {
    const provider = new JsonRpcProvider({ url: 'https://free.rpc.fastnear.com' });
    const args_base64 = Buffer.from(JSON.stringify({ pool_id: poolId })).toString('base64');
    
    const response: any = await provider.query({
      request_type: 'call_function',
      account_id: 'v2.ref-finance.near',
      method_name: 'get_pool',
      args_base64,
      finality: 'final'
    });
    
    if (response && response.result) {
      const resultBytes = Buffer.from(response.result);
      const resultText = new TextDecoder().decode(resultBytes);
      return JSON.parse(resultText);
    }
    
    return null;
  } catch (error) {
    console.error('Error in getPoolData:', error);
    return null;
  }
};

interface PriceData {
  pair: string;
  price: string;
}

// Get token price in NEAR
const getTokenPriceInNear = async (poolId: number, tokenId: string, amount: string): Promise<Big | null> => {
  try {
    const tokenForOneNear = await getReturn({
      pool_id: poolId,
      token_in: TOKENS.NEAR,
      token_out: tokenId,
      amount_in: amount
    });

    if (tokenForOneNear) {
      const tokenDecimals = TOKEN_DECIMALS[tokenId] || 24;
      const tokenPerNear = new Big(tokenForOneNear).div(new Big(10).pow(tokenDecimals));
      return tokenPerNear;
    }
    return null;
  } catch (error) {
    console.error('Error getting token price in NEAR:', error);
    return null;
  }
};

export function CransPrice() {
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const nearPrice = await getNearPriceInUSDC();
        
        const pairs = [
          { 
            name: 'CRANS/NEAR', 
            pool: POOLS.CRANS_NEAR,
            tokenNearPool: POOLS.CRANS_NEAR,
            intermediateToken: TOKENS.NEAR
          },
          { 
            name: 'CRANS/SIN', 
            pool: POOLS.CRANS_SIN,
            tokenNearPool: POOLS.SIN_NEAR,
            intermediateToken: TOKENS.SIN
          },
          { 
            name: 'CRANS/PUMPOPOLY', 
            pool: POOLS.CRANS_PUMP,
            tokenNearPool: POOLS.PUMP_NEAR,
            intermediateToken: TOKENS.PUMP
          },
          { 
            name: 'CRANS/BLACKDRAGON', 
            pool: POOLS.CRANS_BD,
            tokenNearPool: POOLS.BD_NEAR,
            intermediateToken: TOKENS.BD
          },
          { 
            name: 'CRANS/SHITZU', 
            pool: POOLS.CRANS_SHITZU,
            tokenNearPool: POOLS.SHITZU_NEAR,
            intermediateToken: TOKENS.SHITZU
          },
          { 
            name: 'CRANS/SHIT', 
            pool: POOLS.CRANS_1170,
            tokenNearPool: POOLS.SHIT_NEAR,
            intermediateToken: TOKENS.MEME1170
          }
        ];

        const pricePromises = pairs.map(async ({ name, pool, tokenNearPool, intermediateToken }) => {
          try {
            if (intermediateToken === TOKENS.NEAR) {
              const cransForOneNear = await getReturn({
                pool_id: pool,
                token_in: TOKENS.NEAR,
                token_out: TOKENS.CRANS,
                amount_in: '1000000000000000000000000' // 1 NEAR
              });

              if (cransForOneNear) {
                const cransPerNear = new Big(cransForOneNear).div(new Big(10).pow(TOKEN_DECIMALS[TOKENS.CRANS]));
                const cransPriceInUSD = nearPrice.div(cransPerNear);
                return {
                  pair: name,
                  price: cransPriceInUSD.toFixed(6)
                };
              }
            } else if (intermediateToken === TOKENS.BD) {
              try {
                // Get NEAR price in USD
                const usdcNearPool = await getPoolData(4512); // NEAR-USDC pool
                if (!usdcNearPool || !usdcNearPool.token_account_ids || usdcNearPool.token_account_ids.length < 2) {
                  return null;
                }
                
                // Get near-bd pool data
                const nearBdPool = await getPoolData(tokenNearPool);
                if (!nearBdPool || !nearBdPool.token_account_ids || nearBdPool.token_account_ids.length < 2) {
                  return null;
                }
                
                // Get crans-bd pool data
                const cransBdPool = await getPoolData(pool);
                if (!cransBdPool || !cransBdPool.token_account_ids || cransBdPool.token_account_ids.length < 2) {
                  return null;
                }
                
                // Identify token positions in each pool
                const nearBdNearIndex = nearBdPool.token_account_ids.findIndex((id: string) => id === TOKENS.NEAR);
                const nearBdBdIndex = nearBdPool.token_account_ids.findIndex((id: string) => id === TOKENS.BD);
                
                const cransBdBdIndex = cransBdPool.token_account_ids.findIndex((id: string) => id === TOKENS.BD);
                const cransBdCransIndex = cransBdPool.token_account_ids.findIndex((id: string) => id === TOKENS.CRANS);
                
                if (nearBdNearIndex === -1 || nearBdBdIndex === -1 || cransBdBdIndex === -1 || cransBdCransIndex === -1) {
                  return null;
                }
                
                // Calculate prices based on reserves
                const nearReserve = new Big(nearBdPool.amounts[nearBdNearIndex]);
                const bdReserve = new Big(nearBdPool.amounts[nearBdBdIndex]);
                const bdPerNear = bdReserve.div(nearReserve);
                
                const bdReserveInCransPool = new Big(cransBdPool.amounts[cransBdBdIndex]);
                const cransReserve = new Big(cransBdPool.amounts[cransBdCransIndex]);
                
                // Calculate CRANS per BD
                const cransPerBd = cransReserve.div(bdReserveInCransPool);
                
                // Calculate BD price in USD using NEAR price
                const bdInNear = nearReserve.div(bdReserve);
                const bdPriceInUsd = nearPrice.mul(bdInNear);
                
                // Calculate CRANS price in USD
                const cransPriceInUSD = bdPriceInUsd.div(cransPerBd);
                
                return {
                  pair: name,
                  price: cransPriceInUSD.toFixed(6)
                };
              } catch (err) {
                console.error("Error calculating CRANS/BD price using reserves:", err);
                return null;
              }
            } else {
              // For all other pairs (SIN, PUMPOPOLY, SHITZU), use pool reserves approach
              try {
                // Get token-NEAR pool data
                const tokenNearPoolData = await getPoolData(tokenNearPool);
                if (!tokenNearPoolData || !tokenNearPoolData.token_account_ids || tokenNearPoolData.token_account_ids.length < 2) {
                  return null;
                }
                
                // Get CRANS-token pool data
                const cransTokenPoolData = await getPoolData(pool);
                if (!cransTokenPoolData || !cransTokenPoolData.token_account_ids || cransTokenPoolData.token_account_ids.length < 2) {
                  return null;
                }
                
                // Identify token positions in token-NEAR pool
                const tokenNearNearIndex = tokenNearPoolData.token_account_ids.findIndex((id: string) => id === TOKENS.NEAR);
                const tokenNearTokenIndex = tokenNearPoolData.token_account_ids.findIndex((id: string) => id === intermediateToken);
                
                // Identify token positions in CRANS-token pool
                const cransTokenTokenIndex = cransTokenPoolData.token_account_ids.findIndex((id: string) => id === intermediateToken);
                const cransTokenCransIndex = cransTokenPoolData.token_account_ids.findIndex((id: string) => id === TOKENS.CRANS);
                
                if (tokenNearNearIndex === -1 || tokenNearTokenIndex === -1 || 
                    cransTokenTokenIndex === -1 || cransTokenCransIndex === -1) {
                  return null;
                }
                
                // Get reserves from token-NEAR pool
                const nearReserve = new Big(tokenNearPoolData.amounts[tokenNearNearIndex]);
                const tokenReserve = new Big(tokenNearPoolData.amounts[tokenNearTokenIndex]);
                
                // Get reserves from CRANS-token pool
                const tokenReserveInCransPool = new Big(cransTokenPoolData.amounts[cransTokenTokenIndex]);
                const cransReserve = new Big(cransTokenPoolData.amounts[cransTokenCransIndex]);
                
                // Calculate token per NEAR and CRANS per token
                const tokenPerNear = tokenReserve.div(nearReserve);
                const cransPerToken = cransReserve.div(tokenReserveInCransPool);
                
                // Calculate token price in USD
                const tokenInNear = nearReserve.div(tokenReserve);
                const tokenPriceInUsd = nearPrice.mul(tokenInNear);
                
                // Calculate CRANS price in USD
                const cransPriceInUSD = tokenPriceInUsd.div(cransPerToken);
                
                return {
                  pair: name,
                  price: cransPriceInUSD.toFixed(6)
                };
              } catch (err) {
                console.error(`Error calculating price for ${name} using reserves:`, err);
                return null;
              }
            }
            return null;
          } catch (error) {
            console.error(`Error calculating price for ${name}:`, error);
            return null;
          }
        });

        const priceResults = (await Promise.all(pricePromises)).filter(Boolean);
        setPrices(priceResults as PriceData[]);

      } catch (error: any) {
        console.error('Failed to fetch prices:', error);
        setError(error.message || 'Failed to fetch prices');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrices();
  }, []);

  if (isLoading) {
    return <div className={styles.cransPriceSection} style={{ textAlign: 'center', color: '#a9b1d6' }}>Loading prices...</div>;
  }

  if (error) {
    return <div className={styles.cransPriceSection} style={{ textAlign: 'center', color: '#f7768e' }}>Error: {error}</div>;
  }

  return (
    <div className={styles.cransPriceSection}>
      <h3 className={styles.cransPriceTitle}>
        CRANS Price Across Pairs
      </h3>
      <div className={styles.cransPriceGrid}>
        {prices.map((price, index) => (
          <div key={index} className={styles.cransPriceCard}>
            <div className={styles.cransPricePair}>
              {price.pair}
            </div>
            <div className={styles.cransPriceValue}>
              ${price.price}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
