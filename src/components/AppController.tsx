import React, { useState } from 'react';
import { MainLayout, MenuItem } from './MainLayout';
import { Money } from './Money';
import { Product } from './Product';

export function AppController() {
  const [activeView, setActiveView] = useState<MenuItem>('money');

  const content = (() => {
    switch (activeView) {
      case 'money':
        return <Money />;
      case 'product':
        return <Product />;
      case 'buy':
        // This case will never be reached since the click is handled in MainLayout
        return <Money />;
      case 'farm':
        // This case will never be reached since the click is disabled in MainLayout
        return <Money />;
      default:
        return <Money />;
    }
  })();

  return (
    <MainLayout 
      onMenuItemClick={setActiveView} 
      activeMenuItem={activeView}
    >
      {content}
    </MainLayout>
  );
} 