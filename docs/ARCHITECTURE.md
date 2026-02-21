# CanIEat - Application Architecture

> **For Software Engineers New to Mobile Apps**
> This document explains the architecture of CanIEat, a React Native/Expo app for pregnancy food safety guidance.

---

## Table of Contents
1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Application Flow](#application-flow)
4. [Core Concepts](#core-concepts)
5. [Layer-by-Layer Breakdown](#layer-by-layer-breakdown)
6. [Data Flow](#data-flow)
7. [Key Patterns](#key-patterns)

---

## Tech Stack

- **Framework**: React Native (mobile apps for iOS/Android from single codebase)
- **Build Tool**: Expo (simplifies React Native development, build, and deployment)
- **Routing**: Expo Router (file-based routing, similar to Next.js)
- **State Management**: React Context API + Hooks
- **Language**: TypeScript
- **In-App Purchases**: react-native-iap (iOS/Android subscriptions)
- **AI Integration**: Secure backend API → OpenAI GPT-3.5-turbo (GCP Cloud Run)
- **JavaScript Engine**: Hermes (optimized JS engine for React Native)

---

## Project Structure

```
CanIEat/
├── app/                      # 📱 ROUTING & SCREENS (Expo Router)
│   ├── _layout.tsx           # Root layout with providers
│   ├── (tabs)/               # Tab navigation group
│   │   ├── _layout.tsx       # Tab bar configuration
│   │   ├── index.tsx         # 🔍 Search screen (main)
│   │   └── about.tsx         # ℹ️ About screen
│   └── +not-found.tsx        # 404 screen
│
├── components/               # 🎨 REUSABLE UI COMPONENTS
│   ├── ErrorBoundary.tsx     # Error handler wrapper
│   ├── PremiumGate.tsx       # Paywall component
│   ├── SubscriptionModal.tsx # Subscription purchase UI
│   └── SubscriptionStatus.tsx# Subscription status badge
│
├── contexts/                 # 🌐 STATE MANAGEMENT
│   └── SubscriptionContext.tsx # Global subscription state
│
├── services/                 # 🔧 BUSINESS LOGIC & APIs
│   ├── openaiService.ts      # Backend API integration (food safety)
│   └── subscriptionService.ts# In-app purchase logic
│
├── utils/                    # 🛠️ HELPER FUNCTIONS
│   ├── stringUtils.ts        # Safe string operations
│   ├── memoryUtils.ts        # Memory optimization (iPad fixes)
│   └── deviceUtils.ts        # Device detection & text handling
│
├── assets/                   # 📦 STATIC FILES
│   ├── images/               # Icons, logos, splash screens
│   └── fonts/                # Custom fonts
│
├── app.json                  # 📋 Expo configuration
├── eas.json                  # 🚀 EAS Build configuration
├── metro.config.js           # 📦 Bundler configuration
├── package.json              # 📚 Dependencies
└── tsconfig.json             # 🔧 TypeScript configuration
```

---

## Application Flow

### 1. **App Startup**
```
┌─────────────────────────────────────────────────┐
│ app/_layout.tsx (Root)                          │
│  ├─ ErrorBoundary (catches crashes)             │
│  │   └─ SubscriptionProvider (global state)     │
│  │       └─ Stack Navigator                     │
│  │           └─ (tabs) route                    │
│  │               ├─ index.tsx (Search)          │
│  │               └─ about.tsx (About)           │
└─────────────────────────────────────────────────┘
```

### 2. **User Journey**
```
User Opens App
    ↓
ErrorBoundary wraps everything
    ↓
SubscriptionContext initializes
    ├─ Loads trial status (default: 7 days free)
    ├─ Connects to Apple/Google IAP
    └─ Checks for existing purchases
    ↓
Tab Navigator displays
    ├─ Search Tab (default)
    └─ About Tab
    ↓
User searches food item
    ├─ If trial/premium → Call backend API → OpenAI
    └─ If expired → Show paywall
    ↓
Display results or subscription modal
```

---

## Core Concepts

### 1. **Expo Router (File-Based Routing)**

Unlike traditional React Native navigation, Expo Router uses **file structure** to define routes:

```
app/
  (tabs)/          ← Parentheses = layout group (no route segment)
    index.tsx      ← Route: /
    about.tsx      ← Route: /about
```

**Key Files:**
- `_layout.tsx`: Defines navigation structure for its directory
- `(tabs)/_layout.tsx`: Creates bottom tab navigation
- Navigation is **automatic** based on file structure

### 2. **React Context for State Management**

`SubscriptionContext.tsx` provides global state without Redux:

```typescript
// Provider wraps entire app
<SubscriptionProvider>
  {children}
</SubscriptionProvider>

// Any component can access subscription state
const { isPremium, products } = useSubscription();
```

**What it manages:**
- Premium status (boolean)
- Trial status (days remaining)
- Available products (from App Store)
- Purchase functions

### 3. **Service Layer Pattern**

Services separate business logic from UI:

```
UI Component
    ↓ calls
Service (openaiService.ts)
    ↓ calls
Backend API (GCP Cloud Run)
    ↓ calls
External API (OpenAI)
```

**Security Note:** The app never calls OpenAI directly. All requests go through a secure backend that protects the API key.

Benefits:
- Reusable logic
- Easy to test
- Clear separation of concerns

---

## Layer-by-Layer Breakdown

### 📱 **Layer 1: Routing & Screens** (`app/`)

#### `app/_layout.tsx` (Root Layout)
```typescript
// Entry point for the entire app
export default function RootLayout() {
  return (
    <ErrorBoundary>                    // Catches crashes
      <SubscriptionProvider>           // Provides subscription state
        <Stack>                        // Navigation container
          <Stack.Screen name="(tabs)"/> // Main app screens
        </Stack>
      </SubscriptionProvider>
    </ErrorBoundary>
  );
}
```

**Purpose:**
- Sets up error handling
- Initializes global state
- Defines root navigation structure

---

#### `app/(tabs)/_layout.tsx` (Tab Navigation)
```typescript
// Creates bottom tab bar with 2 tabs
export default function TabLayout() {
  return (
    <Tabs screenOptions={{...styles}}>
      <Tabs.Screen name="index" />    // Search tab
      <Tabs.Screen name="about" />    // About tab
    </Tabs>
  );
}
```

**Purpose:**
- Configures bottom navigation
- Sets icons and colors
- Defines tab structure

---

#### `app/(tabs)/index.tsx` (Search Screen - MAIN FEATURE)
```typescript
export default function SearchScreen() {
  const [searchText, setSearchText] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const { isPremium, subscriptionStatus } = useSubscription();

  const handleSearch = async () => {
    // Check access: premium or active trial
    const hasAccess = isPremium || 
                     (subscriptionStatus?.isTrial && 
                      !subscriptionStatus?.isTrialExpired);

    if (hasAccess) {
      // Call backend API (which calls OpenAI securely)
      const analysis = await checkFoodSafety(searchText);
      setResult(analysis);
    } else {
      // Show paywall
      setShowSubscriptionModal(true);
    }
  };
}
```

**User Flow:**
1. User types food item (e.g., "sushi")
2. Presses search
3. App checks subscription status
4. If allowed → API call → display results
5. If not allowed → show subscription modal

---

#### `app/(tabs)/about.tsx` (About Screen)
```typescript
export default function AboutScreen() {
  const { subscriptionStatus, isPremium } = useSubscription();
  
  // Display:
  // - Premium badge (if subscribed)
  // - Trial countdown (if in trial)
  // - App information
  // - Medical disclaimer
}
```

---

### 🌐 **Layer 2: State Management** (`contexts/`)

#### `contexts/SubscriptionContext.tsx` (Global Subscription State)

**What it provides:**
```typescript
interface SubscriptionContextType {
  isPremium: boolean;                    // Is user subscribed?
  subscriptionStatus: SubscriptionStatus; // Trial info, expiry
  products: SubscriptionProduct[];       // Available plans
  loading: boolean;                      // Loading state
  error: string | null;                  // Error messages
  purchaseSubscription: (id) => Promise; // Buy subscription
  restorePurchases: () => Promise;       // Restore purchases
  refreshSubscriptionStatus: () => Promise; // Reload status
}
```

**How it works:**
```typescript
export const SubscriptionProvider = ({ children }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);

  useEffect(() => {
    // On app startup:
    // 1. Set default trial (7 days)
    // 2. Connect to Apple/Google IAP
    // 3. Check for existing purchases
    // 4. Update premium status
    
    const defaultStatus = {
      isTrial: true,
      trialEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    };
    setSubscriptionStatus(defaultStatus);
    
    // Initialize subscription service
    subscriptionService.initialize();
  }, []);

  return (
    <SubscriptionContext.Provider value={{...}}>
      {children}
    </SubscriptionContext.Provider>
  );
};
```

**Usage in components:**
```typescript
// Any component can access subscription state
const { isPremium, purchaseSubscription } = useSubscription();

if (isPremium) {
  return <PremiumFeature />;
} else {
  return <Paywall />;
}
```

---

### 🔧 **Layer 3: Services** (`services/`)

#### `services/openaiService.ts` (Backend API Integration)

**Purpose:** Communicate with secure backend API for food safety analysis

**Security:** The app never calls OpenAI directly. All requests go through a secure GCP Cloud Run backend that:
- Protects the OpenAI API key (never exposed in app)
- Implements rate limiting (10 requests / 15 min)
- Adds authentication via secret header
- Enables usage monitoring and cost control

```typescript
export async function checkFoodSafety(foodItem: string) {
  // 1. Call secure backend API
  const response = await fetch(`${BACKEND_URL}/api/check-food`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-secret': API_SECRET,
    },
    body: JSON.stringify({ foodItem }),
  });

  // 2. Backend calls OpenAI and returns structured response
  });

  // 3. Parse response (JSON format)
  const response = completion.choices[0].message.content;
  const parsed = JSON.parse(response);

  // 4. Return structured data
  return {
    canEat: parsed.canEat,        // true/false
    reason: parsed.reason,         // Explanation
    additionalInfo: parsed.additionalInfo // Safety tips
  };
}
```

**Memory Optimizations (iPad fixes):**
- Limits response to 5000 chars (prevents GC crashes)
- Uses `slice()` instead of regex (more efficient)
- Requests garbage collection before/after large operations
- Safe error handling

---

#### `services/subscriptionService.ts` (In-App Purchases)

**Purpose:** Handle Apple/Google Play subscriptions

```typescript
class SubscriptionService {
  // Initialize connection to App Store/Play Store
  async initialize() {
    await initConnection();
    this.setupPurchaseListeners();
  }

  // Get available subscription products
  async getProducts() {
    return await getProducts({
      skus: [
        'com.grsdev.canieat.subscription.monthly',   // $4.99/month
        'com.grsdev.canieat.subscription.annual'     // $49.99/year
      ]
    });
  }

  // Purchase a subscription
  async purchaseSubscription(productId: string) {
    const result = await requestSubscription({ sku: productId });
    // Update subscription status
    this.subscriptionStatus = {
      isActive: true,
      productId: productId,
      expirationDate: result.expirationDate
    };
    return true;
  }

  // Check subscription status
  async getSubscriptionStatus() {
    const purchases = await getAvailablePurchases();
    // Check if user has active subscription
    // If not, check if trial is available
    return this.subscriptionStatus;
  }

  // Restore previous purchases (for reinstalls)
  async restorePurchases() {
    const purchases = await getAvailablePurchases();
    // Find active subscription and restore
  }
}
```

**Key Features:**
- 7-day free trial for new users
- Monthly ($4.99) and annual ($49.99) plans
- Auto-restore on reinstall
- Fallback to mock data in development

---

### 🎨 **Layer 4: UI Components** (`components/`)

#### `components/PremiumGate.tsx` (Paywall Component)

**Purpose:** Block premium features for free users

```typescript
export const PremiumGate = ({ children, featureName }) => {
  const { isPremium } = useSubscription();
  const [showModal, setShowModal] = useState(false);

  if (isPremium) {
    return <>{children}</>; // Show feature
  }

  // Show locked state
  return (
    <View>
      <LockIcon />
      <Text>Unlock "{featureName}" with Premium!</Text>
      <Button onPress={() => setShowModal(true)}>
        Upgrade to Premium
      </Button>
      <SubscriptionModal isVisible={showModal} />
    </View>
  );
};
```

**Usage:**
```typescript
<PremiumGate featureName="Detailed Analysis">
  <AIAnalysisResult />
</PremiumGate>
```

---

#### `components/SubscriptionModal.tsx` (Purchase UI)

**Purpose:** Display subscription plans and handle purchase flow

```typescript
export const SubscriptionModal = ({ isVisible, onClose }) => {
  const { products, purchaseSubscription } = useSubscription();

  const handlePurchase = async (productId) => {
    const success = await purchaseSubscription(productId);
    if (success) onClose();
  };

  return (
    <Modal visible={isVisible}>
      <Text>Unlock Premium Features</Text>
      
      {products.map(product => (
        <ProductCard 
          key={product.productId}
          title={product.title}
          price={product.price}
          onPress={() => handlePurchase(product.productId)}
        />
      ))}
      
      <Text>7-day free trial included!</Text>
      <Button onPress={restorePurchases}>Restore Purchases</Button>
    </Modal>
  );
};
```

---

#### `components/ErrorBoundary.tsx` (Crash Handler)

**Purpose:** Catch JavaScript errors and prevent white screen of death

```typescript
export class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App crashed:', error);
    
    // Auto-recover from memory/layout errors
    if (isRecoverableError(error)) {
      setTimeout(() => {
        this.setState({ hasError: false });
      }, 1000);
    }
  }

  render() {
    if (this.state.hasError) {
      return <ErrorScreen onRetry={() => this.setState({ hasError: false })} />;
    }
    return this.props.children;
  }
}
```

**Benefits:**
- Prevents app from crashing completely
- Shows user-friendly error message
- Auto-recovery for certain errors
- Logs errors for debugging

---

### 🛠️ **Layer 5: Utilities** (`utils/`)

#### `utils/stringUtils.ts` (Safe String Operations)

**Purpose:** Prevent crashes from string operations (especially on iPad)

```typescript
// Safely convert any value to string with length limit
export function safeString(value: any, maxLength = 1000, fallback = '') {
  try {
    if (value === null || value === undefined) return fallback;
    
    const str = String(value).trim();
    if (str.length === 0) return fallback;
    
    // Use slice() instead of substring() for better Hermes performance
    return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
  } catch (error) {
    return fallback;
  }
}

// Safe substring with bounds checking
export function safeSubstring(str: string, start: number, end?: number) {
  try {
    if (!str || typeof str !== 'string') return '';
    
    const safeStart = Math.max(0, Math.min(start, str.length));
    const safeEnd = end !== undefined ? Math.max(safeStart, Math.min(end, str.length)) : str.length;
    
    return str.slice(safeStart, safeEnd);
  } catch (error) {
    return '';
  }
}
```

**Why needed:**
- Hermes JS engine can crash on large string operations
- iPad devices have memory constraints
- Prevents "out of memory" errors during garbage collection

---

#### `utils/memoryUtils.ts` (Memory Management)

**Purpose:** Optimize memory usage to prevent iPad crashes

```typescript
// Break large strings into manageable chunks
export function chunkString(str: string, chunkSize = 1000): string[] {
  const chunks = [];
  for (let i = 0; i < str.length; i += chunkSize) {
    chunks.push(str.slice(i, i + chunkSize));
  }
  return chunks;
}

// Request garbage collection (iOS only)
export function requestGarbageCollection() {
  if (Platform.OS === 'ios' && global.gc) {
    try {
      global.gc(); // Force JS garbage collection
    } catch (error) {
      // GC not available
    }
  }
}

// Safe string concatenation
export function safeConcat(...strings: string[]): string {
  const filtered = strings.filter(s => typeof s === 'string' && s.length > 0);
  
  // Prevent creating extremely large strings
  const totalLength = filtered.reduce((sum, s) => sum + s.length, 0);
  if (totalLength > 10000) {
    return filtered.map(s => s.slice(0, 1000)).join('');
  }
  
  return filtered.join('');
}
```

**Why needed:**
- iPad Air 5th gen crashes due to Hermes GC issues
- Large string allocations trigger out-of-memory errors
- Manual GC requests help prevent memory pressure

---

## Data Flow

### Search Flow (Main Feature)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. USER ACTION                                              │
│    User types "sushi" → presses Search                      │
└─────────────────────┬───────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. UI COMPONENT (index.tsx)                                 │
│    handleSearch() is called                                 │
│    - Validates input                                        │
│    - Checks subscription status from Context                │
└─────────────────────┬───────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. STATE CHECK (SubscriptionContext)                        │
│    const hasAccess = isPremium || (isTrial && !isExpired)  │
│    ├─ If TRUE  → proceed to API                            │
│    └─ If FALSE → show SubscriptionModal                    │
└─────────────────────┬───────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. SERVICE LAYER (openaiService.ts)                         │
│    checkFoodSafety("sushi")                                 │
│    - Calls backend API with auth header                     │
│    - Handles rate limiting & errors                         │
└─────────────────────┬───────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. BACKEND API (GCP Cloud Run)                             │
│    POST /api/check-food                                     │
│    - Validates auth secret                                  │
│    - Applies rate limiting (10/15min)                       │
│    - Builds UK medical guidelines prompt                    │
│    - Calls OpenAI API                                       │
└─────────────────────┬───────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. EXTERNAL API (OpenAI)                                    │
│    GPT-3.5-turbo processes request                          │
│    Returns: { canEat: false, reason: "...", info: "..." }  │
└─────────────────────┬───────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. RESPONSE HANDLING (openaiService.ts)                     │
│    - Safely parses backend response                         │
│    - Limits string lengths (iPad fix)                       │
│    - Requests garbage collection                            │
│    - Returns to UI component                                │
└─────────────────────┬───────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. UI UPDATE (index.tsx)                                    │
│    setResult("❌ NOT RECOMMENDED\n\nReason: ...")          │
│    - Formats result                                         │
│    - Displays to user                                       │
└─────────────────────────────────────────────────────────────┘
```

---

### Subscription Purchase Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. USER ACTION                                              │
│    User taps "Upgrade to Premium"                           │
└─────────────────────┬───────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. SUBSCRIPTION MODAL (SubscriptionModal.tsx)               │
│    - Displays available products from Context               │
│    - User selects monthly ($4.99) or annual ($49.99)        │
│    - Taps product card                                      │
└─────────────────────┬───────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. CONTEXT (SubscriptionContext.tsx)                        │
│    purchaseSubscription(productId)                          │
│    - Sets loading state                                     │
│    - Calls subscription service                             │
└─────────────────────┬───────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. SERVICE (subscriptionService.ts)                         │
│    purchaseSubscription(productId)                          │
│    - Validates product ID                                   │
│    - Initiates IAP flow                                     │
└─────────────────────┬───────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. NATIVE IAP (react-native-iap)                            │
│    requestSubscription({ sku: productId })                  │
│    - Shows native payment sheet (Face ID / Touch ID)        │
│    - User authorizes payment                                │
│    - Processes through Apple/Google                         │
└─────────────────────┬───────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. PURCHASE LISTENER (subscriptionService.ts)               │
│    purchaseUpdatedListener fires                            │
│    - Validates receipt                                      │
│    - Finishes transaction                                   │
│    - Updates subscription status                            │
└─────────────────────┬───────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. STATE UPDATE (SubscriptionContext.tsx)                   │
│    refreshSubscriptionStatus()                              │
│    - Reloads subscription from service                      │
│    - Updates isPremium = true                               │
│    - Closes modal                                           │
└─────────────────────┬───────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────────┐
│ 8. UI UPDATE                                                │
│    - Premium badge appears                                  │
│    - Features unlock automatically                          │
│    - About screen shows "Premium User"                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Patterns

### 1. **Context + Hooks Pattern** (State Management)

**Instead of Redux, we use React Context:**

```typescript
// 1. Create Context
const SubscriptionContext = createContext<SubscriptionContextType>();

// 2. Create Provider Component
export const SubscriptionProvider = ({ children }) => {
  const [state, setState] = useState(...);
  return (
    <SubscriptionContext.Provider value={state}>
      {children}
    </SubscriptionContext.Provider>
  );
};

// 3. Create Custom Hook
export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  return context;
};

// 4. Use in Any Component
function MyComponent() {
  const { isPremium } = useSubscription(); // ✅ Access global state
}
```

**Benefits:**
- No external library needed
- Simple API
- Type-safe with TypeScript
- Works great for small-to-medium apps

---

### 2. **Service Layer Pattern** (Business Logic Separation)

**Keep UI components clean by moving logic to services:**

```typescript
// ❌ BAD: Logic in component
function SearchScreen() {
  const handleSearch = async () => {
    const response = await fetch(`${BACKEND_URL}/api/check-food`, {
      method: 'POST',
      headers: { 'x-api-secret': API_SECRET },
      body: JSON.stringify({ foodItem: searchText })
    });
    const data = await response.json();
    // ... parsing logic ...
  };
}

// ✅ GOOD: Logic in service
function SearchScreen() {
  const handleSearch = async () => {
    const result = await checkFoodSafety(searchText);
    setResult(result);
  };
}

// services/openaiService.ts
export async function checkFoodSafety(foodItem: string) {
  // All API logic here
  // Reusable, testable, maintainable
  // Handles backend communication, rate limiting, errors
}
```

---

### 3. **Component Composition Pattern** (Reusable UI)

**Build complex UIs from simple components:**

```typescript
// Small, focused components
<SearchScreen>
  <SubscriptionStatus />           {/* Status badge */}
  
  <PremiumGate featureName="AI Analysis">
    <AIAnalysisForm />             {/* Only shown if premium */}
  </PremiumGate>
  
  <SubscriptionModal />            {/* Paywall */}
</SearchScreen>
```

**Benefits:**
- Easy to test individual components
- Reusable across screens
- Clear separation of concerns

---

### 4. **Error Boundary Pattern** (Crash Prevention)

**Catch errors at component tree boundaries:**

```typescript
// Wrap entire app
<ErrorBoundary>
  <App />
</ErrorBoundary>

// If any child component crashes:
// → ErrorBoundary catches it
// → Shows fallback UI
// → Prevents white screen
// → App keeps running
```

---

### 5. **Optimistic Updates + Rollback** (Better UX)

**Update UI immediately, rollback on error:**

```typescript
const purchaseSubscription = async (productId) => {
  // 1. Optimistically update UI
  setIsPremium(true);
  
  try {
    // 2. Make actual API call
    await subscriptionService.purchase(productId);
    // Success! UI already updated
  } catch (error) {
    // 3. Rollback on error
    setIsPremium(false);
    showError('Purchase failed');
  }
};
```

---

## Key Files Reference

### Configuration Files

| File | Purpose |
|------|---------|
| `app.json` | Expo config: app name, bundle ID, icons, permissions |
| `eas.json` | EAS Build config: development, preview, production profiles |
| `metro.config.js` | JavaScript bundler config: Hermes optimization, minification |
| `package.json` | Dependencies: React Native, Expo, OpenAI, IAP libraries |
| `tsconfig.json` | TypeScript settings: strict mode, paths, compilation |

---

### Critical Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `expo` | ~54.0.0 | Framework for building React Native apps |
| `expo-router` | ~6.0.4 | File-based routing (like Next.js) |
| `react-native` | ^0.81.4 | Core mobile framework |
| `react-native-iap` | ^14.4.8 | In-app purchases (subscriptions) |
| `react` | 19.1.4 | **Pinned** (fixes iPad crashes) |

**Note:** The app uses a secure backend API (GCP Cloud Run) for OpenAI integration. The OpenAI SDK is NOT in the mobile app dependencies for security reasons.

---

## Mobile Development Concepts

### For Web Developers New to Mobile:

1. **No DOM**: Use `<View>`, `<Text>`, `<TouchableOpacity>` instead of `<div>`, `<p>`, `<button>`

2. **Styling**: No CSS files. Use `StyleSheet.create()`:
   ```typescript
   const styles = StyleSheet.create({
     container: {
       flex: 1,  // Not "height: 100vh"
       backgroundColor: '#fff'
     }
   });
   ```

3. **Navigation**: File-based routing (Expo Router) instead of react-router

4. **Platform-Specific Code**:
   ```typescript
   if (Platform.OS === 'ios') {
     // iOS-specific code
   } else if (Platform.OS === 'android') {
     // Android-specific code
   }
   ```

5. **Native Modules**: Some features require native code (camera, IAP, etc.)

6. **Build Process**: Can't just deploy to server. Need:
   - Development build: `expo start`
   - Production build: `eas build`
   - Submit to stores: `eas submit`

7. **App Store Review**: Apps must pass Apple/Google review (2-7 days)

8. **Subscriptions**: Complex Apple/Google APIs handled by `react-native-iap`

---

## Common Tasks

### Add a New Screen

1. Create file: `app/new-screen.tsx`
2. Export React component
3. Navigation is automatic!

### Add to Tab Bar

1. Create file inside: `app/(tabs)/new-tab.tsx`
2. Configure in `app/(tabs)/_layout.tsx`

### Add Global State

1. Create Context in `contexts/MyContext.tsx`
2. Wrap in `app/_layout.tsx`
3. Use hook: `useMyContext()`

### Call External API

1. Create service in `services/myService.ts`
2. Export async functions
3. Call from components

### Style a Component

```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,              // flexbox (default in RN)
    padding: 20,          // number = device pixels
    backgroundColor: '#fff'
  }
});
```

---

## Deployment Pipeline

```
1. Development
   ↓ npx expo start
   → Test on iOS Simulator / Android Emulator

2. Build
   ↓ eas build --platform ios --profile production
   → EAS builds IPA/APK file
   → Stored on Expo servers

3. Submit
   ↓ eas submit --platform ios --latest
   → Uploads to App Store Connect / Play Console
   → Validation (bundle ID, certificates, etc.)

4. Review
   → Apple/Google reviews app (1-7 days)
   → Rejection reasons in App Store Connect

5. Release
   → Approved apps go live in stores
   → Users can download/update
```

---

## Troubleshooting iPad Crashes

### Issue 1: Hermes GC Crashes (iPad Air 5th gen)
**Problem:** Hermes JS engine crashes during large string operations, JSON parsing, and garbage collection

**Solution** (implemented):
1. `metro.config.js`: Optimized Hermes minification
2. `utils/stringUtils.ts`: Safe string operations with limits
3. `utils/memoryUtils.ts`: Manual GC requests
4. `services/openaiService.ts`: Limited response sizes
5. `components/ErrorBoundary.tsx`: Auto-recovery from crashes

**Techniques:**
- Use `slice()` instead of `substring()` or `match()`
- Limit strings to 5000 chars max
- Request GC before/after large operations

**Status:** ✅ Fixed (see [IPAD_FIX_README.md](./IPAD_FIX_README.md))

### Issue 2: CoreText Layout Crashes (iPad Air 11-inch M3)
**Problem:** CoreText text rendering crashes with complex emoji-rich text and long responses

**Solution** (implemented):
1. `utils/deviceUtils.ts`: Device detection and tablet-specific text handling
2. `app/(tabs)/index.tsx`: Text chunking and emoji simplification for tablets
3. `app/(tabs)/about.tsx`: Conditional emoji rendering
4. `components/ErrorBoundary.tsx`: Enhanced error detection for CoreText crashes

**Techniques:**
- Detect tablets using screen dimensions and aspect ratio
- Replace emojis with text equivalents (`✅` → `[SAFE]`) on tablets
- Split long text into smaller chunks (350 chars max) for rendering
- Enhanced error recovery for text layout errors

**Status:** ✅ Fixed (see [CORETEXT_CRASH_FIX.md](./CORETEXT_CRASH_FIX.md))

---

## Summary

**CanIEat Architecture:**
- **Expo + React Native**: Build iOS/Android from one codebase
- **File-based routing**: Add screens by creating files
- **Context API**: Simple global state (no Redux)
- **Service layer**: Separates business logic from UI
- **Subscription system**: 7-day trial + monthly/annual plans
- **Backend integration**: Secure GCP Cloud Run backend for AI analysis
- **Security**: API keys protected, rate limiting, authentication
- **Error resilience**: ErrorBoundary + memory optimizations + device-specific fixes

**Key Takeaway**: This is a **well-structured, production-ready, security-focused** mobile app following modern React Native best practices with careful attention to performance, crash prevention, and API security.

**Related Documentation:**
- [SECURITY_MIGRATION.md](./SECURITY_MIGRATION.md) - Backend security implementation
- [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) - Backend API integration
- [CORETEXT_CRASH_FIX.md](./CORETEXT_CRASH_FIX.md) - Latest iPad crash fix
- [IPAD_FIX_README.md](./IPAD_FIX_README.md) - iPad performance fixes
- Backend docs: `../../backend/docs/` - Backend deployment

---

## Questions?

Common confusions for web developers:

**Q: Where's index.html?**
A: No HTML. Entry point is `app/_layout.tsx`

**Q: Where's CSS?**
A: Inline styles with `StyleSheet.create()`

**Q: How do routes work?**
A: File structure = routes (like Next.js)

**Q: What's the equivalent of npm run dev?**
A: `npx expo start` (starts Metro bundler)

**Q: How do I deploy?**
A: `eas build` → `eas submit` → App Store/Play Store

**Q: Why so many providers?**
A: Context API pattern: `<Provider><Children /></Provider>`

---

*Last updated: February 2026*
*App Version: 1.0.0 (Build 35)*
