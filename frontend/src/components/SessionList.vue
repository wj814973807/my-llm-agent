<script setup lang="ts">
import { useChatStore } from "../stores/chat";
import type { Session } from "../types";

const chatStore = useChatStore();

const handleSelectSession = async (session: Session) => {
  await chatStore.selectSession(session);
};

const handleNewSession = async () => {
  const newSession = await chatStore.createSession();
  await chatStore.selectSession(newSession);
};

const handleDeleteSession = async (sessionId: string, event: Event) => {
  event.stopPropagation();
  if (confirm("确定要删除这个会话吗？")) {
    await chatStore.deleteSession(sessionId);
  }
};
</script>

<template>
  <div class="session-list">
    <div class="session-list__header">
      <h2 class="session-list__title">对话列表</h2>
      <button class="session-list__new-btn" @click="handleNewSession">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
      </button>
    </div>

    <div class="session-list__items">
      <div
        v-for="session in chatStore.sortedSessions"
        :key="session.id"
        :class="[
          'session-list__item',
          {
            'session-list__item--active':
              chatStore.currentSession?.id === session.id,
          },
        ]"
        @click="handleSelectSession(session)"
      >
        <div class="session-list__item-title">
          {{ session.title || "新对话" }}
        </div>
        <div class="session-list__item-time">
          {{ new Date(session.updatedAt).toLocaleDateString("zh-CN") }}
        </div>
        <button
          class="session-list__item-delete"
          @click="handleDeleteSession(session.id, $event)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        </button>
      </div>

      <div v-if="chatStore.sessions.length === 0" class="session-list__empty">
        <p>暂无对话，点击上方按钮开始新对话</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.session-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f8fafc;
}

.session-list__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.session-list__title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.session-list__new-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.session-list__new-btn:hover {
  background-color: #2563eb;
}

.session-list__items {
  flex: 1;
  overflow-y: auto;
}

.session-list__item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #e2e8f0;
}

.session-list__item:hover {
  background-color: #e2e8f0;
}

.session-list__item--active {
  background-color: #dbeafe;
}

.session-list__item-title {
  flex: 1;
  font-size: 14px;
  color: #1e293b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.session-list__item-time {
  font-size: 12px;
  color: #94a3b8;
}

.session-list__item-delete {
  display: none;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: #94a3b8;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.session-list__item:hover .session-list__item-delete {
  display: flex;
}

.session-list__item-delete:hover {
  background-color: #fecaca;
  color: #dc2626;
}

.session-list__empty {
  padding: 40px 16px;
  text-align: center;
  color: #94a3b8;
}
</style>
