import { Message } from "../types";

export async function chatWithAI(history: Message[], userPreferences: any) {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ history, userPreferences }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Network error");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Chat API Error:", error);
    return { 
      reply: "Sorry o, I encountered a little bit of trouble trying to get that for you. Can you try again?",
      recommendations: [] 
    };
  }
}
