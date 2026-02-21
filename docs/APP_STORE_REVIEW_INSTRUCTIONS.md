# 📱 App Store Review Instructions - CanIEat

## Free Trial Testing Instructions

Dear App Store Review Team,

Thank you for reviewing CanIEat. Below are instructions for testing the free trial expiration flow.

---

## ✅ No Login Credentials Needed

**CanIEat does not require user accounts or login credentials.** The app is fully functional without any authentication.

---

## 🧪 How to Test the Expired Trial Flow

### Step 1: Open the App
- Launch CanIEat on your test device
- The app will automatically start with a **7-day free trial**

### Step 2: Navigate to the "About" Tab
- Tap the **"About"** tab at the bottom of the screen
- Scroll to the bottom of the page

### Step 3: Use the Test Mode Controls
At the bottom of the About page, you'll see a section labeled:

**"🧪 App Store Review Test Mode"**

This section contains two buttons:

#### ⏰ **"Expire Trial Now"** Button
- Tap this button to **immediately expire the free trial**
- This simulates what happens when a user's 7-day trial ends
- After tapping, you'll see a confirmation dialog
- Confirm to expire the trial

#### 🔄 **"Reset Trial (7 days)"** Button
- Tap this button to **reset the trial back to 7 days**
- This allows you to test the trial flow multiple times
- Useful if you need to restart your testing

---

## 🎯 What Happens After Trial Expiration?

### Expected Behavior (Free Tier):
1. **Basic Food Search**: Still available ✅
   - Users can search for food items
   - View basic safety information

2. **Premium Features**: Locked 🔒
   - Detailed AI analysis is disabled
   - Users see a "Premium Gate" screen
   - Prompts to subscribe for full access

### Testing the Premium Flow:
1. After expiring the trial, try searching for a food item (e.g., "salmon")
2. Tap "Get Detailed Analysis"
3. You'll see the **subscription prompt** with two options:
   - **Monthly Subscription**: $4.99/month
   - **Annual Subscription**: $49.99/year

4. In **Sandbox Mode**, you can test purchasing without real charges:
   - Apple will prompt you to sign in with a sandbox test account
   - Complete the test purchase
   - Verify that premium features become accessible

---

## 📋 Testing Checklist

- [ ] Open the app (no login required)
- [ ] Navigate to "About" tab
- [ ] Scroll to "App Store Review Test Mode"
- [ ] Tap "⏰ Expire Trial Now"
- [ ] Confirm the trial expiration
- [ ] Verify that premium features are locked
- [ ] Try to access a premium feature (e.g., "Get Detailed Analysis")
- [ ] See the subscription prompt
- [ ] (Optional) Test purchasing in sandbox mode
- [ ] (Optional) Tap "🔄 Reset Trial" to reset and retest

---

## 🔐 Sandbox Testing (Optional)

If you want to test the actual purchase flow:

1. Use an **Apple Sandbox Test Account** (configured in App Store Connect)
2. Attempt to purchase the Monthly or Annual subscription
3. Apple will prompt you to sign in with the test account
4. Complete the sandbox purchase (no real charges)
5. Verify that premium features unlock after purchase

**Note:** Sandbox subscriptions renew much faster than real subscriptions (e.g., 1 week subscription renews in 3 minutes for testing).

---

## 💡 Additional Notes

### Trial Management
- The app uses a **local 7-day free trial** system
- Trial status is stored on-device
- After 7 days (or manual expiration via test mode), users must subscribe
- No server-side authentication required

### Subscription Products
- **Product IDs:**
  - Monthly: `com.grsdev.canieat.subscription.monthly` - $4.99/month
  - Annual: `com.grsdev.canieat.subscription.annual` - $49.99/year
- Both include a free trial period
- Auto-renewable subscriptions

### Free vs Premium Features
- **Free (Basic):**
  - Search food items
  - View basic safety information
  - Access general guidelines
  
- **Premium (Subscription Required):**
  - Detailed AI-powered food safety analysis
  - Personalized recommendations
  - Based on UK government medical guidelines
  - Comprehensive safety tips and preparation advice

---

## 📞 Support

If you encounter any issues during review, please let us know in the App Store Connect notes.

**Developer Contact:**
- Available via App Store Connect messaging
- Response time: Within 24 hours

---

## 🎉 Summary

**To test the expired trial flow:**
1. Open CanIEat (no login needed)
2. Go to "About" tab
3. Scroll down to "App Store Review Test Mode"
4. Tap "⏰ Expire Trial Now"
5. Verify premium features are locked
6. Test the subscription prompt

**That's it!** No test accounts, no special credentials—just tap a button. 🎯

---

*Last updated: February 14, 2026*
*Build Number: 22*
*Version: 1.0.0*
