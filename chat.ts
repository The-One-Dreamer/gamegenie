export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface GameRecommendation {
  id: string;
  messageId: string;
  title: string;
  description: string;
  platform: string;
  genre: string;
  rating: string;
  price: string;
  imageUrl: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: "user" | "assistant";
  content: string;
  metadata?: {
    followUpQuestions?: string[];
    suggestionsCount?: number;
  };
  createdAt: string;
  recommendations?: GameRecommendation[];
  followUpQuestions?: string[];
}

export interface ChatState {
  currentSessionId: string | null;
  sessions: ChatSession[];
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}
