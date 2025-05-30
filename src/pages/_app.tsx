import type { AppProps } from 'next/app';
import type { NextPage } from 'next';
import React from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@near-wallet-selector/modal-ui/styles.css';

const NearWalletProvider = dynamic(
  () => import('@/contexts/NearWalletContext').then(mod => mod.NearWalletProvider),
  { ssr: false }
);

type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function App({ Component, pageProps }: AppPropsWithLayout): React.ReactElement {
  return React.createElement(
    NearWalletProvider,
    null,
    React.createElement(
      'div',
      { className: 'min-h-screen bg-gray-100' },
      React.createElement(Head, null,
        React.createElement('link', { rel: 'icon', href: '/ico.png' })
      ),
      React.createElement(Component, pageProps)
    )
  );
}

export default App; 