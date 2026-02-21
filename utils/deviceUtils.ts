import { Platform, Dimensions } from 'react-native';

/**
 * Detect if device is a tablet (iPad)
 */
export const isTablet = (): boolean => {
  const { width, height } = Dimensions.get('window');
  const aspectRatio = Math.max(width, height) / Math.min(width, height);
  
  // iPad detection: larger screen + aspect ratio closer to 4:3
  return Platform.OS === 'ios' && Math.min(width, height) >= 768 && aspectRatio < 1.6;
};

/**
 * Split text into smaller chunks for safer rendering on tablets
 * Breaks at natural boundaries (newlines, periods) to maintain readability
 */
export const splitTextForRendering = (text: string, maxChunkSize: number = 400): string[] => {
  if (!text || text.length <= maxChunkSize) {
    return [text];
  }

  const chunks: string[] = [];
  let currentPos = 0;

  while (currentPos < text.length) {
    let chunkEnd = currentPos + maxChunkSize;
    
    if (chunkEnd >= text.length) {
      chunks.push(text.slice(currentPos));
      break;
    }

    // Try to break at paragraph boundary (double newline)
    const doubleNewline = text.lastIndexOf('\n\n', chunkEnd);
    if (doubleNewline > currentPos) {
      chunkEnd = doubleNewline + 2;
    } else {
      // Try to break at single newline
      const singleNewline = text.lastIndexOf('\n', chunkEnd);
      if (singleNewline > currentPos) {
        chunkEnd = singleNewline + 1;
      } else {
        // Try to break at sentence boundary
        const period = text.lastIndexOf('. ', chunkEnd);
        if (period > currentPos) {
          chunkEnd = period + 2;
        }
        // Otherwise break at word boundary (space)
        else {
          const space = text.lastIndexOf(' ', chunkEnd);
          if (space > currentPos) {
            chunkEnd = space + 1;
          }
        }
      }
    }

    chunks.push(text.slice(currentPos, chunkEnd));
    currentPos = chunkEnd;
  }

  return chunks;
};

/**
 * Simplify text for tablet rendering by reducing emoji complexity
 * Replace multi-char emojis with simpler versions
 */
export const simplifyTextForTablet = (text: string): string => {
  if (!text) return text;
  
  // Replace emoji sequences that can cause CoreText issues
  // Keep simple single-char emojis but simplify complex ones
  return text
    .replace(/✅/g, '[SAFE]')
    .replace(/❌/g, '[NOT RECOMMENDED]')
    .replace(/🔒/g, '[PREMIUM]')
    .replace(/🍓/g, '[FREE]')
    .replace(/⏰/g, 'Trial:')
    .replace(/💰/g, 'Pricing:')
    .replace(/💡/g, 'Tip:')
    .replace(/🔍/g, '[PREMIUM:]')
    .replace(/⚠️/g, 'Warning:');
};
