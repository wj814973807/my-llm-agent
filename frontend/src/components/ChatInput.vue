<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  modelValue: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  submit: [];
  "update:modelValue": [value: string];
}>();

const text = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newVal) => {
    text.value = newVal;
  },
);

const updateModel = (value: string) => {
  text.value = value;
  emit("update:modelValue", value);
};

const handleSubmit = () => {
  if (!text.value.trim() || props.disabled) return;
  emit("submit");
  updateModel("");
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    handleSubmit();
  }
};
</script>

<template>
  <div class="chat-input">
    <textarea
      ref="inputRef"
      :value="text"
      @input="updateModel(($event.target as HTMLTextAreaElement).value)"
      :disabled="disabled"
      placeholder="输入消息..."
      rows="1"
      class="chat-input__textarea"
      @keydown="handleKeydown"
    />
    <button
      class="chat-input__button"
      :disabled="!text.trim() || disabled"
      @click="handleSubmit"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="m22 11-3-3L4 18" />
        <path d="M15 11H2" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.chat-input {
  display: flex;
  gap: 12px;
  padding: 16px;
  background-color: white;
  border-top: 1px solid #e2e8f0;
}

.chat-input__textarea {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  resize: none;
  outline: none;
  transition: border-color 0.2s;
}

.chat-input__textarea:focus {
  border-color: #3b82f6;
}

.chat-input__textarea:disabled {
  background-color: #f8fafc;
  cursor: not-allowed;
}

.chat-input__button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.chat-input__button:hover:not(:disabled) {
  background-color: #2563eb;
}

.chat-input__button:disabled {
  background-color: #94a3b8;
  cursor: not-allowed;
}
</style>
