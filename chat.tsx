import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { ChatArea } from "@/components/chat/chat-area";
import { useChat } from "@/hooks/use-chat";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const {
    currentSessionId,
    sessions,
    messages,
    isLoading,
    isSending,
    error,
    startNewChat,
    sendMessage,
    selectSession,
    deleteSession,
  } = useChat();

  const handleClearAllData = () => {
    // Clear all sessions
    sessions.forEach(session => {
      deleteSession(session.id);
    });
    setSidebarOpen(false);
  };

  // Show error toast when there's an error
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSelectSession = (sessionId: string) => {
    selectSession(sessionId);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-[var(--game-bg)] text-[var(--game-text)] overflow-hidden">
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50
        transform transition-transform duration-300 ease-in-out
        ${!sidebarOpen ? '-translate-x-full' : 'translate-x-0'}
      `}>
        <ChatSidebar
          sessions={sessions}
          currentSessionId={currentSessionId}
          onNewChat={startNewChat}
          onSelectSession={handleSelectSession}
          onDeleteSession={deleteSession}
          onClearAllData={handleClearAllData}
        />
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Chat Area */}
      <ChatArea
        messages={messages}
        isLoading={isLoading}
        isSending={isSending}
        onSendMessage={sendMessage}
        onToggleSidebar={handleToggleSidebar}
      />
    </div>
  );
}
