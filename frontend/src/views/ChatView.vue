<script setup lang="ts">
import { ref, nextTick, watch, onMounted } from "vue";
import { useChatStore } from "../stores/chat";
import Header from "../components/Header.vue";
import SessionList from "../components/SessionList.vue";
import MessageBubble from "../components/MessageBubble.vue";
import ChatInput from "../components/ChatInput.vue";
import LoadingDots from "../components/LoadingDots.vue";

const chatStore = useChatStore();
const messagesRef = ref<HTMLElement | null>(null);
const inputMessage = ref("");

onMounted(async () => {
  await chatStore.loadSessions();
});

const scrollToBottom = async () => {
  await nextTick();
  if (messagesRef.value) {
    messagesRef.value.scrollTop = messagesRef.value.scrollHeight;
  }
};

watch(
  () => chatStore.messages.length,
  () => {
    scrollToBottom();
  },
);

watch(
  () => chatStore.streamingContent,
  () => {
    scrollToBottom();
  },
);

const handleSend = async () => {
  if (!inputMessage.value.trim()) return;
  await chatStore.sendMessage(inputMessage.value);
  inputMessage.value = "";
};
</script>

<template>
  <div class="chat-view">
    <Header />

    <div class="chat-view__main">
      <SessionList />

      <div class="chat-view__chat">
        <div v-if="chatStore.currentSession" class="chat-view__chat-header">
          <h3 class="chat-view__chat-title">
            {{ chatStore.currentSession.title || "新对话" }}
          </h3>
        </div>

        <div ref="messagesRef" class="chat-view__messages">
          <template v-if="chatStore.currentSession">
            <MessageBubble
              v-for="msg in chatStore.messages"
              :key="msg.id"
              :message="msg"
            />

            <div v-if="chatStore.isStreaming" class="chat-view__streaming">
              <div class="chat-view__streaming-content">
                {{ chatStore.streamingContent }}
              </div>
              <div class="chat-view__streaming-indicator">
                <LoadingDots />
              </div>
            </div>
          </template>

          <div v-else class="chat-view__empty">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="chat-view__empty-icon"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M8 14s1.5 2 4 2 4-2 4-2" />
              <path d="M9 9h.01" />
              <path d="M15 9h.01" />
            </svg>
            <p class="chat-view__empty-text">选择或创建一个对话开始聊天</p>
          </div>
        </div>

        <ChatInput
          v-model="inputMessage"
          :disabled="chatStore.isStreaming"
          @submit="handleSend"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f8fafc;
}

.chat-view__main {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.chat-view__chat {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-left: 1px solid #e2e8f0;
}

.chat-view__chat-header {
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
}

.chat-view__chat-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.chat-view__messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.chat-view__streaming {
  display: flex;
  flex-direction: column;
  max-width: 70%;
  margin-bottom: 12px;
  align-self: flex-start;
}

.chat-view__streaming-content {
  padding: 12px 16px;
  background-color: #f1f5f9;
  color: #1e293b;
  border-radius: 16px;
  border-bottom-left-radius: 4px;
  font-size: 14px;
  line-height: 1.5;
  word-break: break-word;
  min-height: 24px;
}

.chat-view__streaming-indicator {
  padding: 4px 0 4px 16px;
}

.chat-view__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #94a3b8;
}

.chat-view__empty-icon {
  margin-bottom: 16px;
}

.chat-view__empty-text {
  font-size: 14px;
}
</style>
