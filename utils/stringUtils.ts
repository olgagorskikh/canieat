/**
 * Safe string utilities to prevent crashes from string operations
 * Optimized for Hermes GC and iPad memory constraints
 */

/**
 * Safely converts any value to a string with length limits
 * Prevents Hermes GC crashes from large string allocations
 */
export function safeString(value: any, maxLength: number = 1000, fallback: string = ''): string {
  try {
    // Early return for null/undefined
    if (value === null || value === undefined) {
      return fallback;
    }
    
    // Handle already-string values efficiently
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed.length === 0) {
        return fallback;
      }
      // Use slice instead of substring for better Hermes performance
      return trimmed.length > maxLength ? trimmed.slice(0, maxLength) + '...' : trimmed;
    }
    
    // Convert to string safely
    const str = String(value).trim();
    if (str.length === 0) {
      return fallback;
    }
    
    // Prevent large allocations that trigger GC issues
    const effectiveMax = Math.min(maxLength, 5000); // Hard limit for iPad
    return str.length > effectiveMax ? str.slice(0, effectiveMax) + '...' : str;
  } catch (error) {
    // Avoid string concatenation in error logging
    console.error('safeString error');
    return fallback;
  }
}

/**
 * Safely check if a string includes a substring
 * Prevents crashes from null/undefined values
 */
export function safeIncludes(str: string | null | undefined, searchString: string): boolean {
  try {
    if (!str || typeof str !== 'string') {
      return false;
    }
    if (!searchString || typeof searchString !== 'string') {
      return false;
    }
    return str.includes(searchString);
  } catch (error) {
    console.error('Error in safeIncludes:', error);
    return false;
  }
}
