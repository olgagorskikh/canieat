/**
 * Memory utilities to prevent iPad crashes
 * Helps manage Hermes GC and prevent memory pressure issues
 */

import { Platform } from 'react-native';

/**
 * Chunk large strings to prevent GC issues
 * Especially important for iPad devices with Hermes
 */
export function chunkString(str: string, chunkSize: number = 1000): string[] {
  if (!str || typeof str !== 'string') {
    return [];
  }
  
  const chunks: string[] = [];
  const effectiveChunkSize = Math.min(chunkSize, 2000); // Limit for iPad safety
  
  try {
    for (let i = 0; i < str.length; i += effectiveChunkSize) {
      chunks.push(str.slice(i, i + effectiveChunkSize));
    }
  } catch (error) {
    console.error('chunkString error');
    return [str.slice(0, 1000)]; // Return safe fallback
  }
  
  return chunks;
}

/**
 * Process large text in chunks to avoid GC pressure
 */
export function processInChunks<T>(
  items: T[],
  processor: (item: T) => void,
  chunkSize: number = 10
): void {
  if (!items || !Array.isArray(items)) {
    return;
  }
  
  const effectiveChunkSize = Math.min(chunkSize, 50);
  
  for (let i = 0; i < items.length; i += effectiveChunkSize) {
    const chunk = items.slice(i, i + effectiveChunkSize);
    chunk.forEach(processor);
    
    // Allow GC to run between chunks on iPad
    if (Platform.OS === 'ios' && global.gc) {
      try {
        global.gc();
      } catch (e) {
        // GC not available
      }
    }
  }
}

/**
 * Safe string concatenation that prevents memory spikes
 */
export function safeConcat(...strings: (string | null | undefined)[]): string {
  try {
    const filtered = strings.filter((s): s is string => 
      typeof s === 'string' && s.length > 0
    );
    
    // Prevent creating extremely large strings
    const totalLength = filtered.reduce((sum, s) => sum + s.length, 0);
    if (totalLength > 10000) {
      console.warn('safeConcat: string too large, truncating');
      return filtered.map(s => s.slice(0, 1000)).join('');
    }
    
    return filtered.join('');
  } catch (error) {
    console.error('safeConcat error');
    return '';
  }
}

/**
 * Request GC on low memory conditions (iOS)
 */
export function requestGarbageCollection(): void {
  if (Platform.OS === 'ios' && global.gc) {
    try {
      global.gc();
    } catch (error) {
      // GC not available
    }
  }
}
