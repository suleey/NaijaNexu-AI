const fetch = require('node-fetch');

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "GEMINI_API_KEY is not configured on the server." }),
    };
  }

  try {
    const { history, userPreferences } = JSON.parse(event.body);

    const SYSTEM_INSTRUCTION = `
You are NaijaNexu AI, an intelligent Nigerian conversational recommendation agent.
Your goal is to deliver highly personalized, context-aware, and explainable recommendations across food, restaurants, books, movies, products, jobs, and lifestyle.

TONE: Friendly, intelligent, conversational. Use light Nigerian expressions (e.g., "Kedu", "You might like this spot").

JSON OUTPUT FORMAT:
Return an object with:
- "reply": conversational text.
- "recommendations": optional array of objects {title, description, reason, domain, priceContext, rating, tags}.

USER PROFILE: ${JSON.stringify(userPreferences)}
`;

    const contents = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Construct the Gemini API request
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: contents,
        systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        generationConfig: {
          responseMimeType: "application/json",
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Gemini API error");
    }

    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: aiText,
    };
  } catch (error) {
    console.error("Function Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to process chat request." }),
    };
  }
};
