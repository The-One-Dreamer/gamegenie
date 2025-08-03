import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Plus, Clock, Gamepad2, Trash2 } from "lucide-react";
import { SettingsDialog } from "./settings-dialog";
import type { ChatSession } from "@/types/chat";

interface ChatSidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onNewChat: () => void;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onClearAllData: () => void;
  className?: string;
}

export function ChatSidebar({
  sessions,
  currentSessionId,
  onNewChat,
  onSelectSession,
  onDeleteSession,
  onClearAllData,
  className = "",
}: ChatSidebarProps) {
  const [hoveredSession, setHoveredSession] = useState<string | null>(null);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInHours < 48) {
      return "1 day ago";
    } else {
      return `${Math.floor(diffInHours / 24)} days ago`;
    }
  };

  const getPlatformColor = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("pc")) return "bg-blue-900 text-blue-300";
    if (lowerTitle.includes("mobile")) return "bg-purple-900 text-purple-300";
    if (lowerTitle.includes("console") || lowerTitle.includes("playstation") || lowerTitle.includes("xbox")) return "bg-green-900 text-green-300";
    if (lowerTitle.includes("nintendo") || lowerTitle.includes("switch")) return "bg-red-900 text-red-300";
    return "bg-gray-700 text-gray-300";
  };

  const getGenreFromTitle = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("racing")) return "Racing";
    if (lowerTitle.includes("puzzle")) return "Puzzle";
    if (lowerTitle.includes("rpg") || lowerTitle.includes("role")) return "RPG";
    if (lowerTitle.includes("horror")) return "Horror";
    if (lowerTitle.includes("action")) return "Action";
    if (lowerTitle.includes("indie")) return "Indie";
    if (lowerTitle.includes("strategy")) return "Strategy";
    return "Gaming";
  };

  return (
    <div className={`w-80 bg-[var(--game-primary)] border-r border-[var(--game-border)] flex flex-col ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-[var(--game-border)]">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-[var(--game-accent)] to-blue-600 rounded-xl flex items-center justify-center">
            <Gamepad2 className="text-gray-100 text-xl" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-[var(--game-text)]">Game Suggester</h1>
            <p className="text-sm text-[var(--game-text-muted)]">Powered by Gemini</p>
          </div>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <Button
          onClick={onNewChat}
          className="w-full bg-[var(--game-accent)] hover:bg-[var(--game-accent)]/80 text-gray-100 py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          <span>New Search</span>
        </Button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full p-4">
          <h3 className="text-sm font-medium text-[var(--game-text-muted)] mb-4">Recent Searches</h3>
          
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`relative group bg-[var(--game-card)] hover:bg-[var(--game-secondary)] rounded-xl p-4 cursor-pointer transition-all duration-200 border ${
                  currentSessionId === session.id ? "border-[var(--game-accent)] shadow-lg shadow-[var(--game-accent)]/10" : "border-[var(--game-border)]"
                }`}
                onClick={() => onSelectSession(session.id)}
                onMouseEnter={() => setHoveredSession(session.id)}
                onMouseLeave={() => setHoveredSession(null)}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-[var(--game-accent)]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-[var(--game-accent)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-medium truncate group-hover:text-[var(--game-accent)] transition-colors ${
                      currentSessionId === session.id ? "text-[var(--game-accent)]" : "text-[var(--game-text)]"
                    }`}>
                      {session.title}
                    </h4>
                    <p className="text-xs text-[var(--game-text-muted)] mt-1">{formatTimestamp(session.updatedAt)}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs px-2 py-1 rounded-full bg-[var(--game-accent)]/10 text-[var(--game-accent)] border-0">
                        {getGenreFromTitle(session.title)}
                      </Badge>
                    </div>
                  </div>
                  
                  {hoveredSession === session.id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-3 right-3 h-7 w-7 p-0 text-[var(--game-text-muted)] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(session.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Settings - Fixed to bottom left */}
      <div className="mt-auto p-4 border-t border-[var(--game-border)]">
        <SettingsDialog 
          onClearAllData={onClearAllData}
          totalSessions={sessions.length}
        />
      </div>
    </div>
  );
}
