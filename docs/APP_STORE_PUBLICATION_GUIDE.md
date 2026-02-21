# 🚀 Complete App Store Publication Guide for CanIEat

This comprehensive guide will walk you through every step needed to publish your CanIEat app to the App Store, including setting up monetization and uploading your IPA.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [App Store Connect Setup](#app-store-connect-setup)
3. [App Information & Metadata](#app-information--metadata)
4. [Screenshots & App Preview](#screenshots--app-preview)
5. [In-App Purchase Setup](#in-app-purchase-setup)
6. [Upload IPA to App Store Connect](#upload-ipa-to-app-store-connect)
7. [App Review Submission](#app-review-submission)
8. [Post-Publication](#post-publication)

---

## 🔧 Prerequisites

Before starting, ensure you have:

- ✅ **Apple Developer Account** (paid membership required)
- ✅ **App Store Connect access** (same Apple ID as developer account)
- ✅ **Production IPA built** (we just created this)
- ✅ **App bundle identifier**: `com.grsdev.canieat`
- ✅ **Apple Team ID**: `J7BY3YY43H`

---

## 🍎 App Store Connect Setup

### Step 1: Create Your App

1. **Go to App Store Connect**: https://appstoreconnect.apple.com
2. **Sign in** with your Apple ID: `ogorskikh@gmail.com`
3. **Click "My Apps"** in the top navigation
4. **Click the "+" button** and select "New App"
5. **Fill in the app details**:
   - **Platform**: iOS
   - **Name**: CanIEat
   - **Primary Language**: English (U.S.)
   - **Bundle ID**: Select `com.grsdev.canieat` (should be registered)
   - **SKU**: `canieat-ios-2024` (unique identifier for your records)
   - **User Access**: Full Access

6. **Click "Create"**

### Step 2: Get Your App Store Connect App ID

After creating the app:
1. **Click on your CanIEat app**
2. **Look at the URL** in your browser - it will be something like:
   ```
   https://appstoreconnect.apple.com/apps/1234567890/appstore
   ```
3. **Copy the number** (1234567890) - this is your App Store Connect App ID
4. **Save this number** - you'll need it for EAS Submit

---

## 📝 App Information & Metadata

### Step 3: App Information

1. **In your app's App Store Connect page**, go to **App Information**
2. **Fill in the required fields**:

   **App Information:**
   - **Name**: CanIEat
   - **Subtitle**: Pregnancy Food Safety Guide
   - **Category**: Medical
   - **Secondary Category**: Health & Fitness
   - **Content Rights**: No
   - **Age Rating**: Complete the questionnaire (likely 4+ for medical apps)

   **Pricing and Availability:**
   - **Price**: Free
   - **Availability**: All countries/regions
   - **App Store**: Available on the App Store

### Step 4: App Privacy

1. **Go to App Privacy** section
2. **Click "Get Started"**
3. **Answer the privacy questions**:
   - **Does this app collect data?**: Yes
   - **What data does it collect?**:
     - **Contact Info**: No
     - **Health & Fitness**: No
     - **Financial Info**: No (unless you implement real payments)
     - **Location**: No
     - **Sensitive Info**: No
     - **Contacts**: No
     - **User Content**: Yes (food search queries)
     - **Usage Data**: Yes (app interactions)
     - **Diagnostics**: Yes (crash reports)

4. **For each data type you collect**, specify:
   - **Purpose**: App Functionality, Analytics, etc.
   - **Linked to User**: No (anonymous)
   - **Used for Tracking**: No

---

## 📱 Screenshots & App Preview

### Step 5: App Store Screenshots

You need screenshots for different device sizes. Here's what you need:

**Required Screenshots:**
- **iPhone 6.7" Display** (iPhone 14 Pro Max, 15 Plus, etc.): 3-10 screenshots
- **iPhone 6.5" Display** (iPhone 11 Pro Max, XS Max, etc.): 3-10 screenshots
- **iPhone 5.5" Display** (iPhone 8 Plus, 7 Plus, etc.): 3-10 screenshots

**Recommended Screenshots:**
1. **Main search screen** - showing the food search interface
2. **Search results** - showing a safe food result (green)
3. **Search results** - showing a caution food result (yellow/orange)
4. **About screen** - showing app information and subscription status
5. **Subscription modal** - showing premium features
6. **Premium features** - showing detailed analysis feature

**Screenshot Requirements:**
- **Format**: PNG or JPEG
- **Resolution**: High resolution (at least 1242 x 2688 for 6.7")
- **Content**: Must show actual app content, not mockups
- **No text overlays** or promotional content
- **No device frames** or bezels

### Step 6: App Preview (Optional but Recommended)

Create a 15-30 second video showing your app in action:
- **Format**: MP4 or MOV
- **Duration**: 15-30 seconds
- **Content**: Show the main user flow (search → results → premium features)
- **No sound** required
- **No text overlays**

---

## 💰 In-App Purchase Setup

### Step 7: Prerequisites for In-App Purchases

**Before creating subscriptions, ensure you have:**

1. **Paid Applications Agreement**:
   - Go to **Agreements, Tax, and Banking** in App Store Connect
   - Accept the **Paid Applications Agreement**
   - Complete all required banking and tax information

2. **App Status**:
   - Your app must be in **"Prepare for Submission"** state
   - At least one in-app purchase must be **"Ready to Submit"**

### Step 8: Create Subscription Group

1. **In App Store Connect**, go to **Features** → **Subscriptions**
2. **Click the "+" button** to create a new subscription group
3. **Fill in the details**:
   - **Reference Name**: CanIEat Premium Subscriptions (internal use only)
   - **App Store Display Name**: CanIEat Premium (visible to users)

### Step 9: Create Monthly Subscription

1. **Within your subscription group**, click **"+"** to add a new subscription
2. **Fill in the basic details**:
   - **Reference Name**: CanIEat Premium Monthly
   - **Product ID**: `com.grsdev.canieat.subscription.monthly` ⚠️ **Must match exactly**

3. **Configure the subscription**:
   - **Subscription Duration**: 1 Month
   - **Price**: Choose your price tier (e.g., $4.99)
   - **Availability**: Select all countries/regions where your app is available

4. **App Store Localization**:
   - **Display Name**: CanIEat Premium Monthly
   - **Description**: Monthly access to all premium features including detailed food analysis, personalized recommendations, and unlimited searches.

5. **Review Information**:
   - **Screenshot**: Upload a screenshot showing the subscription modal in your app
   - **Review Notes**: "Monthly subscription for CanIEat premium features"

### Step 10: Create Annual Subscription

1. **Click "+" again** within the same subscription group
2. **Fill in the basic details**:
   - **Reference Name**: CanIEat Premium Annual
   - **Product ID**: `com.grsdev.canieat.subscription.annual` ⚠️ **Must match exactly**

3. **Configure the subscription**:
   - **Subscription Duration**: 1 Year
   - **Price**: Choose your price tier (e.g., $49.99)
   - **Availability**: Select all countries/regions where your app is available

4. **App Store Localization**:
   - **Display Name**: CanIEat Premium Annual
   - **Description**: Annual access to all premium features - Best Value! Includes detailed food analysis, personalized recommendations, and unlimited searches.

5. **Review Information**:
   - **Screenshot**: Upload a screenshot showing the subscription modal in your app
   - **Review Notes**: "Annual subscription for CanIEat premium features"

### Step 11: Add Free Trial (Introductory Offer)

1. **For each subscription**, go to the **"Introductory Offers"** section
2. **Click "Create Introductory Offer"**
3. **Configure the offer**:
   - **Offer Type**: Free Trial
   - **Duration**: 7 days
   - **Eligibility**: All users
   - **Countries/Regions**: All countries where your app is available
   - **Start Date**: Today
   - **End Date**: No end date (or set a specific end date)

4. **Save the offer**

### Step 12: Submit Subscriptions for Review

1. **Ensure each subscription status is "Ready to Submit"**
2. **Select each subscription product**
3. **Click "Submit for Review"**
4. **Wait for Apple's approval** (usually 24-48 hours)

### Step 13: Link Subscriptions to App Version

1. **Go to your app's App Store tab**
2. **Scroll down to "In-App Purchases and Subscriptions"**
3. **Click "Manage"**
4. **Select your subscription products** to include with this app version
5. **Save the changes**

---

## 📤 Upload IPA to App Store Connect

### Step 14: Update EAS Configuration

First, update your `eas.json` with the correct App Store Connect App ID:

1. **Open `eas.json`** in your project
2. **Replace the placeholder values**:

```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "ogorskikh@gmail.com",
        "ascAppId": "YOUR_ACTUAL_APP_STORE_CONNECT_APP_ID",
        "appleTeamId": "J7BY3YY43H"
      }
    }
  }
}
```

Replace `YOUR_ACTUAL_APP_STORE_CONNECT_APP_ID` with the number you got from Step 2.

### Step 15: Submit Using EAS

1. **Open Terminal** in your project directory
2. **Run the submit command**:

```bash
eas submit --platform ios --latest
```

3. **Follow the prompts**:
   - **Select build**: Choose the latest production build
   - **Apple ID**: ogorskikh@gmail.com
   - **App Store Connect App ID**: Enter the ID from Step 2
   - **Apple Team ID**: J7BY3YY43H

4. **Wait for upload** (usually 5-10 minutes)

### Alternative: Manual Upload via App Store Connect

If EAS Submit doesn't work, you can upload manually:

1. **Download your IPA** from the EAS build link
2. **Go to App Store Connect** → **TestFlight**
3. **Click "+"** and select **"iOS App"**
4. **Upload your IPA file**
5. **Wait for processing** (10-30 minutes)

---

## 📋 App Review Submission

### Step 16: Prepare for Review

1. **In App Store Connect**, go to your app's **App Store** tab
2. **Fill in all required sections**:

   **App Information:**
   - ✅ App Information (completed in Step 3)
   - ✅ App Privacy (completed in Step 4)
   - ✅ Age Rating (completed in Step 3)

   **Pricing and Availability:**
   - ✅ Pricing and Availability (completed in Step 3)

   **App Store:**
   - ✅ App Information
   - ✅ Screenshots (completed in Step 5)
   - ✅ App Preview (optional, completed in Step 6)
   - ✅ App Review Information
   - ✅ Version Information

### Step 17: App Review Information

1. **Go to App Review Information**
2. **Fill in the required fields**:

   **Contact Information:**
   - **First Name**: Your first name
   - **Last Name**: Your last name
   - **Phone Number**: Your phone number
   - **Email**: ogorskikh@gmail.com

   **Demo Account** (if your app requires login):
   - **User Name**: (leave blank if not needed)
   - **Password**: (leave blank if not needed)

   **Notes:**
   ```
   CanIEat is a pregnancy food safety guide that helps expectant mothers make informed decisions about food safety during pregnancy. The app uses AI to provide instant, reliable guidance based on official UK government medical guidelines.

   Key Features:
   - Instant food safety checks
   - AI-powered recommendations
   - Premium detailed analysis
   - Subscription-based monetization

   The app is designed to be a helpful tool for pregnant women and should be approved for the Medical category.
   ```

### Step 18: Version Information

1. **Go to Version Information**
2. **Fill in the details**:

   **What's New in This Version:**
   ```
   🎉 CanIEat is now available on the App Store!

   ✨ Features:
   - AI-powered food safety guidance for pregnancy
   - Instant recommendations based on UK medical guidelines
   - Premium detailed analysis with subscription
   - Beautiful, intuitive interface
   - Comprehensive food database

   🔒 Privacy-focused: Your searches are processed securely and not stored permanently.

   Perfect for expectant mothers who want reliable, instant food safety guidance!
   ```

   **Keywords** (comma-separated, max 100 characters):
   ```
   pregnancy,food safety,medical,health,nutrition,AI,guidance
   ```

   **Support URL**: https://your-website.com/support (or create a simple support page)
   **Marketing URL**: https://your-website.com (optional)

### Step 19: Submit for Review

1. **Review all sections** to ensure they're complete (green checkmarks)
2. **Click "Submit for Review"**
3. **Confirm submission**
4. **Wait for Apple's review** (typically 24-48 hours)

---

## 🎉 Post-Publication

### Step 20: Monitor Your App

1. **Check App Store Connect** regularly for:
   - Review status updates
   - User reviews and ratings
   - Crash reports
   - Analytics data

2. **Respond to reviews** (optional but recommended)

3. **Monitor subscription metrics**:
   - Go to **Analytics** → **Subscriptions**
   - Track conversion rates, churn, revenue

### Step 21: Update Your App

When you need to update your app:

1. **Make your changes** in the code
2. **Update version number** in `app.json`
3. **Build new production version**:
   ```bash
   eas build --platform ios --profile production
   ```
4. **Submit the update**:
   ```bash
   eas submit --platform ios --latest
   ```
5. **Update App Store Connect** with new features/changes

---

## 🚨 Important Notes

### Product IDs Must Match Exactly
The Product IDs in your app code must exactly match those in App Store Connect:
- Monthly: `com.grsdev.canieat.subscription.monthly`
- Annual: `com.grsdev.canieat.subscription.annual`

### Testing Before Release
1. **Test on TestFlight** first
2. **Test in-app purchases** in sandbox mode
3. **Verify all features work** correctly

### Legal Requirements
- **Privacy Policy**: Required for apps that collect data
- **Terms of Service**: Recommended for subscription apps
- **Medical Disclaimer**: Important for health-related apps

### Support
- **App Store Connect Help**: https://developer.apple.com/help/app-store-connect/
- **EAS Documentation**: https://docs.expo.dev/build/introduction/

---

## 📞 Need Help?

If you encounter any issues:

1. **Check App Store Connect** for error messages
2. **Review EAS build logs** for build issues
3. **Test on TestFlight** before submitting to review
4. **Contact Apple Developer Support** for App Store Connect issues

---

**Good luck with your App Store submission! 🍀**

Remember: The review process can take 24-48 hours, so be patient. Once approved, your app will be live on the App Store! 🎊
