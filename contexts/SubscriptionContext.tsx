import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { subscriptionService, SubscriptionStatus, SubscriptionProduct } from '../services/subscriptionService';

interface SubscriptionContextType {
  subscriptionStatus: SubscriptionStatus;
  products: SubscriptionProduct[];
  isLoading: boolean;
  isPremium: boolean;
  isTrial: boolean;
  trialDaysRemaining: number;
  purchaseSubscription: (productId: string) => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
  refreshSubscriptionStatus: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({
    isActive: false,
    productId: null,
    expirationDate: null,
    isTrial: false,
    trialEndDate: null,
  });
  const [products, setProducts] = useState<SubscriptionProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSubscriptionStatus = async () => {
    try {
      const status = await subscriptionService.getSubscriptionStatus();
      setSubscriptionStatus(status);
    } catch (error) {
      console.error('Error refreshing subscription status:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const availableProducts = await subscriptionService.getProducts();
      setProducts(availableProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const purchaseSubscription = async (productId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const success = await subscriptionService.purchaseSubscription(productId);
      if (success) {
        await refreshSubscriptionStatus();
      }
      return success;
    } catch (error) {
      console.error('Error purchasing subscription:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const restorePurchases = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const success = await subscriptionService.restorePurchases();
      if (success) {
        await refreshSubscriptionStatus();
      }
      return success;
    } catch (error) {
      console.error('Error restoring purchases:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initializeSubscription = async () => {
      try {
        setIsLoading(true);
        await subscriptionService.initialize();
        await loadProducts();
        await refreshSubscriptionStatus();
      } catch (error) {
        console.error('Error initializing subscription:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeSubscription();

    // Cleanup on unmount
    return () => {
      subscriptionService.disconnect();
    };
  }, []);

  const isPremium = subscriptionStatus.isActive;
  const isTrial = subscriptionStatus.isTrial;
  const trialDaysRemaining = subscriptionStatus.isTrial && subscriptionStatus.trialEndDate 
    ? Math.ceil((new Date(subscriptionStatus.trialEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const value: SubscriptionContextType = {
    subscriptionStatus,
    products,
    isLoading,
    isPremium,
    isTrial,
    trialDaysRemaining,
    purchaseSubscription,
    restorePurchases,
    refreshSubscriptionStatus,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
