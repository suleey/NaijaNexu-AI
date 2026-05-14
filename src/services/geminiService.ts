import { GoogleGenAI, Type } from "@google/genai";
import { Message, Recommendation, Domain } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const SYSTEM_INSTRUCTION = `
You are NaijaNexu AI, an intelligent Nigerian conversational recommendation agent.
Your goal is to deliver highly personalized, context-aware, and explainable recommendations across food, restaurants, books, movies, products, jobs, and lifestyle.

TONE:
- Friendly, intelligent, conversational, natural.
- Use light Nigerian expressions occasionally (e.g., "You might like this spot", "This fits your budget well", "Good value"). Avoid excessive slang.

CAPABILITIES:
- Handle cross-domain recommendations.
- Maintain memory via the previous conversation history.
- Adapt to Nigerian context/culture, affordability, and local lifestyle.
- Explain WHY each recommendation was chosen, specifically linking it to the user's situation and Nigerian reality.

JSON OUTPUT FORMAT:
If the user is asking for recommendations, you MUST provide them in a structured JSON format within your response.
The JSON should be an object with:
- "reply": A conversational Nigerian-inflected message explaining your thoughts.
- "recommendations": An array of recommendation objects.

Each recommendation object must have:
- "title": string
- "description": string
- "reason": string (Personalized "Why")
- "domain": "food" | "movies" | "books" | "products" | "jobs" | "lifestyle" | "other"
- "priceContext": string (optional, e.g. "Affordable", "₦20,000 - ₦30,000")
- "rating": string (optional)
- "tags": string[] (optional)

If the user is just chatting or providing facts, you can just return the "reply".

NEVER expose internal chain-of-thought logic.
`;

export async function chatWithAI(history: Message[], userPreferences: any) {
  try {
    const contents = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION + `\n\nUSER PROFILE: ${JSON.stringify(userPreferences)}`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: { type: Type.STRING },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  domain: { type: Type.STRING },
                  priceContext: { type: Type.STRING },
                  rating: { type: Type.STRING },
                  tags: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["title", "description", "reason", "domain"]
              }
            }
          },
          required: ["reply"]
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    return data;
  } catch (error) {
    console.error("AI Error:", error);
    return { 
      reply: "Sorry o, I encountered a little bit of trouble trying to get that for you. Can you try again?",
      recommendations: [] 
    };
  }
}
