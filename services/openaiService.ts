/**
 * OpenAI Service - Food Safety Checker
 * 
 * SECURITY: This service uses a secure backend API exclusively.
 * OpenAI is NEVER called directly from the mobile app.
 * 
 * Benefits:
 * - ✅ OpenAI API key is never exposed to users
 * - ✅ Rate limiting prevents abuse (10 requests/15 min)
 * - ✅ Backend can log usage and block malicious requests
 * - ✅ Can cache common responses to reduce costs
 * - ✅ No risk of API key extraction from app bundle
 * 
 * Backend Configuration (Required):
 * - EXPO_PUBLIC_BACKEND_URL: Your GCP Cloud Run backend URL
 * - EXPO_PUBLIC_API_SECRET: Random secret for authentication
 * 
 * See: BACKEND_INTEGRATION.md for setup instructions
 */

import { Platform } from 'react-native';
import { safeString } from '../utils/stringUtils';
import { requestGarbageCollection } from '../utils/memoryUtils';

// Backend API configuration (REQUIRED)
const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
const API_SECRET = process.env.EXPO_PUBLIC_API_SECRET;

export interface FoodSafetyResponse {
  canEat: boolean;
  reason: string;
  additionalInfo?: string;
}


export async function checkFoodSafety(foodItem: string): Promise<FoodSafetyResponse> {
  // For web platform, use mock data
  if (Platform.OS === 'web') {
    return getMockFoodSafetyResponse(foodItem);
  }

  // Check backend is configured
  if (!BACKEND_URL || !API_SECRET) {
    console.error('Backend not configured. Set EXPO_PUBLIC_BACKEND_URL and EXPO_PUBLIC_API_SECRET in .env');
    return {
      canEat: false,
      reason: "Service temporarily unavailable. Please try again later.",
      additionalInfo: "If this issue persists, please update the app or contact support."
    };
  }

  // Use secure backend API exclusively
  return checkFoodSafetyViaBackend(foodItem);
}

/**
 * Call secure backend API instead of OpenAI directly
 * This protects your API key and adds rate limiting
 */
async function checkFoodSafetyViaBackend(foodItem: string): Promise<FoodSafetyResponse> {
  try {
    // Safely handle the food item with length limits
    const safeFoodItem = safeString(foodItem, 100, '').trim();
    
    if (!safeFoodItem) {
      return {
        canEat: false,
        reason: "Please provide a valid food item name.",
        additionalInfo: "Enter a food item to check its safety during pregnancy."
      };
    }

    // Call backend API
    const response = await fetch(`${BACKEND_URL}/api/check-food`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-secret': API_SECRET || '',
      },
      body: JSON.stringify({ foodItem: safeFoodItem }),
    });

    // Handle rate limiting
    if (response.status === 429) {
      return {
        canEat: false,
        reason: "Too many requests. Please try again in 15 minutes.",
        additionalInfo: "To prevent abuse, we limit searches to 10 per 15 minutes. Please wait and try again."
      };
    }

    // Handle authentication errors
    if (response.status === 401) {
      return {
        canEat: false,
        reason: "Authentication error. Please update the app.",
        additionalInfo: "Contact support if this issue persists."
      };
    }

    // Handle server errors
    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    // Parse response
    const data = await response.json();

    // Request GC after network call (helps iPad memory)
    requestGarbageCollection();

    // Validate response structure
    if (typeof data.canEat !== 'boolean') {
      throw new Error('Invalid response format');
    }

    // Return with safe string handling
    return {
      canEat: Boolean(data.canEat),
      reason: safeString(data.reason, 500, 'Unable to determine safety.'),
      additionalInfo: safeString(data.additionalInfo, 800, 'Consult your healthcare provider for personalized advice.')
    };

  } catch (error) {
    console.error('Error calling backend API:', error);
    
    // Request GC after error
    requestGarbageCollection();
    
    return {
      canEat: false,
      reason: "Unable to check food safety at this time. Please try again later.",
      additionalInfo: "For immediate concerns, please consult your healthcare provider or midwife."
    };
  }
}

// Mock function for web platform
function getMockFoodSafetyResponse(foodItem: string): FoodSafetyResponse {
  const safeFoodItem = safeString(foodItem, 100, '');
  if (!safeFoodItem) {
    return {
      canEat: false,
      reason: "Please provide a valid food item name.",
      additionalInfo: "When in doubt during pregnancy, it's best to avoid questionable foods and consult your midwife or doctor."
    };
  }
  const food = safeFoodItem.toLowerCase();
  
  // Safe foods
  if (food.includes('apple') || food.includes('banana') || food.includes('orange') || 
      food.includes('carrot') || food.includes('broccoli') || food.includes('spinach') ||
      food.includes('chicken') || food.includes('salmon') || food.includes('yogurt') ||
      food.includes('cheese') || food.includes('milk') || food.includes('bread')) {
    return {
      canEat: true,
      reason: "This food is generally safe to eat during pregnancy when properly prepared.",
      additionalInfo: "Ensure it's fresh, properly cooked, and stored at appropriate temperatures."
    };
  }
  
  // Risky foods
  if (food.includes('sushi') || food.includes('raw') || food.includes('undercooked') ||
      food.includes('soft cheese') || food.includes('blue cheese') || food.includes('feta') ||
      food.includes('pate') || food.includes('liver') || food.includes('shark') ||
      food.includes('swordfish') || food.includes('marlin')) {
    return {
      canEat: false,
      reason: "This food is not recommended during pregnancy due to potential health risks.",
      additionalInfo: "Avoid raw or undercooked foods, certain soft cheeses, and high-mercury fish during pregnancy."
    };
  }
  
  // Default response
  return {
    canEat: false,
    reason: "Please consult your healthcare provider for specific dietary advice.",
    additionalInfo: "When in doubt during pregnancy, it's best to avoid questionable foods and consult your midwife or doctor."
  };
}
