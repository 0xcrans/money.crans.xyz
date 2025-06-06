import React from 'react';
import { Money } from './Money';

export function AppController() {
  return (
    <div style={{ 
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#181825',
      color: '#cdd6f4',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <Money />
    </div>
  );
} 
