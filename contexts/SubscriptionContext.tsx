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
  // Test mode functions for App Store review
  expireTrialForTesting: () => Promise<void>;
  resetTrialForTesting: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [products, setProducts] = useState<SubscriptionProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshSubscriptionStatus = async () => {
    // Don't set loading to true immediately to prevent UI blocking
    setError(null);
    try {
      // Initialize with enhanced timeout to prevent hanging
      // Use a shorter timeout and catch errors gracefully
      try {
        const initPromise = subscriptionService.initialize();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Subscription initialization timeout')), 5000)
        );
        
        await Promise.race([initPromise, timeoutPromise]);
      } catch (initError) {
        console.error('Subscription initialization error (non-fatal):', initError);
        // Continue with default status - don't throw
      }
      
      try {
        const status = await subscriptionService.getSubscriptionStatus();
        if (status) {
          setSubscriptionStatus(status);
          setIsPremium(Boolean(status?.isActive));
        }
      } catch (statusError) {
        console.error('Failed to get subscription status (non-fatal):', statusError);
        // Keep existing status - don't update
      }
      
      // Load products with enhanced error handling - non-blocking
      try {
        const loadedProducts = await subscriptionService.getProducts();
        if (Array.isArray(loadedProducts) && loadedProducts.length > 0) {
          setProducts(loadedProducts);
        } else {
          // Set default products if invalid response
          const defaultProducts = [
            {
              productId: 'com.grsdev.canieat.subscription.monthly',
              price: '$4.99',
              currency: 'USD',
              title: 'CanIEat Premium Monthly',
              description: 'Monthly subscription to CanIEat Premium',
              type: 'subscription' as const,
            },
            {
              productId: 'com.grsdev.canieat.subscription.annual',
              price: '$49.99',
              currency: 'USD',
              title: 'CanIEat Premium Annual',
              description: 'Annual subscription to CanIEat Premium',
              type: 'subscription' as const,
            },
          ];
          setProducts(defaultProducts);
        }
      } catch (productError) {
        console.error('Failed to load products (non-fatal):', productError);
        // Set default products with enhanced safety
        const defaultProducts = [
          {
            productId: 'com.grsdev.canieat.subscription.monthly',
            price: '$4.99',
            currency: 'USD',
            title: 'CanIEat Premium Monthly',
            description: 'Monthly subscription to CanIEat Premium',
            type: 'subscription' as const,
          },
          {
            productId: 'com.grsdev.canieat.subscription.annual',
            price: '$49.99',
            currency: 'USD',
            title: 'CanIEat Premium Annual',
            description: 'Annual subscription to CanIEat Premium',
            type: 'subscription' as const,
          },
        ];
        setProducts(defaultProducts);
      }
    } catch (err) {
      console.error('Failed to refresh subscription status (non-fatal):', err);
      setError('Failed to load subscription information.');
      // Don't update status on error - keep existing state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Set default trial status immediately to prevent blocking
    const defaultStatus = {
      isActive: false,
      productId: null,
      expirationDate: null,
      isTrial: true,
      trialEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
    setSubscriptionStatus(defaultStatus);
    setIsPremium(false);
    setLoading(false);

    // Delay subscription initialization to prevent launch crashes
    // Initialize after a short delay to ensure app is fully mounted
    const initTimeout = setTimeout(() => {
      const safeInitialize = async () => {
        try {
          await refreshSubscriptionStatus();
        } catch (error) {
          console.error('Safe initialization failed:', error);
          // Keep default trial status on failure - don't update state
        }
      };
      
      // Run initialization in background without blocking
      safeInitialize().catch((err) => {
        console.error('Background initialization error:', err);
      });
    }, 500); // Delay by 500ms to ensure app is mounted
    
    return () => {
      clearTimeout(initTimeout);
      try {
        subscriptionService.disconnect();
      } catch (error) {
        console.error('Error disconnecting subscription service:', error);
      }
    };
  }, []);

  const purchaseSubscription = async (productId: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Validate productId before attempting purchase
      if (!productId || typeof productId !== 'string') {
        console.error('Invalid productId:', productId);
        setError('Invalid product selection. Please try again.');
        return false;
      }

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

  // Test mode functions for App Store review
  const expireTrialForTesting = async (): Promise<void> => {
    await subscriptionService.expireTrialForTesting();
    await refreshSubscriptionStatus();
  };

  const resetTrialForTesting = async (): Promise<void> => {
    await subscriptionService.resetTrialForTesting();
    await refreshSubscriptionStatus();
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
        expireTrialForTesting,
        resetTrialForTesting,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    // Return default values instead of throwing to prevent crashes
    console.warn('useSubscription called outside SubscriptionProvider, using defaults');
    return {
      isPremium: false,
      subscriptionStatus: {
        isActive: false,
        productId: null,
        expirationDate: null,
        isTrial: true,
        trialEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        isTrialExpired: false,
      },
      products: [],
      loading: false,
      error: null,
      purchaseSubscription: async () => false,
      restorePurchases: async () => false,
      refreshSubscriptionStatus: async () => {},
      expireTrialForTesting: async () => {},
      resetTrialForTesting: async () => {},
    };
  }
  return context;
};
