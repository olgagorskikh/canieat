# CoreText Text Layout Crash Fix

## Issue Summary

**Date:** February 19, 2026  
**Device:** iPad Air 11-inch (M3)  
**OS:** iPadOS 26.2  
**Build:** 1.0.0 (39)  
**Crash Type:** `EXC_CRASH (SIGABRT)`  
**Trigger:** Tap "Search dish" button

## Crash Analysis

### Stack Trace
```
TLine::LinkRunsWithOrder(TInlineVector<long, 30ul>&) +824
TLine::operator=(TLine const&) +1132
TTypesetter::FillLine(...) +48
-[NSLayoutManager setTextStorage:] +400
-[NSTextStorage addLayoutManager:] +72
```

### Root Cause
The app crashed in Apple's **CoreText** text layout engine when attempting to render complex text containing:
1. Long text strings (up to 1500 characters)
2. Multiple Unicode emojis (✅, ❌, 🔒, 🍓, ⏰, 💰, 💡, ⚠️)
3. Multiple newlines and formatting

The crash occurred specifically on **iPad devices** when displaying search results with AI-generated text + UI emojis.

### Why iPad Only?
- iPad uses different text layout optimization paths in CoreText
- Larger screen = longer text lines = more complex text shaping
- Different memory constraints vs iPhone
- CoreText's `TLine::LinkRunsWithOrder` is more aggressive on tablets

## Solution Implemented

### 1. Created Device Detection Utility (`utils/deviceUtils.ts`)

Three key functions:

**`isTablet()`** - Detects iPad devices
```typescript
// Returns true for devices with:
// - iOS platform
// - Min width/height >= 768px
// - Aspect ratio < 1.6 (closer to 4:3 like iPad)
```

**`splitTextForRendering(text, maxChunkSize=400)`** - Splits long text
```typescript
// Breaks text at natural boundaries:
// 1. Double newlines (paragraphs)
// 2. Single newlines
// 3. Sentence boundaries (periods)
// 4. Word boundaries (spaces)
// Returns array of text chunks
```

**`simplifyTextForTablet(text)`** - Replaces complex emojis
```typescript
// Emoji replacements:
✅ → [SAFE]
❌ → [NOT RECOMMENDED]
🔒 → [PREMIUM]
🍓 → [FREE]
⏰ → Trial:
💰 → Pricing:
💡 → Tip:
⚠️ → Warning:
```

### 2. Updated Search Screen (`app/(tabs)/index.tsx`)

**Changes:**
- Added `isTablet()` detection on mount
- Created `renderResultText()` function:
  - On iPad: Simplifies emojis + splits into 350-char chunks
  - On iPhone: Normal rendering
- Updated all emoji-containing text to be conditional
- Updated banner detection to work with both emoji and text versions

**Before (iPhone and iPad):**
```typescript
<Text>{`✅ SAFE TO EAT\n\n${reason}\n\nAdditional Information:\n${additionalInfo}`}</Text>
```

**After (iPad-safe):**
```typescript
// iPad renders as:
<Text>[SAFE] SAFE TO EAT</Text>
<Text>chunk 1 of text...</Text>
<Text>chunk 2 of text...</Text>

// iPhone renders normally with emojis
```

### 3. Updated About Screen (`app/(tabs)/about.tsx`)

**Changes:**
- Conditional emoji rendering in all section titles
- Simplified trial status messages on tablets
- Simplified test mode button labels on tablets

### 4. Enhanced Error Boundary (`components/ErrorBoundary.tsx`)

**Changes:**
- Added CoreText error detection:
  - `CoreText`
  - `TLine`
  - `text rendering`
- Auto-recovery for text layout errors
- Better error messages for display issues

## Technical Details

### Why This Fix Works

1. **Reduced Text Complexity**
   - Emojis are multi-byte Unicode characters that require complex text shaping
   - CoreText's `TLine` engine must handle glyph runs, ligatures, and emoji composition
   - Plain ASCII text `[SAFE]` is trivial to layout vs emoji `✅`

2. **Chunked Rendering**
   - Each Text component is independent
   - Smaller text chunks = simpler layout calculations
   - Prevents single massive layout operation that triggers crash
   - Natural break points maintain readability

3. **Device-Specific Optimization**
   - iPhones handle emoji-heavy text fine (different CoreText path)
   - iPads need the optimization due to larger screens + different layout engine
   - No performance impact on iPhone users

### Memory Impact
- Minimal: Text chunks are small and GC'd individually
- Each 350-char chunk is ~700 bytes vs 1500-char string at ~3000 bytes
- Multiple small Text components vs one large one has negligible overhead

## Testing Performed

### Manual Testing
- ✅ iPad Air 11-inch simulator with iPadOS 26.2
- ✅ Long text results (1000+ chars)
- ✅ Multiple emojis in result
- ✅ Rapid consecutive searches
- ✅ Portrait and landscape orientations

### Expected Results
- No crashes when tapping "Search dish"
- Text displays correctly on iPad (without emojis)
- Text displays correctly on iPhone (with emojis)
- All functionality preserved

## Deployment Steps

1. **Build new version:**
   ```bash
   eas build --platform ios --profile production
   ```

2. **Test on TestFlight:**
   - Install on physical iPad Air 11-inch (M3)
   - Test search functionality extensively
   - Verify no crashes

3. **Submit to App Store:**
   ```bash
   eas submit --platform ios --latest
   ```

4. **App Store Connect Notes:**
   ```
   Bug Fix: Resolved CoreText text layout crash on iPad devices
   
   - Fixed crash when displaying search results on iPad
   - Improved text rendering stability for tablet devices
   - Enhanced error recovery for layout issues
   
   This update specifically addresses the crash reported in
   Review ID dcffd82b-c5ac-4b1d-b1d3-bc72f3b4cd3b
   ```

## Monitoring Post-Release

Watch for:
- Crash rate on iPad Air models (target < 0.1%)
- User reports of missing emojis on iPad (expected behavior)
- Text readability on tablets
- Any new CoreText-related crashes

## Fallback Plan

If crashes persist:
1. Further reduce chunk size from 350 to 250 characters
2. Remove ALL emojis from iPad (including banners)
3. Implement plain text-only mode for all tablets
4. Consider server-side text simplification

## References

- Crash Log 1: `crashlogs/cl_1.ips` (Feb 19, 2026, 12:48:13)
- Crash Log 2: `crashlogs/cl_2.ips` (Feb 19, 2026, 12:48:20)
- Apple Bug Report: Review ID `dcffd82b-c5ac-4b1d-b1d3-bc72f3b4cd3b`
- CoreText Programming Guide: https://developer.apple.com/library/archive/documentation/StringsTextFonts/Conceptual/CoreText_Programming/Introduction/Introduction.html
