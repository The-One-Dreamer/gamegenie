import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getGameSuggestions, generateChatTitle } from "./services/openai";
import { insertChatSessionSchema, insertChatMessageSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all chat sessions
  app.get("/api/sessions", async (req, res) => {
    try {
      const sessions = await storage.getAllChatSessions();
      res.json(sessions);
    } catch (error) {
      console.error("Failed to get sessions:", error);
      res.status(500).json({ message: "Failed to get chat sessions" });
    }
  });

  // Create new chat session
  app.post("/api/sessions", async (req, res) => {
    try {
      const sessionData = insertChatSessionSchema.parse(req.body);
      const session = await storage.createChatSession(sessionData);
      res.json(session);
    } catch (error) {
      console.error("Failed to create session:", error);
      res.status(500).json({ message: "Failed to create chat session" });
    }
  });

  // Get messages for a session
  app.get("/api/sessions/:sessionId/messages", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const messages = await storage.getMessagesBySession(sessionId);
      
      // Get recommendations for each assistant message
      const messagesWithRecommendations = await Promise.all(
        messages.map(async (message) => {
          if (message.role === "assistant") {
            const recommendations = await storage.getRecommendationsByMessage(message.id);
            return { ...message, recommendations };
          }
          return message;
        })
      );
      
      res.json(messagesWithRecommendations);
    } catch (error) {
      console.error("Failed to get messages:", error);
      res.status(500).json({ message: "Failed to get messages" });
    }
  });

  // Send message and get AI response
  app.post("/api/sessions/:sessionId/messages", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const { content } = req.body;

      if (!content || typeof content !== "string") {
        return res.status(400).json({ message: "Message content is required" });
      }

      // Verify session exists
      const session = await storage.getChatSession(sessionId);
      if (!session) {
        return res.status(404).json({ message: "Chat session not found" });
      }

      // Save user message
      const userMessage = await storage.createChatMessage({
        sessionId,
        role: "user",
        content,
        metadata: null,
      });

      // Get conversation history for context
      const existingMessages = await storage.getMessagesBySession(sessionId);
      const conversationHistory = existingMessages
        .slice(-10) // Last 10 messages for context
        .map(msg => ({ role: msg.role as "user" | "assistant", content: msg.content }));

      // Get AI response
      const aiResponse = await getGameSuggestions(content, conversationHistory);

      // Save AI message
      const assistantMessage = await storage.createChatMessage({
        sessionId,
        role: "assistant",
        content: aiResponse.summary,
        metadata: {
          followUpQuestions: aiResponse.followUpQuestions,
          suggestionsCount: aiResponse.suggestions.length,
        },
      });

      // Save game recommendations
      const recommendations = await Promise.all(
        aiResponse.suggestions.map(suggestion =>
          storage.createGameRecommendation({
            messageId: assistantMessage.id,
            title: suggestion.title,
            description: suggestion.description,
            platform: suggestion.platform,
            genre: suggestion.genre,
            rating: suggestion.rating,
            price: suggestion.price,
            imageUrl: suggestion.imageUrl || "",
          })
        )
      );

      // Update session title if this is the first user message
      if (existingMessages.length === 0) {
        const title = await generateChatTitle(content);
        await storage.updateChatSession(sessionId, { title });
      } else {
        // Update the session's updatedAt timestamp
        await storage.updateChatSession(sessionId, {});
      }

      // Return the assistant message with recommendations
      res.json({
        ...assistantMessage,
        recommendations,
        followUpQuestions: aiResponse.followUpQuestions,
      });
    } catch (error) {
      console.error("Failed to process message:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to process message" 
      });
    }
  });

  // Delete chat session
  app.delete("/api/sessions/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const success = await storage.deleteChatSession(sessionId);
      
      if (success) {
        res.json({ message: "Session deleted successfully" });
      } else {
        res.status(404).json({ message: "Session not found" });
      }
    } catch (error) {
      console.error("Failed to delete session:", error);
      res.status(500).json({ message: "Failed to delete session" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
