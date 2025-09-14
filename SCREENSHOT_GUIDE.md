# 📱 App Store Screenshot Guide for CanIEat

## Required Screenshots

You need to take screenshots of your app running on different iPhone sizes. Here's how to do it:

### Method 1: Using iOS Simulator (Recommended)

#### 1. Open iOS Simulator
```bash
# Start your app
npm start

# Press 'i' to open iOS simulator
# Or run: npx expo run:ios
```

#### 2. Take Screenshots
- **iPhone 14 Pro Max** (6.7"): Device → Screenshot → iPhone 14 Pro Max
- **iPhone 11 Pro Max** (6.5"): Device → Screenshot → iPhone 11 Pro Max  
- **iPhone 8 Plus** (5.5"): Device → Screenshot → iPhone 8 Plus

#### 3. Screenshot Content
Take screenshots of these screens:

**Screenshot 1: Main Search Screen**
- Show the search input field
- Show a sample search result
- Highlight the AI-powered recommendations

**Screenshot 2: About Screen**
- Show the medical disclaimer
- Show UK government references
- Highlight the professional medical basis

**Screenshot 3: Search Results**
- Show a "safe to eat" result
- Show a "not recommended" result
- Demonstrate the detailed explanations

### Method 2: Using Physical iPhone

#### 1. Install on Your iPhone
- Scan the QR code with Expo Go
- Test all functionality
- Take screenshots using iPhone's screenshot feature

#### 2. Screenshot Sizes
- **iPhone 14 Pro Max**: 1290 x 2796 pixels
- **iPhone 11 Pro Max**: 1242 x 2688 pixels
- **iPhone 8 Plus**: 1242 x 2208 pixels

## Screenshot Tips

### ✅ Good Screenshots
- Show the app in use (not just empty screens)
- Include sample data/results
- Use clear, readable text
- Show key features prominently
- Use consistent styling

### ❌ Avoid
- Empty or blank screens
- Placeholder text
- Crashed or error states
- Personal information
- Blurry or low-quality images

## Sample Screenshot Content

### Screenshot 1: "Search for Food Safety"
```
🍓 CanIEat - Pregnancy Food Safety

[Search Box: "Can I eat sushi?"]

✅ YES - You can eat sushi during pregnancy, but with important precautions:

• Choose reputable restaurants with fresh fish
• Avoid raw fish in the first trimester
• Ensure fish is properly frozen before preparation
• Limit consumption to 2-3 servings per week

Based on UK government medical guidelines for pregnancy nutrition.

[Search Button]
```

### Screenshot 2: "Trusted Medical Information"
```
🍓 About CanIEat

This app provides guidance based on official UK government medical instructions for pregnancy nutrition.

📋 Sources:
• NHS Pregnancy Guidelines
• UK Government Medical Advice
• Royal College of Obstetricians and Gynaecologists

⚠️ Important:
This app provides general guidance only. Always consult your healthcare provider or midwife for personalized medical advice.

[Back to Search]
```

### Screenshot 3: "Comprehensive Safety Info"
```
🍓 Search Results

❌ NO - Avoid soft cheeses during pregnancy

Reason: Soft cheeses may contain listeria bacteria, which can be harmful during pregnancy.

Additional Info:
• Choose hard cheeses instead
• Check labels for pasteurization
• When in doubt, avoid

Based on UK government medical guidelines.

[New Search]
```

## File Organization

Create a folder structure:
```
app-store-assets/
├── screenshots/
│   ├── iphone-6.7/
│   │   ├── screenshot-1.png
│   │   ├── screenshot-2.png
│   │   └── screenshot-3.png
│   ├── iphone-6.5/
│   │   ├── screenshot-1.png
│   │   ├── screenshot-2.png
│   │   └── screenshot-3.png
│   └── iphone-5.5/
│       ├── screenshot-1.png
│       ├── screenshot-2.png
│       └── screenshot-3.png
└── app-preview/
    └── preview-video.mp4 (optional)
```

## Upload to App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Select your app
3. Go to "App Store" tab
4. Scroll to "App Screenshots"
5. Upload screenshots for each device size
6. Add captions if desired

## Pro Tips

### Make Screenshots Stand Out
- Use the strawberry icon prominently
- Show the app's clean, medical-focused design
- Highlight the UK government credibility
- Emphasize the AI-powered features

### Test Different Scenarios
- Safe foods (green checkmarks)
- Unsafe foods (red X marks)
- Foods with precautions (yellow warnings)
- Different types of foods (dairy, meat, seafood, etc.)

### Quality Checklist
- [ ] High resolution (crisp and clear)
- [ ] Proper aspect ratio
- [ ] Good contrast and readability
- [ ] Shows app functionality
- [ ] Professional appearance
- [ ] No personal information
- [ ] Consistent with app design

---

**Ready to take screenshots? Start with the iOS Simulator method!** 📸
