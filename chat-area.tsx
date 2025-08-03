import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageList } from "./message-list";
import { MessageInput } from "./message-input";
import { MoreVertical, Menu } from "lucide-react";
import type { ChatMessage } from "@/types/chat";

interface ChatAreaProps {
  messages: ChatMessage[];
  isLoading: boolean;
  isSending: boolean;
  onSendMessage: (content: string) => void;
  onToggleSidebar?: () => void;
}

export function ChatArea({ 
  messages, 
  isLoading, 
  isSending, 
  onSendMessage,
  onToggleSidebar 
}: ChatAreaProps) {
  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="bg-[var(--game-primary)] border-b border-[var(--game-border)] p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {onToggleSidebar && (
              <Button
                variant="ghost"
                size="sm"
                className="text-[var(--game-text-muted)] hover:text-[var(--game-text)] hover:bg-[var(--game-secondary)] rounded-lg transition-all duration-200"
                onClick={onToggleSidebar}
              >
                <Menu className="w-5 h-5" />
              </Button>
            )}
            <div>
              <h2 className="text-xl font-semibold text-[var(--game-text)]">Game Suggestions</h2>
              <p className="text-sm text-[var(--game-text-muted)]">Ask me about any game you'd like to discover!</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-[var(--game-success)]">
              <div className="w-2 h-2 bg-[var(--game-success)] rounded-full animate-pulse"></div>
              <span className="text-xs font-medium">Gemini Connected</span>
            </div>
            <Button variant="ghost" size="sm" className="text-[var(--game-text-muted)] hover:text-[var(--game-text)] hover:bg-[var(--game-secondary)] rounded-lg transition-all duration-200">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <MessageList 
        messages={messages} 
        isLoading={isSending} 
        onSendMessage={onSendMessage} 
      />

      {/* Input Area */}
      <MessageInput 
        onSendMessage={onSendMessage} 
        disabled={isSending} 
      />
    </div>
  );
}
