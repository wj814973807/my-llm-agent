<script setup lang="ts">
import type { Message } from '../types';

defineProps<{
  message: Message;
}>();
</script>

<template>
  <div :class="['message-bubble', `message-bubble--${message.role}`]">
    <div class="message-bubble__content">{{ message.content }}</div>
    <div class="message-bubble__time">
      {{ new Date(message.createdAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) }}
    </div>
  </div>
</template>

<style scoped>
.message-bubble {
  display: flex;
  flex-direction: column;
  max-width: 70%;
  margin-bottom: 12px;
}

.message-bubble--user {
  align-self: flex-end;
}

.message-bubble--assistant {
  align-self: flex-start;
}

.message-bubble__content {
  padding: 12px 16px;
  border-radius: 16px;
  font-size: 14px;
  line-height: 1.5;
  word-break: break-word;
}

.message-bubble--user .message-bubble__content {
  background-color: #3b82f6;
  color: white;
  border-bottom-right-radius: 4px;
}

.message-bubble--assistant .message-bubble__content {
  background-color: #f1f5f9;
  color: #1e293b;
  border-bottom-left-radius: 4px;
}

.message-bubble__time {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 4px;
}

.message-bubble--user .message-bubble__time {
  text-align: right;
}

.message-bubble--assistant .message-bubble__time {
  text-align: left;
}
</style>
