import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { GameCard } from "./game-card";
import { Bot, User, Leaf, Users, Ghost } from "lucide-react";
import type { ChatMessage } from "@/types/chat";

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (content: string) => void;
}

export function MessageList({ messages, isLoading, onSendMessage }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60);

    if (diffInMinutes < 1) {
      return "Just now";
    } else if (diffInMinutes < 60) {
      return `${Math.floor(diffInMinutes)} minutes ago`;
    } else {
      const diffInHours = diffInMinutes / 60;
      return `${Math.floor(diffInHours)} hours ago`;
    }
  };

  const WelcomeMessage = () => (
    <div className="flex items-start space-x-4">
      <div className="w-12 h-12 bg-gradient-to-r from-[var(--game-accent)] to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
        <Bot className="text-gray-100 text-lg" />
      </div>
      <div className="flex-1">
        <div className="bg-[var(--game-card)] rounded-2xl rounded-tl-md p-6 max-w-2xl border border-[var(--game-border)] shadow-sm">
          <p className="text-[var(--game-text)] text-base leading-relaxed">👋 Welcome to Game Suggester! I'm powered by Google Gemini to help you discover amazing games.</p>
          <p className="text-[var(--game-text)] mt-3 text-base leading-relaxed">Tell me what kind of game you're looking for - I can help with platforms, genres, mood, or specific features!</p>
          <div className="flex flex-wrap gap-3 mt-5">
            <Button
              size="sm"
              className="bg-[var(--game-accent)]/10 hover:bg-[var(--game-accent)]/20 text-[var(--game-accent)] text-sm px-4 py-2 rounded-full transition-all duration-200 border border-[var(--game-accent)]/20 font-medium"
              onClick={() => onSendMessage("Suggest a relaxing indie game for PC")}
            >
              <Leaf className="w-4 h-4 mr-2" />
              Relaxing indie games
            </Button>
            <Button
              size="sm"
              className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-sm px-4 py-2 rounded-full transition-all duration-200 border border-blue-500/20 font-medium"
              onClick={() => onSendMessage("What are the best multiplayer games right now?")}
            >
              <Users className="w-4 h-4 mr-2" />
              Multiplayer hits
            </Button>
            <Button
              size="sm"
              className="bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 text-sm px-4 py-2 rounded-full transition-all duration-200 border border-orange-500/20 font-medium"
              onClick={() => onSendMessage("Recommend horror games for Halloween")}
            >
              <Ghost className="w-4 h-4 mr-2" />
              Horror games
            </Button>
          </div>
        </div>
        <p className="text-xs text-[var(--game-text-muted)] mt-3">Gemini • Just now</p>
      </div>
    </div>
  );

  const LoadingMessage = () => (
    <div className="flex items-start space-x-4">
      <div className="w-12 h-12 bg-gradient-to-r from-[var(--game-accent)] to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
        <Bot className="text-gray-100 text-lg animate-pulse" />
      </div>
      <div className="flex-1">
        <div className="bg-[var(--game-card)] rounded-2xl rounded-tl-md p-6 max-w-2xl border border-[var(--game-border)] shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="flex space-x-1.5">
              <div className="w-2.5 h-2.5 bg-[var(--game-accent)] rounded-full animate-bounce"></div>
              <div className="w-2.5 h-2.5 bg-[var(--game-accent)] rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-2.5 h-2.5 bg-[var(--game-accent)] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            </div>
            <p className="text-[var(--game-text-muted)] text-sm font-medium">Gemini is thinking...</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-8">
      {messages.length === 0 && <WelcomeMessage />}
      
      {messages.map((message) => (
        <div key={message.id}>
          {message.role === "user" ? (
            <div className="flex items-start space-x-4 justify-end">
              <div className="flex-1 flex justify-end">
                <div className="bg-[var(--game-accent)] rounded-2xl rounded-tr-md p-5 max-w-2xl shadow-lg">
                  <p className="text-gray-100 text-base leading-relaxed">{message.content}</p>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-[var(--game-accent)] to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <User className="text-gray-100 text-lg" />
              </div>
            </div>
          ) : (
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[var(--game-accent)] to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Bot className="text-white text-lg" />
              </div>
              <div className="flex-1">
                <div className="bg-[var(--game-card)] rounded-2xl rounded-tl-md p-6 max-w-4xl border border-[var(--game-border)] shadow-sm">
                  <p className="text-[var(--game-text)] mb-5 text-base leading-relaxed">{message.content}</p>
                  
                  {message.recommendations && message.recommendations.length > 0 && (
                    <div className="space-y-4 mt-4">
                      {message.recommendations.map((recommendation) => (
                        <GameCard key={recommendation.id} recommendation={recommendation} />
                      ))}
                    </div>
                  )}
                </div>
                
                {message.followUpQuestions && message.followUpQuestions.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-5">
                    {message.followUpQuestions.map((question, index) => (
                      <Button
                        key={index}
                        size="sm"
                        variant="secondary"
                        className="bg-[var(--game-secondary)] hover:bg-[var(--game-accent)]/10 text-[var(--game-text)] hover:text-[var(--game-accent)] text-sm px-4 py-2 rounded-full transition-all duration-200 border border-[var(--game-border)] hover:border-[var(--game-accent)]/20 font-medium"
                        onClick={() => onSendMessage(question)}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                )}
                
                <p className="text-xs text-[var(--game-text-muted)] mt-4">Gemini • {formatTimestamp(message.createdAt)}</p>
              </div>
            </div>
          )}
        </div>
      ))}
      
      {isLoading && <LoadingMessage />}
      
      <div ref={messagesEndRef} />
    </div>
  );
}
