# iPad Crash Fixes

## Issues Addressed

The app was experiencing crashes on iPad Air devices due to:

1. **Hermes JavaScript Engine GC Crashes** (Previous - Fixed)
   - String allocation issues during garbage collection
   - Memory pressure during string operations (split, slice, concat)

2. **React Native Exception Handler Crashes** (Previous - Fixed)
   - Exception manager itself crashing when handling errors
   - Cascading failures in error reporting

3. **Memory Constraints on iPad Devices** (Previous - Fixed)
   - Large string allocations triggering out-of-memory conditions
   - Insufficient GC between operations

4. **CoreText Text Layout Crashes** (Latest - Feb 2026)
   - Crash in `TLine::LinkRunsWithOrder` during text rendering
   - Complex emoji rendering causing layout engine failures
   - Long text blocks (1500+ chars) with multiple emojis
   - Specific to iPad Air 11-inch (M3) on iPadOS 26.2
   - Triggered when tapping "Search dish" and displaying results

## Solutions Implemented

### 1. Metro Configuration (`metro.config.js`)
- Added Hermes-optimized minification settings
- Disabled aggressive compression that causes GC issues
- ASCII-only output to prevent Unicode-related crashes
- Inline requires for better memory management

### 2. App Configuration (`app.json`)
- Explicitly set `jsEngine: "hermes"` for iOS
- Added iOS background mode configurations
- Optimized for tablet compatibility

### 3. Memory-Safe String Operations (`utils/stringUtils.ts`)
- Replaced `substring()` with `slice()` (better Hermes performance)
- Added hard limits on string sizes (5000 chars max for iPad)
- Defensive error handling with minimal logging
- Early returns to prevent unnecessary processing

### 4. Memory Management Utilities (`utils/memoryUtils.ts`)
- `chunkString()`: Break large strings into manageable chunks
- `processInChunks()`: Process arrays without memory spikes
- `safeConcat()`: Safe string concatenation with size limits
- `requestGarbageCollection()`: Force GC on iOS when needed

### 5. Enhanced Error Boundary (`components/ErrorBoundary.tsx`)
- Detects and auto-recovers from layout/memory errors
- Safe error logging without causing additional crashes
- Requests GC after catching errors
- Retry mechanism with limits

### 6. OpenAI Service Optimization (`services/openaiService.ts`)
- Limited response sizes to 5000 characters
- Uses `slice()` instead of regex matching for better performance
- Requests GC before and after large operations
- Clears large strings from memory explicitly
- Replaced string concatenation with safer alternatives

### 7. Device Detection and Tablet-Safe Rendering (`utils/deviceUtils.ts`)
- `isTablet()`: Detect iPad devices based on screen size and aspect ratio
- `splitTextForRendering()`: Split long text into 350-char chunks at natural boundaries
- `simplifyTextForTablet()`: Replace complex emojis with simple text equivalents
  - `✅` → `[SAFE]`
  - `❌` → `[NOT RECOMMENDED]`
  - `🔒` → `[PREMIUM]`
  - `💰`, `💡`, `⏰`, etc. → Plain text

### 8. Updated Search Screen (`app/(tabs)/index.tsx`)
- Added tablet detection on mount
- Replaced emoji-heavy text with plain text on tablets
- Split result text into multiple Text components (350 chars each)
- Conditional banner text based on device type
- Prevents CoreText layout crashes by reducing text complexity

### 9. Updated About Screen (`app/(tabs)/about.tsx`)
- Conditional emoji rendering based on device type
- Simpler text for all sections on tablets
- Maintains visual appeal on iPhones while ensuring stability on iPads

## Testing Checklist

Before submitting to App Store:

- [ ] Test on iPad Air 5th gen (iPad15,3) specifically
- [ ] Test on iPad Air 11-inch (M3) on iPadOS 26.2
- [ ] Test with long food item names (100+ characters)
- [ ] Test rapid consecutive searches (10+ in a row)
- [ ] Test with poor network conditions (slow AI responses)
- [ ] Monitor memory usage in Xcode Instruments
- [ ] Verify no crashes after 30+ searches
- [ ] Test all orientations on iPad
- [ ] Test with low memory warnings
- [ ] Verify text rendering on iPad displays correctly without emojis
- [ ] Test with long AI responses (1000+ chars)
- [ ] Verify text chunks render properly on tablets

## Build Commands

```bash
# Clean and rebuild
rm -rf node_modules .expo ios/build
npm install

# Test locally
npx expo start --clear

# Build for production
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios --latest
```

## Monitoring

Key metrics to watch in App Store Connect:
- Crash rate on iPad devices
- Memory warnings
- Hermes GC crashes
- Exception handler failures

Target: < 0.1% crash rate on all iPad models

## Additional Recommendations

1. **Future Optimization**: Consider implementing response streaming instead of full responses
2. **Caching**: Cache common food items to reduce API calls
3. **Lazy Loading**: Implement virtual scrolling for search history
4. **Bundle Size**: Monitor JavaScript bundle size (target < 2MB)

## References

- Hermes Performance: https://hermesengine.dev/docs/performance
- React Native Memory Management: https://reactnative.dev/docs/performance
- iOS Memory Best Practices: https://developer.apple.com/documentation/xcode/reducing-your-app-s-memory-footprint
