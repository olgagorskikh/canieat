import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
});

export interface FoodSafetyResponse {
  canEat: boolean;
  reason: string;
  additionalInfo?: string;
}


export async function checkFoodSafety(foodItem: string): Promise<FoodSafetyResponse> {
  if (!process.env.EXPO_PUBLIC_OPENAI_API_KEY) {
    return {
      canEat: false,
      reason: "API key not configured. Please set up your OpenAI API key.",
      additionalInfo: "Contact your developer or check the app configuration."
    };
  }

  try {
    const prompt = `You are a medical advisor specializing in pregnancy nutrition based on UK government medical guidelines. 
    
    A pregnant woman is asking if she can eat: "${foodItem}"
    
    Please provide a clear, concise answer based on UK government medical guidelines for pregnancy nutrition. 
    
    Your response should be in this exact JSON format:
    {
      "canEat": true/false,
      "reason": "Brief explanation based on UK medical guidelines",
      "additionalInfo": "Any additional safety tips or preparation advice if applicable"
    }
    
    Focus on:
    - Food safety during pregnancy
    - UK government medical recommendations
    - Listeria, salmonella, and other pregnancy-related food risks
    - Proper cooking temperatures and preparation methods
    
    Be conservative and prioritize safety. If unsure, recommend avoiding the food item.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a medical advisor specializing in pregnancy nutrition based on UK government medical guidelines. Always prioritize safety and provide evidence-based recommendations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    // Try to parse the JSON response
    try {
      const parsedResponse = JSON.parse(response);
      return {
        canEat: parsedResponse.canEat,
        reason: parsedResponse.reason,
        additionalInfo: parsedResponse.additionalInfo
      };
    } catch (parseError) {
      // If JSON parsing fails, return a safe default response
      return {
        canEat: false,
        reason: "Unable to determine safety. Please consult your healthcare provider.",
        additionalInfo: "When in doubt during pregnancy, it's best to avoid questionable foods and consult your midwife or doctor."
      };
    }
  } catch (error) {
    console.error('Error checking food safety:', error);
    return {
      canEat: false,
      reason: "Unable to check food safety at this time. Please try again later.",
      additionalInfo: "For immediate concerns, please consult your healthcare provider or midwife."
    };
  }
}
