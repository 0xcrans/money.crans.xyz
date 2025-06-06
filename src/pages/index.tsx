import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { useNearWallet } from '@/contexts/NearWalletContext';
import { AppController } from '@/components/AppController';

const HomePage: NextPage = () => {
  const wallet = useNearWallet();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Add global styles to ensure dark theme is consistent
  useEffect(() => {
    // Apply dark theme to entire document
    document.documentElement.style.backgroundColor = '#181825';
    document.body.style.backgroundColor = '#181825';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.color = '#cdd6f4';
    document.body.style.overflow = 'auto'; // Allow scrolling for single page
    document.body.style.width = '100vw'; // Ensure full viewport width
    document.body.style.minHeight = '100vh'; // Change to minHeight to allow content expansion
    
    // Apply styles to all potential container elements
    const styleFullWidth = `
      html, body, #__next, .container {
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        overflow-x: hidden !important;
        background-color: #181825 !important;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    
    // Create and append a style element
    const styleElement = document.createElement('style');
    styleElement.innerHTML = styleFullWidth;
    document.head.appendChild(styleElement);
    
    return () => {
      // Cleanup function to reset styles if component unmounts
      document.documentElement.style.backgroundColor = '';
      document.body.style.backgroundColor = '';
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.color = '';
      document.body.style.overflow = '';
      document.body.style.width = '';
      document.body.style.minHeight = '';
      
      // Remove the appended style element
      document.head.removeChild(styleElement);
    };
  }, []);
  
  useEffect(() => {
    // Short delay to ensure wallet state is properly initialized
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (!isInitialized) {
    return (
      <div style={{ 
        backgroundColor: '#181825',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #cdd6f4',
          borderTop: '4px solid #181825',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p>Cash rules everything around me...</p>
      </div>
    );
  }

  if (wallet.error) {
    return (
      <div style={{ 
        backgroundColor: '#181825',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <p style={{
          color: '#f38ba8',
          fontSize: '16px',
          textAlign: 'center'
        }}>
          Failed to initialize: {wallet.error.message}
        </p>
      </div>
    );
  }

  return (
    <div style={{ 
      backgroundColor: '#181825',
      minHeight: '100vh',
      width: '100vw',
      margin: 0,
      padding: 0,
      color: '#cdd6f4',
      border: 'none',
      boxSizing: 'border-box'
    }}>
      <AppController />
    </div>
  );
};

export default HomePage; 
