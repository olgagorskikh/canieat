// Simple subscription service without complex dependencies
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
  expirationDate: string | null;
  isTrial: boolean;
  trialEndDate: string | null;
}

// Mock products for development
export const SUBSCRIPTION_PRODUCTS = {
  MONTHLY: 'com.grsdev.canieat.subscription.monthly',
  ANNUAL: 'com.grsdev.canieat.subscription.annual',
} as const;

class SubscriptionService {
  private isInitialized = false;
  private products: SubscriptionProduct[] = [];
  private subscriptionStatus: SubscriptionStatus | null = null;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load mock products for development
      this.loadMockProducts();
      
      // Load subscription status from memory (simple approach)
      this.loadSubscriptionStatus();

      this.isInitialized = true;
      console.log('Subscription service initialized');
    } catch (error) {
      console.error('Failed to initialize subscription service:', error);
      this.isInitialized = true;
    }
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
  }

  private loadSubscriptionStatus(): void {
    // Simple in-memory storage for development
    // In production, this would use secure storage
    this.subscriptionStatus = {
      isActive: false,
      productId: null,
      expirationDate: null,
      isTrial: false,
      trialEndDate: null,
    };
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
      
      this.subscriptionStatus = newStatus;
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
    
    if (!this.subscriptionStatus) {
      this.subscriptionStatus = {
        isActive: false,
        productId: null,
        expirationDate: null,
        isTrial: false,
        trialEndDate: null,
      };
    }
    
    return this.subscriptionStatus;
  }

  async disconnect(): Promise<void> {
    if (this.isInitialized) {
      this.isInitialized = false;
    }
  }
}

export const subscriptionService = new SubscriptionService();
