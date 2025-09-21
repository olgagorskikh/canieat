// Using in-memory storage for development
const memoryStorage: { [key: string]: string } = {};

const mockAsyncStorage = {
  getItem: async (key: string): Promise<string | null> => {
    return memoryStorage[key] || null;
  },
  setItem: async (key: string, value: string): Promise<void> => {
    memoryStorage[key] = value;
  },
  removeItem: async (key: string): Promise<void> => {
    delete memoryStorage[key];
  },
};

// Subscription product IDs (these will be set up in App Store Connect)
export const SUBSCRIPTION_PRODUCTS = {
  MONTHLY: 'com.grsdev.canieat.subscription.monthly',
  ANNUAL: 'com.grsdev.canieat.subscription.annual',
} as const;

export const SUBSCRIPTION_STORAGE_KEY = 'canieat_subscription_status';

export interface SubscriptionStatus {
  isActive: boolean;
  productId: string | null;
  expirationDate: string | null;
  isTrial: boolean;
  trialEndDate: string | null;
}

export interface SubscriptionProduct {
  productId: string;
  price: string;
  currency: string;
  title: string;
  description: string;
  type: 'subscription';
}

class SubscriptionService {
  private isInitialized = false;
  private products: SubscriptionProduct[] = [];
  private subscriptionStatus: SubscriptionStatus | null = null;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load cached subscription status
      await this.loadSubscriptionStatus();
      
      // Get available products (mock for development)
      await this.loadProducts();
      
      this.isInitialized = true;
      console.log('Subscription service initialized in development mode');
    } catch (error) {
      console.error('Failed to initialize subscription service:', error);
      this.isInitialized = true;
      console.log('Subscription service initialized in development mode');
    }
  }

  private async loadProducts(): Promise<void> {
    // For development, always load mock products
    this.loadMockProducts();
  }

  private loadMockProducts(): void {
    this.products = [
      {
        productId: SUBSCRIPTION_PRODUCTS.MONTHLY,
        price: '$4.99',
        currency: 'USD',
        title: 'CanIEat Premium Monthly',
        description: 'Monthly access to all premium features',
        type: 'subscription',
      },
      {
        productId: SUBSCRIPTION_PRODUCTS.ANNUAL,
        price: '$49.99',
        currency: 'USD',
        title: 'CanIEat Premium Annual',
        description: 'Annual access to all premium features - Best Value!',
        type: 'subscription',
      },
    ];
    console.log('Loaded mock subscription products for development');
  }

  private async loadSubscriptionStatus(): Promise<void> {
    try {
      const stored = await mockAsyncStorage.getItem(SUBSCRIPTION_STORAGE_KEY);
      if (stored) {
        this.subscriptionStatus = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading subscription status:', error);
    }
  }

  private async saveSubscriptionStatus(status: SubscriptionStatus): Promise<void> {
    try {
      this.subscriptionStatus = status;
      await mockAsyncStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(status));
    } catch (error) {
      console.error('Error saving subscription status:', error);
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
      // For development, simulate a successful purchase
      console.log('Development mode: Simulating successful purchase for', productId);
      const newStatus: SubscriptionStatus = {
        isActive: true,
        productId: productId,
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        isTrial: false,
        trialEndDate: null,
      };
      await this.saveSubscriptionStatus(newStatus);
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
      // For development, check if there's a cached subscription
      const status = await this.getSubscriptionStatus();
      if (status.isActive) {
        console.log('Development mode: Restored cached subscription');
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

    // Check if subscription is still valid
    if (this.subscriptionStatus?.isActive && this.subscriptionStatus.expirationDate) {
      const expirationDate = new Date(this.subscriptionStatus.expirationDate);
      const now = new Date();
      
      if (now > expirationDate) {
        // Subscription expired
        const expiredStatus: SubscriptionStatus = {
          isActive: false,
          productId: null,
          expirationDate: null,
          isTrial: false,
          trialEndDate: null,
        };
        await this.saveSubscriptionStatus(expiredStatus);
        return expiredStatus;
      }
    }

    return this.subscriptionStatus || {
      isActive: false,
      productId: null,
      expirationDate: null,
      isTrial: false,
      trialEndDate: null,
    };
  }

  async isPremiumUser(): Promise<boolean> {
    const status = await this.getSubscriptionStatus();
    return status.isActive;
  }

  async isTrialUser(): Promise<boolean> {
    const status = await this.getSubscriptionStatus();
    return status.isTrial;
  }

  async getTrialDaysRemaining(): Promise<number> {
    const status = await this.getSubscriptionStatus();
    
    if (!status.isTrial || !status.trialEndDate) {
      return 0;
    }
    
    const trialEndDate = new Date(status.trialEndDate);
    const now = new Date();
    const diffTime = trialEndDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  }

  async disconnect(): Promise<void> {
    if (this.isInitialized) {
      this.isInitialized = false;
    }
  }
}

export const subscriptionService = new SubscriptionService();
