import React, { type ReactNode, useEffect, useState } from 'react';
import { providers } from 'near-api-js';
import { setupWalletSelector } from '@near-wallet-selector/core';
import { setupModal } from '@near-wallet-selector/modal-ui';
import { setupMeteorWallet } from '@near-wallet-selector/meteor-wallet';
import type { JsonRpcProvider } from 'near-api-js/lib/providers';
import { NetworkId } from '@/config';

// Add Meteor and other wallet selector
import '@near-wallet-selector/modal-ui/styles.css';

// We'll just use setupMeteorWallet for now and remove MyNearWallet until it's properly installed
// type MyNearWallet = typeof import('@near-wallet-selector/my-near-wallet');
// declare global {
//   const setupMyNearWallet: () => any;
// }

interface WalletContextType {
  selector: any;
  modal: any;
  accounts: Array<any>;
  accountId: string | null;
  isConnected: boolean;
  isLoading: boolean;
  error: Error | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  executeTransaction: (transaction: {
    contractId: string;
    methodName: string;
    args: any;
    gas?: string;
    deposit?: string;
  }) => Promise<any>;
  executeTransactions: (transactions: {
    contractId: string;
    methodName: string;
    args: any;
    gas?: string;
    deposit?: string;
  }[]) => Promise<any>;
  viewFunction: (params: {
    contractId: string;
    methodName: string;
    args?: any;
  }) => Promise<any>;
  checkRefDeposit: (params: {
    accountId: string;
    tokenId: string;
  }) => Promise<any>;
}

const defaultContextValue: WalletContextType = {
  selector: null,
  modal: null,
  accounts: [],
  accountId: null,
  isConnected: false,
  isLoading: true,
  error: null,
  connect: async () => {},
  disconnect: async () => {},
  executeTransaction: async () => {},
  executeTransactions: async () => {},
  viewFunction: async () => {},
  checkRefDeposit: async () => {}
};

const WalletContext = React.createContext<WalletContextType>(defaultContextValue);

interface Props {
  children: ReactNode;
}

