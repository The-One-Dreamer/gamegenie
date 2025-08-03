import * as fs from "fs";
import { GoogleGenAI } from "@google/genai";

// Using Google Gemini 2.5 Flash - the best free AI model for 2025
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY || "" });

export interface GameSuggestion {
  title: string;
  description: string;
  platform: string;
  genre: string;
  rating: string;
  price: string;
  imageUrl?: string;
  reasoning: string;
}

export interface GameSuggestionResponse {
  suggestions: GameSuggestion[];
  followUpQuestions: string[];
  summary: string;
}

export async function getGameSuggestions(
  userPrompt: string,
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }> = []
): Promise<GameSuggestionResponse> {
  try {
    const systemPrompt = `You are an expert game recommendation AI powered by Google Gemini, the most advanced AI for gaming recommendations in 2025. You have deep knowledge of games across all platforms, genres, and eras.

Your task is to provide intelligent, personalized game recommendations based on user queries. Always respond with a JSON object containing:

1. "suggestions": An array of 2-4 specific game recommendations, each with:
   - "title": Exact game name
   - "description": Compelling 1-2 sentence description focusing on what makes it special
   - "platform": Primary platform (PC, PlayStation, Xbox, Nintendo Switch, Mobile, etc.)
   - "genre": Primary genre (RPG, Action, Racing, Puzzle, etc.)
   - "rating": User rating like "4.2/5" or "9/10"
   - "price": Current price range like "$29.99", "Free", "$10-20"
   - "imageUrl": Leave empty string ""
   - "reasoning": Brief explanation why this fits their request

2. "followUpQuestions": 2-3 relevant follow-up questions to continue the conversation

3. "summary": A brief, engaging summary of your recommendations

Guidelines:
- Prioritize recent, highly-rated games when possible
- Consider the user's platform preferences, budget, and gaming style
- Provide diverse options (different genres/styles) unless they ask for something specific
- Be conversational and enthusiastic about gaming
- If they mention a specific game, understand what they liked about it
- Consider accessibility, replayability, and community aspects
- Mention if games are on sale, have DLC, or are part of subscription services`;

    // Build conversation context for Gemini
    let conversationContext = systemPrompt + "\n\n";
    conversationHistory.forEach((msg) => {
      conversationContext += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
    });
    conversationContext += `User: ${userPrompt}\nAssistant:`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            suggestions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  platform: { type: "string" },
                  genre: { type: "string" },
                  rating: { type: "string" },
                  price: { type: "string" },
                  imageUrl: { type: "string" },
                  reasoning: { type: "string" }
                },
                required: ["title", "description", "platform", "genre", "rating", "price", "imageUrl", "reasoning"]
              }
            },
            followUpQuestions: {
              type: "array",
              items: { type: "string" }
            },
            summary: { type: "string" }
          },
          required: ["suggestions", "followUpQuestions", "summary"]
        }
      },
      contents: conversationContext,
    });

    const content = response.text;
    if (!content) {
      throw new Error("No response content from Gemini");
    }

    const result = JSON.parse(content) as GameSuggestionResponse;
    
    // Validate the response structure
    if (!result.suggestions || !Array.isArray(result.suggestions)) {
      throw new Error("Invalid response format: missing suggestions array");
    }

    if (!result.followUpQuestions || !Array.isArray(result.followUpQuestions)) {
      result.followUpQuestions = [];
    }

    if (!result.summary) {
      result.summary = "Here are some great game recommendations for you!";
    }

    return result;
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error(`Failed to get game suggestions: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function generateChatTitle(firstUserMessage: string): Promise<string> {
  try {
    const prompt = `Generate a short, descriptive title (max 6 words) for a game recommendation chat based on this user message: "${firstUserMessage}". Focus on the key gaming interest (genre, platform, mood, etc.). Respond with just the title, no quotes or extra text.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text?.trim() || "Game Recommendations";
  } catch (error) {
    console.error("Failed to generate chat title:", error);
    return "Game Recommendations";
  }
}
