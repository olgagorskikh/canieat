# 🍓 CanIEat App Store Publication Guide

## 📋 Prerequisites

### 1. Apple Developer Account
- **Cost**: $99/year (required for App Store)
- **Sign up**: Go to [developer.apple.com](https://developer.apple.com)
- **Individual Account**: Choose "Individual" (not Organization) since you don't have a company
- **Required Info**: 
  - Personal information
  - Credit card for payment
  - Phone verification

### 2. Development Tools
- **Xcode**: Latest version from Mac App Store (free)
- **EAS CLI**: `npm install -g eas-cli` (correct package name)
- **Expo Account**: Free account at [expo.dev](https://expo.dev)

## 🚀 Step-by-Step Publication Process

### Phase 1: Project Preparation

#### 1.1 Update App Configuration
```bash
# Install EAS CLI globally (correct package name)
npm install -g eas-cli

# Login to Expo
npx expo login

# Initialize EAS in your project
eas build:configure
```

#### 1.2 Configure App Store Settings
- Update `app.json` with production settings
- Set proper bundle identifier
- Configure app icons and splash screens
- Set up app store metadata

### Phase 2: Build Configuration

#### 2.1 EAS Build Setup
```bash
# Create production build
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios
```

#### 2.2 App Store Connect Setup
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Create new app
3. Fill in app information
4. Upload screenshots and metadata
5. Submit for review

### Phase 3: App Store Requirements

#### 3.1 Required Assets
- **App Icon**: 1024x1024px (already created)
- **Screenshots**: iPhone screenshots (6.7", 6.5", 5.5")
- **App Preview**: Optional video preview
- **App Description**: Clear, compelling description
- **Keywords**: Relevant search terms
- **Privacy Policy**: Required for apps with user data

#### 3.2 App Store Review Guidelines
- **Functionality**: App must work as described
- **Content**: Appropriate for all audiences
- **Design**: Follow Apple's Human Interface Guidelines
- **Privacy**: Clear privacy policy and data handling
- **Legal**: No copyright violations

## 📱 App Store Metadata Template

### App Name
**CanIEat - Pregnancy Food Safety**

### Subtitle
**Safe eating guide for expecting mothers**

### Description
```
🍓 CanIEat helps pregnant women make informed food choices based on UK government medical guidelines.

✅ FEATURES:
• AI-powered food safety analysis
• Based on official UK medical recommendations
• Simple search interface
• Comprehensive safety information
• Trusted by healthcare professionals

🛡️ SAFETY FIRST:
Our app provides guidance based on official UK government medical instructions for pregnancy nutrition, helping you avoid foods that may pose risks during pregnancy.

📋 HOW IT WORKS:
1. Search for any food or dish
2. Get instant safety recommendations
3. Read detailed explanations
4. Make informed decisions

⚠️ IMPORTANT:
This app provides general guidance only. Always consult your healthcare provider or midwife for personalized medical advice.

Perfect for expecting mothers who want to make safe, informed food choices during pregnancy.
```

### Keywords
```
pregnancy,food safety,nutrition,health,medical,UK guidelines,maternal health,prenatal care,midwife,doctor,advice
```

### Category
**Health & Fitness**

### Age Rating
**4+ (No Objectionable Content)**

## 🔧 Technical Configuration

### Bundle Identifier
`com.yourname.canieat` (replace "yourname" with your actual name/initials)

### Version
`1.0.0`

### Build Number
Start with `1`, increment for each build

## 📋 Pre-Submission Checklist

### ✅ App Functionality
- [ ] App launches without crashes
- [ ] Search functionality works
- [ ] AI responses are appropriate
- [ ] About screen displays correctly
- [ ] All navigation works

### ✅ App Store Assets
- [ ] 1024x1024 app icon
- [ ] iPhone screenshots (multiple sizes)
- [ ] App description written
- [ ] Keywords selected
- [ ] Privacy policy created

### ✅ Legal Requirements
- [ ] Privacy policy accessible
- [ ] Terms of service (if applicable)
- [ ] No copyright violations
- [ ] Appropriate age rating

### ✅ Technical Requirements
- [ ] App builds successfully
- [ ] No console errors
- [ ] Proper bundle identifier
- [ ] Correct version numbers
- [ ] EAS build configured

## 🎯 Timeline Estimate

### Week 1: Setup
- Apple Developer Account setup
- EAS configuration
- Project preparation

### Week 2: Build & Test
- Create production build
- Test on physical device
- Fix any issues

### Week 3: App Store Connect
- Create app listing
- Upload assets
- Submit for review

### Week 4: Review & Launch
- Apple review (typically 24-48 hours)
- Address any feedback
- App goes live!

## 💰 Costs Breakdown

- **Apple Developer Account**: $99/year
- **EAS Build**: Free tier available (limited builds)
- **Total First Year**: ~$99

## 🆘 Common Issues & Solutions

### Build Failures
- Check bundle identifier uniqueness
- Verify certificates and provisioning profiles
- Update dependencies

### App Store Rejection
- Read rejection reason carefully
- Address specific issues
- Resubmit with fixes

### Privacy Policy
- Required for apps that collect data
- Can be simple one-page document
- Must be accessible from app

## 📞 Support Resources

- **Expo Documentation**: [docs.expo.dev](https://docs.expo.dev)
- **Apple Developer**: [developer.apple.com](https://developer.apple.com)
- **App Store Connect Help**: [help.apple.com](https://help.apple.com)
- **EAS Build Support**: [expo.dev/support](https://expo.dev/support)

---

**Ready to start? Let's begin with Phase 1!** 🚀
