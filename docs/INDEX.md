# 📚 Documentation Index

Quick access to all documentation for CanIEat.

---

## 📖 **Developer Documentation**

### Core Architecture
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - **⭐ Main architecture guide**
  - Complete project walkthrough
  - Layer-by-layer breakdown
  - Code examples and data flows
  - Mobile development concepts for web developers

### Security & Backend
- **[SECURITY_MIGRATION.md](./SECURITY_MIGRATION.md)** - **⭐ Security update (Feb 2026)**
  - OpenAI API key protection
  - Backend API migration
  - Complete removal of direct API calls
  - Key rotation instructions

- **[BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md)** - Backend integration guide
  - How backend API works
  - Configuration details
  - Testing and monitoring
  - Troubleshooting

**Backend Documentation:** See `/backend/docs/` for complete backend setup guide

### Performance & Crash Fixes
- **[CORETEXT_CRASH_FIX.md](./CORETEXT_CRASH_FIX.md)** - **⭐ Latest fix (Feb 2026)**
  - CoreText text layout crash on iPad Air 11-inch (M3)
  - Emoji rendering optimization
  - Device-specific text handling
  - Technical analysis of crash logs

- **[IPAD_FIX_README.md](./IPAD_FIX_README.md)** - Previous iPad crash fixes
  - Hermes GC optimization
  - Memory management strategies
  - Testing checklist

---

## 🍎 **App Store Documentation**

- **[APP_STORE_PUBLICATION_GUIDE.md](./APP_STORE_PUBLICATION_GUIDE.md)** - Publishing workflow
- **[APP_STORE_RESUBMISSION_CHECKLIST.md](./APP_STORE_RESUBMISSION_CHECKLIST.md)** - Resubmission checklist
- **[APP_STORE_METADATA_GUIDE.md](./APP_STORE_METADATA_GUIDE.md)** - Metadata & screenshots
- **[APP_STORE_REVIEW_INSTRUCTIONS.md](./APP_STORE_REVIEW_INSTRUCTIONS.md)** - ⭐ Trial testing guide for reviewers
- **[APP_STORE_CONNECT_REPLY.txt](./APP_STORE_CONNECT_REPLY.txt)** - ⭐ Ready-to-paste reply message

---

## ⚖️ **Legal Pages**

- **[PRIVACY_POLICY.md](./PRIVACY_POLICY.md)** - Privacy policy (markdown source)
- **[privacy-policy.html](./privacy-policy.html)** - Privacy policy (public web page)
- **[support.html](./support.html)** - Support contact page

---

## 🐛 **Crash Reports**

Historical crash reports from App Store reviews:
- **crashlogs/cl_1.ips** - CoreText text layout crash (iPad Air 11-inch M3)
- **crashlogs/cl_2.ips** - CoreText text layout crash (iPad Air 11-inch M3)

**Status:** ✅ Fixed (see CORETEXT_CRASH_FIX.md and IPAD_FIX_README.md)

---

## 🚀 **Quick Start**

### For Developers
1. Read **[ARCHITECTURE.md](./ARCHITECTURE.md)** for complete understanding
2. Review **[SECURITY_MIGRATION.md](./SECURITY_MIGRATION.md)** for backend setup
3. Check **[IPAD_FIX_README.md](./IPAD_FIX_README.md)** and **[CORETEXT_CRASH_FIX.md](./CORETEXT_CRASH_FIX.md)** for performance optimizations

### For Publishing
1. Follow **[APP_STORE_PUBLICATION_GUIDE.md](./APP_STORE_PUBLICATION_GUIDE.md)**
2. Use **[APP_STORE_RESUBMISSION_CHECKLIST.md](./APP_STORE_RESUBMISSION_CHECKLIST.md)** before each submission
3. Review **[APP_STORE_REVIEW_INSTRUCTIONS.md](./APP_STORE_REVIEW_INSTRUCTIONS.md)** for trial testing setup

---

## 📂 File Organization

```
docs/
├── INDEX.md                              ← You are here
├── README.md                             ← Quick overview
│
├── 🏗️ Architecture
│   └── ARCHITECTURE.md                   ← Main dev guide ⭐
│
├── 🔐 Security (Feb 2026)
│   ├── SECURITY_MIGRATION.md            ← Security update ⭐
│   └── BACKEND_INTEGRATION.md           ← Backend integration
│
├── 🛠️ Performance & Crash Fixes
│   ├── CORETEXT_CRASH_FIX.md           ← Latest iPad fix (Feb 2026) ⭐
│   ├── IPAD_FIX_README.md              ← Previous iPad fixes
│   └── crashlogs/                       ← Historical crash reports
│       ├── cl_1.ips
│       └── cl_2.ips
│
├── 🍎 App Store
│   ├── APP_STORE_REVIEW_INSTRUCTIONS.md ⭐
│   ├── APP_STORE_PUBLICATION_GUIDE.md
│   ├── APP_STORE_RESUBMISSION_CHECKLIST.md
│   └── APP_STORE_METADATA_GUIDE.md
│
└── ⚖️ Legal
    └── PRIVACY_POLICY.md
```

**Backend Documentation:**
```
/backend/docs/
├── INDEX.md                   ← Backend docs index
├── DEPLOYMENT.md              ← Deployment guide ⭐
├── QUICK_START.md             ← 5-minute setup
└── PROJECT_STRUCTURE.md       ← Backend architecture
```

---

## 🆕 What's New (February 2026)

### Security Update
- ✅ **[SECURITY_MIGRATION.md](./SECURITY_MIGRATION.md)** - Complete removal of OpenAI direct calls
- ✅ **[BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md)** - Backend API integration
- ✅ Backend deployed on GCP Cloud Run
- ✅ API key fully protected

### Latest Crash Fix
- ✅ **[CORETEXT_CRASH_FIX.md](./CORETEXT_CRASH_FIX.md)** - Fixed text rendering crash on iPad Air 11-inch (M3)
- ✅ Device-specific emoji handling
- ✅ Text chunking for complex layouts

---

*Last updated: February 21, 2026*
