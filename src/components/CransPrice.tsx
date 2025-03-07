import React, { useState, useEffect } from 'react';
import { POOLS, TOKENS, TOKEN_DECIMALS } from '../utils/trading-routes';
import { JsonRpcProvider } from 'near-api-js/lib/providers';
import { Big } from 'big.js';

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
            } else {
              const tokenForOneNear = await getReturn({
                pool_id: tokenNearPool,
                token_in: TOKENS.NEAR,
                token_out: intermediateToken,
                amount_in: '1000000000000000000000000' // 1 NEAR
              });

              if (tokenForOneNear) {
                const cransForOneToken = await getReturn({
                  pool_id: pool,
                  token_in: intermediateToken,
                  token_out: TOKENS.CRANS,
                  amount_in: tokenForOneNear
                });

                if (cransForOneToken) {
                  const tokenDecimals = TOKEN_DECIMALS[intermediateToken];
                  const cransDecimals = TOKEN_DECIMALS[TOKENS.CRANS];
                  
                  const cransPerToken = new Big(cransForOneToken).div(new Big(10).pow(cransDecimals));
                  const cransPriceInUSD = nearPrice.div(cransPerToken);
                  
                  return {
                    pair: name,
                    price: cransPriceInUSD.toFixed(6)
                  };
                }
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
    return <div style={{ textAlign: 'center', padding: '20px', color: '#a9b1d6' }}>Loading prices...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: '20px', color: '#f7768e' }}>Error: {error}</div>;
  }

  return (
    <div style={{
      backgroundColor: '#1a1b26',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      <h3 style={{
        color: '#7aa2f7',
        marginBottom: '15px',
        fontSize: '16px',
        textAlign: 'center'
      }}>
        CRANS Price Across Pairs
      </h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '10px',
        justifyContent: 'center'
      }}>
        {prices.map((price, index) => (
          <div key={index} style={{
            backgroundColor: '#24283b',
            padding: '12px',
            borderRadius: '6px',
            textAlign: 'center'
          }}>
            <div style={{ color: '#c0caf5', marginBottom: '4px', fontSize: '14px' }}>
              {price.pair}
            </div>
            <div style={{ color: '#7ee787', fontSize: '16px', fontWeight: 'bold' }}>
              ${price.price}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
