import { useNearWallet } from '@/contexts/NearWalletContext';
import styles from '../styles/MainLayout.module.css';

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
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.sidebar}>
        <div className={styles.logo}>
          <img src="/ico.png" alt="CRANS Logo" />
          <h1>
            <a 
              href="https://crans.xyz" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.logoLink}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              crans.xyz
            </a>
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
              Product
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
          <div className={styles.socialLinks}>
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
              href="https://github.com/0xcrans" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <img src="/git.png" alt="GitHub" />
            </a>
          </div>
        </div>
      </div>
      
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
} 