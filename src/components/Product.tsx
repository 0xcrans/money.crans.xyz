import React from 'react';
import styles from '../styles/Product.module.css';
import { CransPrice } from './CransPrice';

export function Product() {
  return (
    <div className={styles.container}>
      <div className={styles.productDescription}>
        <CransPrice />
        <h1></h1>
        
        <section className={styles.mainVision}>
          <h2>Product Overview</h2>
          <p>
            The main vision behind $CRANS is being a share token of NEAR entertainment, where profits earned directly or indirectly from projects like Survival Is Near, Pumpopoly, Shitzu, or Blackdragon are being used in liquidity management. This creates a web3 index of legitimate projects where you can earn instead of getting burned.
          </p>
          <p>
            Liquidity pairs of $CRANS are managed by a special market making strategy, tailored for the token. The strategy consists of two components - Distributing and Sourcing, both of which feed their own LPs via trading fees and look for arbitrage opportunities in stNEAR and in $CRANS.
          </p>
        </section>

        <section className={styles.distribution}>
          <h2>Distribution Mechanism</h2>
          <p>The component consists of two main elements: Distributing Pressure and Distributing Arbitrage, working in harmony to maintain optimal liquidity conditions.</p>
          
          <h3>Distribution Pressure</h3>
          <p>
            The Distribution Pressure implements a selling mechanism of CRANS tokens to NEAR tokens. This process involves:
          </p>
          <ul>
            <li>Searching for the optimal longest route between LPs paired exclusively with CRANS token</li>
            <li>Executing fixed-amount sales with proper timing</li>
            <li>Implementing a 60:30:10 distribution ratio for maximum efficiency</li>
          </ul>

          <h4>Distribution Ratio Breakdown:</h4>
          <ul>
            <li><strong>60%</strong> - Used for CRANS token buyback through optimal LP routes</li>
            <li><strong>30%</strong> - Allocated for stNEAR purchases</li>
            <li><strong>10%</strong> - Reserved as a buffer for enhanced buyback opportunities</li>
          </ul>

          <h3>Distributing Arbitrage</h3>
          <p>
            The Distributing Arbitrage component uses an arbitrage detection system that:
          </p>
          <ul>
            <li>Monitors arbitrage opportunities to stNEAR starting with CRANS token</li>
            <li>Utilizes quick-route scanning across multiple LP pairs</li>
            <li>Implements validation using CRANS{'>'}NEAR{'>'}stNEAR base value analysis</li>
            <li>Maintains profitability thresholds for optimal execution</li>
          </ul>
        </section>

        <section className={styles.sourcing}>
          <h2>Sourcing Mechanism</h2>
          <p>
            The Sourcing component works as a complementary system to Distribution, featuring its own Pressure and Arbitrage mechanisms with simplified complexity.
          </p>

          <h3>Sourcing Pressure</h3>
          <p>
            This mechanism focuses on CRANS token acquisition through:
          </p>
          <ul>
            <li>Regular NEAR token sales via optimized routes</li>
            <li>Focus on CRANS-paired LPs for maximum efficiency</li>
            <li>Automated token transfer to Distribution component</li>
            <li>Real-time route optimization for best execution</li>
          </ul>

          <h3>Sourcing Arbitrage</h3>
          <p>
            The arbitrage component uses a system that:
          </p>
          <ul>
            <li>Uses NEAR{'>'}CRANS as the base value metric</li>
            <li>Works with fixed NEAR amounts for consistent execution</li>
            <li>Monitors profitable threshold opportunities</li>
            <li>Maintains market surveillance</li>
          </ul>
        </section>

        <section className={styles.efficiency}>
          <h2>Operational Efficiency</h2>
          <p>
            The system achieves maximum efficiency through:
          </p>
          <ul>
            <li>Synchronized operation of Pressure and Arbitrage components</li>
            <li>Intelligent cooldown management between operations</li>
            <li>Automated switching between components based on market conditions</li>
            <li>Resource optimization until depletion of CRANS or NEAR tokens</li>
          </ul>
        </section>

        <section className={styles.benefits}>
          <h2>Benefits</h2>
          <div className={styles.benefitsGrid}>
            <div className={styles.benefitCard}>
              <h3>Enhanced Liquidity</h3>
              <p>Increased depth across all trading pairs</p>
                  </div>
            <div className={styles.benefitCard}>
              <h3>Price Stability</h3>
              <p>Reduced spread between different LP pairs</p>
                  </div>
            <div className={styles.benefitCard}>
              <h3>Market Efficiency</h3>
              <p>Optimized arbitrage opportunities</p>
                </div>
            <div className={styles.benefitCard}>
              <h3>Price Discovery</h3>
              <p>Enhanced market price accuracy</p>
                  </div>
            <div className={styles.benefitCard}>
              <h3>Security</h3>
              <p>Protection against jeeters</p>
                </div>
          </div>
        </section>

        <section className={styles.technicalDetails}>
          <h2>Technical Implementation</h2>
          <div className={styles.accountsInfo}>
            <div className={styles.accountCard}>
              <h3>Distribution Account</h3>
              <p className={styles.accountAddress}>crans-near.near</p>
              <a 
                href="https://pikespeak.ai/wallet-explorer/crans-near.near/global" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.accountLink}
              >
                View on Pikespeak
              </a>
            </div>
            <div className={styles.accountCard}>
              <h3>Sourcing Account</h3>
              <p className={styles.accountAddress}>stnear-crans.near</p>
              <a 
                href="https://pikespeak.ai/wallet-explorer/stnear-crans.near/global" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.accountLink}
              >
                View on Pikespeak
              </a>
            </div>
            </div>
            
          <div className={styles.reportsInfo}>
            <h3>Performance Reports</h3>
            <p>
              Reports and statistics for both accounts are published on SocialBlocks when the tool completes its operations.
            </p>
            <a 
              href="https://socialblocks.crans.xyz/" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.accountLink}
            >
              SocialBlocks
            </a>
          </div>
        </section>
      </div>
    </div>
  );
} 