import { useState, useRef, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip, Flame, Gift, Search, Users } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

export function MessageInput({ onSendMessage, disabled }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const insertPrompt = (prompt: string) => {
    setMessage(prompt);
    textareaRef.current?.focus();
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
      }
    }, 0);
  };

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  };

  return (
    <div className="border-t border-[var(--game-border)] bg-[var(--game-primary)] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Textarea
                ref={textareaRef}
                placeholder="Ask for game recommendations... (e.g., 'Suggest horror games for Nintendo Switch')"
                className="bg-gray-800 border border-gray-600 min-h-[48px] max-h-[120px] rounded-2xl px-5 py-4 pr-12 text-gray-300 placeholder-gray-400 resize-none focus:outline-none focus:border-[var(--game-accent)] transition-all duration-200 shadow-sm"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  autoResize();
                }}
                onKeyDown={handleKeyDown}
                disabled={disabled}
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-4 bottom-4 text-[var(--game-text-muted)] hover:text-[var(--game-text)] hover:bg-[var(--game-secondary)] transition-all duration-200 h-8 w-8 p-0 rounded-lg"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Quick Suggestion Pills */}
            <div className="flex flex-wrap gap-3 mt-4">
              <Button
                size="sm"
                variant="secondary"
                className="bg-[var(--game-secondary)] hover:bg-[var(--game-accent)]/10 text-[var(--game-text)] hover:text-[var(--game-accent)] text-sm px-4 py-2 rounded-full transition-all duration-200 border border-[var(--game-border)] hover:border-[var(--game-accent)]/20 font-medium"
                onClick={() => insertPrompt("Best new games released this month")}
                disabled={disabled}
              >
                <Flame className="w-4 h-4 mr-2" />
                New releases
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="bg-[var(--game-secondary)] hover:bg-[var(--game-success)]/10 text-[var(--game-text)] hover:text-[var(--game-success)] text-sm px-4 py-2 rounded-full transition-all duration-200 border border-[var(--game-border)] hover:border-[var(--game-success)]/20 font-medium"
                onClick={() => insertPrompt("Free games that are actually good")}
                disabled={disabled}
              >
                <Gift className="w-4 h-4 mr-2" />
                Free games
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="bg-[var(--game-secondary)] hover:bg-blue-500/10 text-[var(--game-text)] hover:text-blue-400 text-sm px-4 py-2 rounded-full transition-all duration-200 border border-[var(--game-border)] hover:border-blue-500/20 font-medium"
                onClick={() => insertPrompt("Games similar to [insert game name]")}
                disabled={disabled}
              >
                <Search className="w-4 h-4 mr-2" />
                Similar to...
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="bg-[var(--game-secondary)] hover:bg-orange-500/10 text-[var(--game-text)] hover:text-orange-400 text-sm px-4 py-2 rounded-full transition-all duration-200 border border-[var(--game-border)] hover:border-orange-500/20 font-medium"
                onClick={() => insertPrompt("Co-op games for 2-4 players")}
                disabled={disabled}
              >
                <Users className="w-4 h-4 mr-2" />
                Co-op games
              </Button>
            </div>
          </div>
          
          <Button
            onClick={handleSend}
            disabled={!message.trim() || disabled}
            className="bg-[var(--game-accent)] hover:bg-[var(--game-accent)]/80 disabled:bg-[var(--game-secondary)] disabled:cursor-not-allowed text-gray-100 p-4 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl disabled:shadow-none"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        
        <p className="text-xs text-[var(--game-text-muted)] mt-4 text-center font-medium">
          Powered by Google Gemini • Your conversations are saved locally
        </p>
      </div>
    </div>
  );
}
