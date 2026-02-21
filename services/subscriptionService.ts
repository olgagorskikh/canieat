import { Platform } from 'react-native';

// Conditional IAP imports to prevent Expo Go crashes
let purchaseUpdatedListener: any = null;
let purchaseErrorListener: any = null;
let finishTransaction: any = null;
let getProducts: any = null;
let requestSubscription: any = null;
let getAvailablePurchases: any = null;
let initConnection: any = null;
let endConnection: any = null;

// Safely import IAP modules with enhanced error handling
try {
  if (Platform.OS !== 'web') {
    const iapModule = require('react-native-iap');
    // Safely assign each function with null checks
    purchaseUpdatedListener = iapModule?.purchaseUpdatedListener || null;
    purchaseErrorListener = iapModule?.purchaseErrorListener || null;
    finishTransaction = iapModule?.finishTransaction || null;
    getProducts = iapModule?.getProducts || null;
    requestSubscription = iapModule?.requestSubscription || null;
    getAvailablePurchases = iapModule?.getAvailablePurchases || null;
    initConnection = iapModule?.initConnection || null;
    endConnection = iapModule?.endConnection || null;
  }
} catch (error) {
  console.log('IAP module not available, using mock mode:', error);
  // Ensure all variables are null on error
  purchaseUpdatedListener = null;
  purchaseErrorListener = null;
  finishTransaction = null;
  getProducts = null;
  requestSubscription = null;
  getAvailablePurchases = null;
  initConnection = null;
  endConnection = null;
}

// Subscription product IDs
export const SUBSCRIPTION_PRODUCTS = {
  MONTHLY: 'com.grsdev.canieat.subscription.monthly',
  ANNUAL: 'com.grsdev.canieat.subscription.annual',
} as const;

export interface SubscriptionProduct {
  productId: string;
  price: string;
  currency: string;
  title: string;
  description: string;
  type: 'subscription';
}

export interface SubscriptionStatus {
  isActive: boolean;
  productId: string | null;
  expirationDate: string | null; // ISO string
  isTrial: boolean;
  trialEndDate: string | null; // ISO string
  isTrialExpired?: boolean; // Computed property
}

const SUBSCRIPTION_STORAGE_KEY = 'canieat_subscription_status';

class SubscriptionService {
  private isInitialized = false;
  private iapConnected = false;
  private products: SubscriptionProduct[] = [];
  private subscriptionStatus: SubscriptionStatus | null = null;
  private purchaseUpdateSubscription: any = null;
  private purchaseErrorSubscription: any = null;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Defer IAP initialization to prevent crashes
    // Initialize with default trial status first - this is synchronous and safe
    this.subscriptionStatus = {
      isActive: false,
      productId: null,
      expirationDate: null,
      isTrial: true,
      trialEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
    this.isInitialized = true;
  }

