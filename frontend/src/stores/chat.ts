/**
 * 聊天状态管理 - Pinia store
 *
 * 功能说明：
 * - 管理会话列表和当前会话
 * - 维护消息列表和流式响应内容
 * - 处理消息发送（支持流式输出）
 * - 支持会话创建、选择、删除操作
 *
 * 状态字段：
 * - sessions: 会话列表
 * - currentSession: 当前选中的会话
 * - messages: 当前会话的消息列表
 * - isStreaming: 是否正在接收流式响应
 * - streamingContent: 流式响应的当前内容
 * - sortedSessions: 按更新时间排序的会话列表（计算属性）
 *
 * 使用方法：
 * ```typescript
 * const chatStore = useChatStore();
 * await chatStore.sendMessage("你好");
 * ```
 */

import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Message, Session, ApiResponse, StreamResponse } from "../types";
import axios from "../utils/axios";

export const useChatStore = defineStore("chat", () => {
  /** 会话列表 */
  const sessions = ref<Session[]>([]);

  /** 当前选中的会话 */
  const currentSession = ref<Session | null>(null);

  /** 当前会话的消息列表 */
  const messages = ref<Message[]>([]);

  /** 是否正在接收流式响应 */
  const isStreaming = ref(false);

  /** 流式响应的当前内容（打字机效果） */
  const streamingContent = ref("");

  /** 按更新时间倒序排列的会话列表 */
  const sortedSessions = computed(() => {
    return [...sessions.value].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  });

  /**
   * 加载会话列表
   */
  const loadSessions = async (): Promise<void> => {
    const response =
      await axios.get<ApiResponse<{ sessions: Session[]; total: number }>>(
        "/sessions",
      );
    if (response.data.success) {
      sessions.value = response.data.data.sessions;
    }
  };

  /**
   * 创建新会话
   *
   * @param title - 会话标题（可选）
   * @returns 创建的会话对象
   */
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

  /**
   * 选择会话
   *
   * @param session - 要选择的会话
   */
  const selectSession = async (session: Session): Promise<void> => {
    currentSession.value = session;
    await loadMessages(session.id);
  };

  /**
   * 加载会话消息
   *
   * @param sessionId - 会话ID
   */
  const loadMessages = async (sessionId: string): Promise<void> => {
    const response = await axios.get<
      ApiResponse<{ messages: Message[]; total: number }>
    >(`/messages/${sessionId}`);
    if (response.data.success) {
      messages.value = response.data.data.messages;
    }
  };

  /**
   * 发送消息（流式）
   *
   * 使用 Server-Sent Events (SSE) 实现打字机效果
   *
   * @param content - 消息内容
   */
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

  /**
   * 删除会话
   *
   * @param sessionId - 要删除的会话ID
   */
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
