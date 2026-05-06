<script setup lang="ts">
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();

const handleLogout = () => {
  authStore.logout();
};
</script>

<template>
  <header class="header">
    <div class="header__logo">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="header__logo-icon"
      >
        <circle cx="12" cy="12" r="10"/>
        <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
        <path d="M9 9h.01"/>
        <path d="M15 9h.01"/>
      </svg>
      <span class="header__logo-text">AI客服</span>
    </div>

    <div class="header__user">
      <span class="header__user-email">{{ authStore.user?.email }}</span>
      <button class="header__logout-btn" @click="handleLogout">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" x2="9" y1="12" y2="12"/>
        </svg>
      </button>
    </div>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: white;
  border-bottom: 1px solid #e2e8f0;
}

.header__logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header__logo-icon {
  color: #3b82f6;
}

.header__logo-text {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.header__user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header__user-email {
  font-size: 14px;
  color: #64748b;
}

.header__logout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: #94a3b8;
  border: none;
  background-color: #f1f5f9;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.header__logout-btn:hover {
  background-color: #e2e8f0;
  color: #dc2626;
}
</style>
