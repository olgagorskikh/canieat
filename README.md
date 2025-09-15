# 🍓 CanIEat - Pregnancy Food Safety Guide

**CanIEat** is an AI-powered mobile application designed specifically for pregnant women to check food safety based on official UK government medical guidelines.

## 📱 Features

- **Instant Food Safety Checks**: Get immediate guidance on whether specific foods are safe during pregnancy
- **UK Government Guidelines**: All recommendations based on official NHS, FSA, and UK government medical advice
- **AI-Powered Analysis**: Advanced language models trained on medical literature provide accurate, up-to-date information
- **User-Friendly Interface**: Simple search interface with clear, actionable results
- **Comprehensive Information**: Detailed explanations and additional safety tips

## 🛡️ Medical Disclaimer

This app provides general guidance only and is not a substitute for professional medical advice. Always consult your healthcare provider, midwife, or doctor for personalized medical advice during pregnancy.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Expo CLI
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/olgagorskikh/canieat.git
   cd canieat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your OpenAI API key
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on your device**
   - Install Expo Go on your iPhone/Android
   - Scan the QR code from the terminal
   - Your app will load on your device

## 📱 Testing on iPhone

1. **Install Expo Go** from the App Store
2. **Run `npm start`** in your project directory
3. **Scan the QR code** with your iPhone camera
4. **Open in Expo Go** when prompted

## 🏗️ Building for Production

### iOS App Store

1. **Configure EAS**
   ```bash
   eas build:configure
   ```

2. **Build for iOS**
   ```bash
   eas build --platform ios --profile production
   ```

3. **Submit to App Store**
   ```bash
   eas submit --platform ios
   ```

## 📋 Project Structure

```
canieat/
├── app/                    # App screens and navigation
│   ├── (tabs)/            # Tab-based navigation
│   │   ├── index.tsx      # Main search screen
│   │   └── about.tsx      # About and information screen
│   └── _layout.tsx        # Root layout
├── services/              # API services
│   └── openaiService.ts   # OpenAI integration
├── assets/               # Images and icons
├── app.json             # Expo configuration
└── package.json         # Dependencies
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
```

### App Configuration

Key settings in `app.json`:
- **Bundle Identifier**: `com.grsdev.canieat`
- **App Name**: CanIEat
- **Version**: 1.0.0

## 📚 Official Sources

All recommendations are based on:
- [NHS Pregnancy Guidelines](https://www.nhs.uk/pregnancy/keeping-well/foods-to-avoid/)
- [UK Government Medical Advice](https://www.gov.uk/government/publications/advice-on-eating-fish-when-trying-to-get-pregnant-or-pregnant-and-breastfeeding)
- [Food Standards Agency Guidelines](https://www.food.gov.uk/safety-hygiene/food-safety-and-pregnancy)
- [Royal College of Obstetricians and Gynaecologists](https://www.rcog.org.uk/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👩‍💻 Developer

**Olga Gorskikh** - [@olgagorskikh](https://github.com/olgagorskikh)

## 🙏 Acknowledgments

- UK Government medical guidelines
- NHS pregnancy advice
- Food Standards Agency
- OpenAI for AI capabilities
- Expo team for the amazing framework

---

**Made with ❤️ for expecting mothers**

*Always prioritize your health and consult healthcare professionals*