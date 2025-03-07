import React from 'react';
import styles from '../styles/Product.module.css';
import { CransPrice } from './CransPrice';

export function Product() {
  return (
    <div className={styles.container}>
      <div className={styles.productDescription}>
        <CransPrice />
        
        <section className={styles.mainVision}>
          <h2>Market Making Strategy</h2>
          <p>
            The main vision behind $CRANS is being a share token of NEAR entertainment, where profits earned directly or indirectly from projects like Survival Is Near, Pumpopoly, Shitzu, or Blackdragon are being used in liquidity management. This creates a web3 index of legitimate projects where you can earn instead of getting burned.
          </p>
          <p>
            Liquidity pairs of $CRANS are managed by a special market making strategy, tailored for the token. The strategy consists of two components - Distributing and Sourcing, both of which feed their own LPs via trading fees and look for arbitrage opportunities in stNEAR and in $CRANS.
          </p>
        </section>

        <section className={styles.distribution}>
          <h2>Distribution Mechanism</h2>
          <div className={styles.benefitsGrid}>
            <div className={styles.benefitCard}>
              <h3>Distribution Pressure</h3>
              <p>Implements selling mechanism of CRANS tokens to NEAR tokens through:</p>
              <ul>
                <li>Optimal longest route search between CRANS LPs</li>
                <li>Fixed-amount sales with proper timing</li>
                <li>60:30:10 distribution ratio implementation</li>
              </ul>
            </div>
            <div className={styles.benefitCard}>
              <h3>Distribution Ratio</h3>
              <ul>
                <li><strong>60%</strong> - CRANS token buyback</li>
                <li><strong>30%</strong> - stNEAR purchases</li>
                <li><strong>10%</strong> - Buyback opportunities buffer</li>
              </ul>
            </div>
            <div className={styles.benefitCard}>
              <h3>Distributing Arbitrage</h3>
              <ul>
                <li>Monitors arbitrage to stNEAR from CRANS</li>
                <li>Quick-route scanning across LP pairs</li>
                <li>CRANS{'>'}NEAR{'>'}stNEAR value analysis</li>
                <li>Profitability threshold maintenance</li>
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.sourcing}>
          <h2>Sourcing Mechanism</h2>
          <div className={styles.benefitsGrid}>
            <div className={styles.benefitCard}>
              <h3>Sourcing Pressure</h3>
              <ul>
                <li>Regular NEAR token sales via optimal routes</li>
                <li>Focus on CRANS-paired LPs</li>
                <li>Automated token transfer to Distribution</li>
                <li>Real-time route optimization</li>
              </ul>
            </div>
            <div className={styles.benefitCard}>
              <h3>Sourcing Arbitrage</h3>
              <ul>
                <li>NEAR{'>'}CRANS base value metrics</li>
                <li>Fixed NEAR amounts execution</li>
                <li>Profitable threshold monitoring</li>
                <li>Continuous market surveillance</li>
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.efficiency}>
          <h2>Operational Efficiency</h2>
          <div className={styles.benefitsGrid}>
            <div className={styles.benefitCard}>
              <h3>Benefits</h3>
              <ul>
                <li>Enhanced liquidity across pairs</li>
                <li>Reduced spread between LPs</li>
                <li>Optimized arbitrage opportunities</li>
                <li>Protection against market manipulation</li>
              </ul>
            </div>
            <div className={styles.benefitCard}>
              <h3>Operation Management</h3>
              <ul>
                <li>Synchronized component operation</li>
                <li>Intelligent cooldown management</li>
                <li>Automated component switching</li>
                <li>Resource optimization</li>
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.technicalDetails}>
          <h2>Mainnet Implementation</h2>
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
              View Reports on SocialBlocks
            </a>
          </div>
        </section>
      </div>
    </div>
  );
} 
