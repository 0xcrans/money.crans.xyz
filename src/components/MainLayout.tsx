import { useNearWallet } from '@/contexts/NearWalletContext';
import styles from '../styles/MainLayout.module.css';
import { useState, useEffect } from 'react';

export type MenuItem = 'money' | 'product' | 'buy' | 'farm';

export interface MainLayoutProps {
  children?: React.ReactNode;
  onMenuItemClick?: (menuItem: MenuItem) => void;
  activeMenuItem?: MenuItem;
}

export function MainLayout({ 
  children, 
  onMenuItemClick,
  activeMenuItem = 'money'
}: MainLayoutProps) {
  const wallet = useNearWallet();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMenuItemClick = (menuItem: MenuItem) => {
    if (menuItem === 'buy') {
      window.open('https://dex.rhea.finance/#near|crans.tkn.near', '_blank');
      return;
    }
    if (menuItem === 'farm') {
      return; // Disabled - do nothing
    }
    if (onMenuItemClick) {
      onMenuItemClick(menuItem);
    }
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className={styles.mainContainer}>
      {isMobile && (
        <>
          <div className={styles.mobileHeader}>
            <button 
              className={`${styles.menuToggle} ${isSidebarOpen ? styles.active : ''}`}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </>
      )}
      
      <div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
        <div className={styles.logo}>
          <h1>
            
          </h1>
        </div>
        
        <nav className={styles.menu}>
          <ul>
            <li 
              className={`${styles.menuItem} ${activeMenuItem === 'money' ? styles.active : ''}`}
              onClick={() => handleMenuItemClick('money')}
            >
              Money
            </li>
            <li 
              className={`${styles.menuItem} ${activeMenuItem === 'product' ? styles.active : ''}`}
              onClick={() => handleMenuItemClick('product')}
            >
              Market Maker
            </li>
            <li 
              className={`${styles.menuItem} ${activeMenuItem === 'buy' ? styles.active : ''}`}
              onClick={() => handleMenuItemClick('buy')}
            >
              <div className={styles.menuItemWithIcon}>
                <img src="/icons/rhea.jpg" alt="Rhea" className={styles.menuIcon} />
                Buy $CRANS
                <svg 
                  width="12" 
                  height="12" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  style={{ marginLeft: 'auto' }}
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </div>
            </li>
            <li 
              className={`${styles.menuItem} ${styles.menuItemDisabled}`}
              onClick={() => handleMenuItemClick('farm')}
            >
              Farm
              <span className={styles.comingSoon}>Coming Soon</span>
            </li>
          </ul>
        </nav>

        <div className={styles.walletBtn}>
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '20px', 
            fontSize: '14px', 
            opacity: '0.8',
            paddingBottom: '15px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'center'
          }}>
            <a 
              href="https://crans.xyz" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.logoLink}
              style={{ display: 'inline-block', letterSpacing: '-0.5px' }}
            ><span className={styles.stockLetter} style={{ margin: 0, padding: 0 }}>c</span><span className={styles.stockLetter} style={{ margin: 0, padding: 0 }}>r</span><span className={styles.stockLetter} style={{ margin: 0, padding: 0 }}>a</span><span className={styles.stockLetter} style={{ margin: 0, padding: 0 }}>n</span><span className={styles.stockLetter} style={{ margin: 0, padding: 0 }}>s</span><span className={styles.stockLetter} style={{ margin: 0, padding: 0 }}>.</span><span className={styles.stockLetter} style={{ margin: 0, padding: 0 }}>x</span><span className={styles.stockLetter} style={{ margin: 0, padding: 0 }}>y</span><span className={styles.stockLetter} style={{ margin: 0, padding: 0 }}>z</span></a>
          </div>
          <div className={styles.socialLinks} style={{ marginBottom: '20px' }}>
            <a 
              href="https://t.me/PaulCrans" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <img src="/telegram.png" alt="Telegram" />
            </a>
            <a 
              href="https://x.com/CransPaul" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <img src="/x.png" alt="X (Twitter)" />
            </a>
            <a 
              href="https://github.com/cranspaul" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <img src="/git.png" alt="GitHub" />
            </a>
          </div>
          <div className={styles.poweredBy} style={{ 
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '15px'
          }}>
            Powered by AlterFund
          </div>
        </div>
      </div>
      
      <div className={`${styles.content} ${isSidebarOpen ? styles.shifted : ''}`}>
        {children}
      </div>

      {isSidebarOpen && isMobile && (
        <div 
          className={styles.overlay} 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
} 
