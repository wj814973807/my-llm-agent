import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Message, Session, ApiResponse, StreamResponse } from "../types";
import axios from "../utils/axios";

export const useChatStore = defineStore("chat", () => {
  const sessions = ref<Session[]>([]);
  const currentSession = ref<Session | null>(null);
  const messages = ref<Message[]>([]);
  const isStreaming = ref(false);
  const streamingContent = ref("");

  const sortedSessions = computed(() => {
    return [...sessions.value].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  });

  const loadSessions = async (): Promise<void> => {
    const response =
      await axios.get<ApiResponse<{ sessions: Session[]; total: number }>>(
        "/sessions",
      );
    if (response.data.success) {
      sessions.value = response.data.data.sessions;
    }
  };

  const createSession = async (title?: string): Promise<Session> => {
    const response = await axios.post<ApiResponse<Session>>("/sessions", {
      title,
    });
    if (response.data.success) {
      sessions.value.unshift(response.data.data);
      return response.data.data;
    }
    throw new Error(response.data.message);
  };

  const selectSession = async (session: Session): Promise<void> => {
    currentSession.value = session;
    await loadMessages(session.id);
  };

  const loadMessages = async (sessionId: string): Promise<void> => {
    const response = await axios.get<
      ApiResponse<{ messages: Message[]; total: number }>
    >(`/messages/${sessionId}`);
    if (response.data.success) {
      messages.value = response.data.data.messages;
    }
  };

  const sendMessage = async (content: string): Promise<void> => {
    if (!currentSession.value) {
      const newSession = await createSession();
      currentSession.value = newSession;
    }

    const userMessage: Message = {
      id: "",
      sessionId: currentSession.value.id,
      role: "user",
      content,
      createdAt: new Date(),
    };
    messages.value.push(userMessage);

    isStreaming.value = true;
    streamingContent.value = "";

    const response = await fetch("/api/messages/stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        sessionId: currentSession.value.id,
        content,
      }),
    });

    if (!response.body) return;

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          try {
            const parsed: StreamResponse = JSON.parse(data);
            if (parsed.type === "token" && parsed.content) {
              streamingContent.value += parsed.content;
            } else if (parsed.type === "done") {
              const assistantMessage: Message = {
                id: "",
                sessionId: currentSession.value!.id,
                role: "assistant",
                content: streamingContent.value,
                createdAt: new Date(),
              };
              messages.value.push(assistantMessage);
              isStreaming.value = false;
              streamingContent.value = "";
              await loadSessions();
            } else if (parsed.type === "error") {
              isStreaming.value = false;
              streamingContent.value = "";
              throw new Error(parsed.message);
            }
          } catch {
            continue;
          }
        }
      }
    }
  };

  const deleteSession = async (sessionId: string): Promise<void> => {
    await axios.delete(`/sessions/${sessionId}`);
    sessions.value = sessions.value.filter((s) => s.id !== sessionId);
    if (currentSession.value?.id === sessionId) {
      currentSession.value = null;
      messages.value = [];
    }
  };

  return {
    sessions,
    currentSession,
    messages,
    isStreaming,
    streamingContent,
    sortedSessions,
    loadSessions,
    createSession,
    selectSession,
    sendMessage,
    deleteSession,
  };
});
