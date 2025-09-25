import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { subscriptionService, SubscriptionProduct, SubscriptionStatus } from '../services/subscriptionService';

interface SubscriptionContextType {
  isPremium: boolean;
  subscriptionStatus: SubscriptionStatus | null;
  products: SubscriptionProduct[];
  loading: boolean;
  error: string | null;
  purchaseSubscription: (productId: string) => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
  refreshSubscriptionStatus: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [products, setProducts] = useState<SubscriptionProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshSubscriptionStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      await subscriptionService.initialize();
      const status = await subscriptionService.getSubscriptionStatus();
      setSubscriptionStatus(status);
      setIsPremium(status.isActive);
      const loadedProducts = await subscriptionService.getProducts();
      setProducts(loadedProducts);
    } catch (err) {
      console.error('Failed to refresh subscription status:', err);
      setError('Failed to load subscription information.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSubscriptionStatus();
    return () => {
      subscriptionService.disconnect();
    };
  }, []);

  const purchaseSubscription = async (productId: string): Promise<boolean> => {
    setLoading(true);
    try {
      const success = await subscriptionService.purchaseSubscription(productId);
      if (success) {
        await refreshSubscriptionStatus();
      }
      return success;
    } catch (err) {
      console.error('Purchase failed:', err);
      setError('Purchase failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const restorePurchases = async (): Promise<boolean> => {
    setLoading(true);
    try {
      const success = await subscriptionService.restorePurchases();
      if (success) {
        await refreshSubscriptionStatus();
      }
      return success;
    } catch (err) {
      console.error('Restore failed:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        isPremium,
        subscriptionStatus,
        products,
        loading,
        error,
        purchaseSubscription,
        restorePurchases,
        refreshSubscriptionStatus,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