  private async ensureIapConnection(): Promise<boolean> {
    try {
      if (this.iapConnected) {
        return true;
      }
      // Check if IAP is available before trying to initialize
      if (!initConnection || typeof initConnection !== 'function') {
        console.log('IAP not available, skipping initialization');
        return false;
      }

      // Initialize IAP connection with timeout and enhanced error handling
      // Use shorter timeout for faster failure
      const initPromise = Promise.resolve(initConnection());
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('IAP initialization timeout')), 3000)
      );
      
      try {
        const result = await Promise.race([initPromise, timeoutPromise]);
        console.log('IAP connection result:', result);
        this.iapConnected = true;
      } catch (initError) {
        console.error('IAP connection failed (non-fatal):', initError);
        // Return early - don't set up listeners if connection fails
        return false;
      }

      // Set up purchase listeners with enhanced error boundaries
      if (purchaseUpdatedListener && typeof purchaseUpdatedListener === 'function') {
        try {
          this.purchaseUpdateSubscription = purchaseUpdatedListener(
            async (purchase: any) => {
              try {
                console.log('Purchase updated:', purchase);
                // Safely check receipt with enhanced validation
                const receipt = purchase?.transactionReceipt;
                if (receipt && typeof receipt === 'string' && receipt.length > 0) {
                  if (finishTransaction && typeof finishTransaction === 'function') {
                    await finishTransaction({ purchase, isConsumable: false });
                  }
                  await this.handleSuccessfulPurchase(purchase);
                }
              } catch (error) {
                console.error('Error in purchase update listener:', error);
                // Don't rethrow to prevent crashes
              }
            }
          );
        } catch (listenerError) {
          console.error('Failed to set up purchase update listener:', listenerError);
        }
      }

      if (purchaseErrorListener && typeof purchaseErrorListener === 'function') {
        try {
          this.purchaseErrorSubscription = purchaseErrorListener(
            (error: any) => {
              console.error('Purchase error:', error);
            }
          );
        } catch (listenerError) {
          console.error('Failed to set up purchase error listener:', listenerError);
        }
      }

      console.log('IAP initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize IAP:', error);
      // Keep using trial mode - don't throw to prevent crashes
      return false;
    }
  }

  private async loadProducts(): Promise<void> {
    try {
      // Check if IAP is available
      if (!getProducts) {
        console.log('IAP not available, using mock products');
        this.products = [
          {
            productId: SUBSCRIPTION_PRODUCTS.MONTHLY,
            price: '$4.99',
            currency: 'USD',
            title: 'CanIEat Premium Monthly',
            description: 'Monthly subscription to CanIEat Premium',
            type: 'subscription',
          },
          {
            productId: SUBSCRIPTION_PRODUCTS.ANNUAL,
            price: '$49.99',
            currency: 'USD',
            title: 'CanIEat Premium Annual',
            description: 'Annual subscription to CanIEat Premium',
            type: 'subscription',
          },
        ];
        return;
      }

      const productIds = [SUBSCRIPTION_PRODUCTS.MONTHLY, SUBSCRIPTION_PRODUCTS.ANNUAL];
      const products = await getProducts({ skus: productIds });

      this.products = products.map((product: any) => ({
        productId: product.productId,
        price: product.price,
        currency: product.currency,
        title: product.title,
        description: product.description,
        type: 'subscription' as const,
      }));

      console.log('Loaded products:', this.products);
    } catch (error) {
      console.error('Failed to load products:', error);
      // Fallback to mock products for development
      this.products = [
        {
          productId: SUBSCRIPTION_PRODUCTS.MONTHLY,
          price: '$4.99',
          currency: 'USD',
          title: 'CanIEat Premium Monthly',
          description: 'Monthly subscription to CanIEat Premium',
          type: 'subscription',
        },
        {
          productId: SUBSCRIPTION_PRODUCTS.ANNUAL,
          price: '$49.99',
          currency: 'USD',
          title: 'CanIEat Premium Annual',
          description: 'Annual subscription to CanIEat Premium',
          type: 'subscription',
        },
      ];
    }
  }

  private async loadSubscriptionStatus(): Promise<void> {
    try {
      // Check if IAP is available
      if (!getAvailablePurchases) {
        console.log('IAP not available, using trial status');
        this.subscriptionStatus = {
          isActive: false,
          productId: null,
          expirationDate: null,
          isTrial: true,
          trialEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        };
        return;
      }

      // Check for existing purchases
      const purchases = await getAvailablePurchases();
      const activeSubscription = purchases.find((purchase: any) =>
        purchase.productId === SUBSCRIPTION_PRODUCTS.MONTHLY ||
        purchase.productId === SUBSCRIPTION_PRODUCTS.ANNUAL
      );

      if (activeSubscription) {
        this.subscriptionStatus = {
          isActive: true,
          productId: activeSubscription.productId,
          expirationDate: activeSubscription.transactionDateIOS ?
            new Date(activeSubscription.transactionDateIOS).toISOString() : null,
          isTrial: false,
          trialEndDate: null,
        };
      } else {
        // Check if user has used trial
        const trialUsed = await this.getTrialUsed();
        if (trialUsed) {
          this.subscriptionStatus = {
            isActive: false,
            productId: null,
            expirationDate: null,
            isTrial: false,
            trialEndDate: null,
          };
        } else {
          // New user - give them a trial
          this.subscriptionStatus = {
            isActive: false,
            productId: null,
            expirationDate: null,
            isTrial: true,
            trialEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          };
        }
      }
    } catch (error) {
      console.error('Failed to load subscription status:', error);
      // Default to trial for new users
      this.subscriptionStatus = {
        isActive: false,
        productId: null,
        expirationDate: null,
        isTrial: true,
        trialEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      };
    }
  }

  private async getTrialUsed(): Promise<boolean> {
    // In a real app, you'd store this in secure storage
    // For now, we'll use a simple approach
    return false; // Assume trial not used for demo
  }

  private async setTrialUsed(): Promise<void> {
    // In a real app, you'd store this in secure storage
    console.log('Trial marked as used');
  }

  /**
   * TEST MODE: Manually expire the trial for App Store review testing
   * This allows reviewers to test the expired trial flow without waiting
   */
  async expireTrialForTesting(): Promise<void> {
    console.log('⚠️ TEST MODE: Expiring trial for App Store review');
    this.subscriptionStatus = {
      isActive: false,
      productId: null,
      expirationDate: null,
      isTrial: true,
      trialEndDate: new Date(Date.now() - 1000).toISOString(), // Set to 1 second ago
    };
  }

  /**
   * TEST MODE: Reset trial for testing (gives fresh 7-day trial)
   */
  async resetTrialForTesting(): Promise<void> {
    console.log('⚠️ TEST MODE: Resetting trial');
    this.subscriptionStatus = {
      isActive: false,
      productId: null,
      expirationDate: null,
      isTrial: true,
      trialEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
  }

  private async handleSuccessfulPurchase(purchase: any): Promise<void> {
    try {
      // Safely extract purchase data with null checks
      const productId = purchase?.productId || null;
      const transactionDateIOS = purchase?.transactionDateIOS || null;
      
      if (!productId) {
        console.error('Invalid purchase data: missing productId');
        return;
      }

      this.subscriptionStatus = {
        isActive: true,
        productId: productId,
        expirationDate: transactionDateIOS ? 
          new Date(transactionDateIOS).toISOString() : null,
        isTrial: false,
        trialEndDate: null,
      };
    } catch (error) {
      console.error('Error handling successful purchase:', error);
      // Don't throw to prevent crashes
    }
  }

  async getProducts(): Promise<SubscriptionProduct[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    return this.products;
  }

  async purchaseSubscription(productId: string): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Validate productId
      if (!productId || typeof productId !== 'string') {
        console.error('Invalid productId:', productId);
        return false;
      }

      // Ensure IAP is connected before attempting purchase
      const connected = await this.ensureIapConnection();
      if (!connected || !requestSubscription || typeof requestSubscription !== 'function') {
        console.log('IAP not available, simulating purchase');
        // Simulate successful purchase for development
        this.subscriptionStatus = {
          isActive: true,
          productId: productId,
          expirationDate: new Date(Date.now() + (productId === SUBSCRIPTION_PRODUCTS.ANNUAL ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString(),
          isTrial: false,
          trialEndDate: null,
        };
        return true;
      }

      const result = await requestSubscription({ sku: productId });
      console.log('Purchase result:', result);
      return true;
    } catch (error) {
      console.error('Error purchasing subscription:', error);
      return false;
    }
  }

  async restorePurchases(): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Ensure IAP is connected before attempting restore
      const connected = await this.ensureIapConnection();
      if (!connected || !getAvailablePurchases) {
        console.log('IAP not available, cannot restore purchases');
        return false;
      }

      const purchases = await getAvailablePurchases();
      const activeSubscription = purchases.find(purchase =>
        purchase.productId === SUBSCRIPTION_PRODUCTS.MONTHLY ||
        purchase.productId === SUBSCRIPTION_PRODUCTS.ANNUAL
      );

      if (activeSubscription) {
        this.subscriptionStatus = {
          isActive: true,
          productId: activeSubscription.productId,
          expirationDate: activeSubscription.transactionDateIOS ?
            new Date(activeSubscription.transactionDateIOS).toISOString() : null,
          isTrial: false,
          trialEndDate: null,
        };
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error restoring purchases:', error);
      return false;
    }
  }

  async getSubscriptionStatus(): Promise<SubscriptionStatus> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    if (!this.subscriptionStatus) {
      // Default to trial for new users
      this.subscriptionStatus = {
        isActive: false,
        productId: null,
        expirationDate: null,
        isTrial: true,
        trialEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      };
    }
    
    // Compute isTrialExpired
    const isTrialExpired = this.subscriptionStatus.isTrial && 
      this.subscriptionStatus.trialEndDate && 
      new Date(this.subscriptionStatus.trialEndDate) < new Date();
    
    return {
      ...this.subscriptionStatus,
      isTrialExpired
    };
  }

  getRemainingTrialDays(trialEndDate: string | null): number {
    if (!trialEndDate) return 0;
    const endDate = new Date(trialEndDate);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }

  async disconnect(): Promise<void> {
    try {
      if (this.purchaseUpdateSubscription && typeof this.purchaseUpdateSubscription.remove === 'function') {
        this.purchaseUpdateSubscription.remove();
        this.purchaseUpdateSubscription = null;
      }
      if (this.purchaseErrorSubscription && typeof this.purchaseErrorSubscription.remove === 'function') {
        this.purchaseErrorSubscription.remove();
        this.purchaseErrorSubscription = null;
      }
      if (endConnection && typeof endConnection === 'function') {
        await endConnection();
      }
    } catch (error) {
      console.error('Error disconnecting IAP:', error);
      // Don't throw to prevent crashes during cleanup
    }
  }
}

export const subscriptionService = new SubscriptionService();