import { type ChatSession, type InsertChatSession, type ChatMessage, type InsertChatMessage, type GameRecommendation, type InsertGameRecommendation } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Chat Sessions
  getChatSession(id: string): Promise<ChatSession | undefined>;
  getAllChatSessions(): Promise<ChatSession[]>;
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  updateChatSession(id: string, updates: Partial<ChatSession>): Promise<ChatSession | undefined>;
  deleteChatSession(id: string): Promise<boolean>;

  // Chat Messages
  getChatMessage(id: string): Promise<ChatMessage | undefined>;
  getMessagesBySession(sessionId: string): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;

  // Game Recommendations
  getRecommendationsByMessage(messageId: string): Promise<GameRecommendation[]>;
  createGameRecommendation(recommendation: InsertGameRecommendation): Promise<GameRecommendation>;
}

export class MemStorage implements IStorage {
  private chatSessions: Map<string, ChatSession>;
  private chatMessages: Map<string, ChatMessage>;
  private gameRecommendations: Map<string, GameRecommendation>;

  constructor() {
    this.chatSessions = new Map();
    this.chatMessages = new Map();
    this.gameRecommendations = new Map();
  }

  // Chat Sessions
  async getChatSession(id: string): Promise<ChatSession | undefined> {
    return this.chatSessions.get(id);
  }

  async getAllChatSessions(): Promise<ChatSession[]> {
    return Array.from(this.chatSessions.values()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async createChatSession(insertSession: InsertChatSession): Promise<ChatSession> {
    const id = randomUUID();
    const now = new Date();
    const session: ChatSession = {
      ...insertSession,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.chatSessions.set(id, session);
    return session;
  }

  async updateChatSession(id: string, updates: Partial<ChatSession>): Promise<ChatSession | undefined> {
    const session = this.chatSessions.get(id);
    if (!session) return undefined;
    
    const updatedSession: ChatSession = {
      ...session,
      ...updates,
      updatedAt: new Date(),
    };
    this.chatSessions.set(id, updatedSession);
    return updatedSession;
  }

  async deleteChatSession(id: string): Promise<boolean> {
    return this.chatSessions.delete(id);
  }

  // Chat Messages
  async getChatMessage(id: string): Promise<ChatMessage | undefined> {
    return this.chatMessages.get(id);
  }

  async getMessagesBySession(sessionId: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(message => message.sessionId === sessionId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = {
      ...insertMessage,
      id,
      createdAt: new Date(),
    };
    this.chatMessages.set(id, message);
    return message;
  }

  // Game Recommendations
  async getRecommendationsByMessage(messageId: string): Promise<GameRecommendation[]> {
    return Array.from(this.gameRecommendations.values())
      .filter(rec => rec.messageId === messageId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  async createGameRecommendation(insertRecommendation: InsertGameRecommendation): Promise<GameRecommendation> {
    const id = randomUUID();
    const recommendation: GameRecommendation = {
      ...insertRecommendation,
      id,
      createdAt: new Date(),
    };
    this.gameRecommendations.set(id, recommendation);
    return recommendation;
  }
}

export const storage = new MemStorage();