function NearWalletProviderComponent({ children }: Props): React.ReactElement {
  const [selector, setSelector] = useState<any>(null);
  const [modal, setModal] = useState<any>(null);
  const [accounts, setAccounts] = useState<Array<any>>([]);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initNear = async () => {
      try {
        console.log('Initializing NEAR wallet with network:', NetworkId);
        
        // Initialize wallet selector
        const selector = await setupWalletSelector({
          network: NetworkId,
          modules: [
            setupMeteorWallet(),
            // setupMyNearWallet(), // Commented out until installed properly
            // Add other wallets if needed
          ],
        });

        const modal = setupModal(selector, {
          contractId: 'v2.ref-finance.near',
        });

        const state = selector.store.getState();
        console.log('Initial wallet state:', state);
        
        const accounts = state.accounts;

        // Set account if the user is already signed in
        if (accounts.length > 0) {
          console.log('Found existing accounts:', accounts);
          setAccounts(accounts);
          setAccountId(accounts[0].accountId);
        } else {
          console.log('No existing accounts found');
        }

        // Add subscription to wallet changes
        selector.store.observable.subscribe((newState: any) => {
          console.log('Wallet state changed:', newState);
          if (newState.accounts.length > 0) {
            setAccounts(newState.accounts);
            setAccountId(newState.accounts[0].accountId);
          }
        });

        setSelector(selector);
        setModal(modal);
        setIsLoading(false);
      } catch (err: any) {
        console.error('Failed to initialize NEAR connection:', err);
        setError(err);
        setIsLoading(false);
      }
    };

    initNear();
  }, []);

  const connect = async () => {
    if (!modal) return;
    
    try {
      console.log('Opening wallet selector modal');
      modal.show();
      
      // We'll set up a subscription for account changes
      const subscription = selector.store.observable.subscribe((state: any) => {
        console.log('Wallet state updated during connect:', state);
        if (state.accounts.length > 0) {
          setAccounts(state.accounts);
          setAccountId(state.accounts[0].accountId);
        }
      });
      
      // Store the subscription in a ref or state if you want to unsubscribe later
      // For now, we'll just return void to match the interface
    } catch (err: any) {
      console.error('Failed to connect wallet:', err);
      setError(err);
    }
  };

  const disconnect = async () => {
    if (!selector) return;
    
    try {
      const wallet = await selector.wallet();
      await wallet.signOut();
      setAccounts([]);
      setAccountId(null);
    } catch (err: any) {
      console.error('Failed to disconnect wallet:', err);
      setError(err);
    }
  };

  const executeTransaction = async (transaction: {
    contractId: string;
    methodName: string;
    args: any;
    gas?: string;
    deposit?: string;
  }) => {
    if (!selector || !accountId) throw new Error('No wallet connected');

    try {
      const wallet = await selector.wallet();
      
      // Convert gas and deposit to string
      const gas = transaction.gas || "30000000000000";
      const deposit = transaction.deposit || "0";

      // Execute the transaction with explicit RPC endpoint and manual signing
      const result = await wallet.signAndSendTransaction({
        receiverId: transaction.contractId,
        actions: [
          {
            type: 'FunctionCall',
            params: {
              methodName: transaction.methodName,
              args: transaction.args,
              gas,
              deposit,
            },
          }
        ],
      });

      return result;
    } catch (error: any) {
      console.error('Transaction execution error:', error);
      throw error;
    }
  };

  const executeTransactions = async (transactions: {
    contractId: string;
    methodName: string;
    args: any;
    gas?: string;
    deposit?: string;
  }[]) => {
    if (!selector || !accountId) throw new Error('No wallet connected');

    try {
      const wallet = await selector.wallet();
      
      // Format transactions for wallet selector
      const formattedTransactions = transactions.map(tx => ({
        receiverId: tx.contractId,
        actions: [
          {
            type: 'FunctionCall',
            params: {
              methodName: tx.methodName,
              args: tx.args,
              gas: tx.gas || "30000000000000",
              deposit: tx.deposit || "0",
            },
          }
        ],
      }));

      // Sign and send transactions with manual confirmation
      const result = await wallet.signAndSendTransactions({
        transactions: formattedTransactions
      });
      
      return result;
    } catch (error: any) {
      console.error('Transactions execution error:', error);
      throw error;
    }
  };

  const viewFunction = async (params: {
    contractId: string;
    methodName: string;
    args?: any;
  }) => {
    try {
      // Create a provider directly
      const provider = new providers.JsonRpcProvider({
        url: 'https://free.rpc.fastnear.com'
      }) as any; // Cast to any to bypass TypeScript error
      
      const rawResult = await provider.query({
        request_type: 'call_function',
        account_id: params.contractId,
        method_name: params.methodName,
        args_base64: Buffer.from(JSON.stringify(params.args || {})).toString('base64'),
        finality: 'final'
      });

      // Parse the result
      return JSON.parse(Buffer.from(rawResult.result).toString());
    } catch (error: any) {
      console.error('View function error:', error);
      throw error;
    }
  };

  const checkRefDeposit = async (params: {
    accountId: string;
    tokenId: string;
  }) => {
    try {
      // Create a provider directly
      const provider = new providers.JsonRpcProvider({
        url: 'https://free.rpc.fastnear.com'
      }) as any; // Cast to any to bypass TypeScript error
      
      const rawResult = await provider.query({
        request_type: 'call_function',
        account_id: 'v2.ref-finance.near',
        method_name: 'get_deposit',
        args_base64: Buffer.from(JSON.stringify({
          account_id: params.accountId,
          token_id: params.tokenId
        })).toString('base64'),
        finality: 'final'
      });

      // Parse the result
      return JSON.parse(Buffer.from(rawResult.result).toString());
    } catch (error: any) {
      console.error('Ref deposit check error:', error);
      throw error;
    }
  };

  const contextValue = {
    selector,
    modal,
    accounts,
    accountId,
    isConnected: !!accountId,
    isLoading,
    error,
    connect,
    disconnect,
    executeTransaction,
    executeTransactions,
    viewFunction,
    checkRefDeposit
  };

  return React.createElement(WalletContext.Provider, { value: contextValue }, children);
}

export const NearWalletProvider = React.memo(NearWalletProviderComponent);

export function useNearWallet(): WalletContextType {
  const context = React.useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useNearWallet must be used within a NearWalletProvider");
  }
  return context;
} 