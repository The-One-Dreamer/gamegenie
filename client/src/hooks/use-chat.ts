import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { ChatSession, ChatMessage, ChatState } from "@/types/chat";

export function useChat() {
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Get all chat sessions
  const { data: sessions = [], isLoading: sessionsLoading } = useQuery<ChatSession[]>({
    queryKey: ["/api/sessions"],
  });

  // Get messages for current session
  const { data: messages = [], isLoading: messagesLoading } = useQuery<ChatMessage[]>({
    queryKey: ["/api/sessions", currentSessionId, "messages"],
    enabled: !!currentSessionId,
  });

  // Create new session
  const createSessionMutation = useMutation({
    mutationFn: async (title: string) => {
      const response = await apiRequest("POST", "/api/sessions", { title });
      return response.json();
    },
    onSuccess: (newSession) => {
      queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
      setCurrentSessionId(newSession.id);
    },
  });

  // Send message
  const sendMessageMutation = useMutation({
    mutationFn: async ({ sessionId, content }: { sessionId: string; content: string }) => {
      const response = await apiRequest("POST", `/api/sessions/${sessionId}/messages`, { content });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sessions", currentSessionId, "messages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
    },
  });

  // Delete session
  const deleteSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const response = await apiRequest("DELETE", `/api/sessions/${sessionId}`);
      return response.json();
    },
    onSuccess: (_, deletedSessionId) => {
      queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
      if (currentSessionId === deletedSessionId) {
        setCurrentSessionId(null);
      }
    },
  });

  const startNewChat = useCallback(() => {
    const title = "New Game Search";
    createSessionMutation.mutate(title);
  }, [createSessionMutation]);

  const sendMessage = useCallback((content: string) => {
    if (!currentSessionId) {
      // Create new session first
      createSessionMutation.mutate("New Game Search", {
        onSuccess: (newSession) => {
          sendMessageMutation.mutate({ sessionId: newSession.id, content });
        },
      });
    } else {
      sendMessageMutation.mutate({ sessionId: currentSessionId, content });
    }
  }, [currentSessionId, createSessionMutation, sendMessageMutation]);

  const selectSession = useCallback((sessionId: string) => {
    setCurrentSessionId(sessionId);
  }, []);

  const deleteSession = useCallback((sessionId: string) => {
    deleteSessionMutation.mutate(sessionId);
  }, [deleteSessionMutation]);

  return {
    // State
    currentSessionId,
    sessions,
    messages,
    isLoading: sessionsLoading || messagesLoading,
    isSending: sendMessageMutation.isPending,
    error: createSessionMutation.error || sendMessageMutation.error || deleteSessionMutation.error,

    // Actions
    startNewChat,
    sendMessage,
    selectSession,
    deleteSession,
  };
}
