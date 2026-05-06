<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const nickname = ref("");
const error = ref("");
const isLoading = ref(false);

const handleSubmit = async () => {
  error.value = "";

  if (!email.value || !password.value) {
    error.value = "请填写邮箱和密码";
    return;
  }

  if (password.value.length < 6) {
    error.value = "密码至少需要6位";
    return;
  }

  isLoading.value = true;

  try {
    await authStore.register({
      email: email.value,
      password: password.value,
      nickname: nickname.value || undefined,
    });
    await router.push("/login");
  } catch (err: any) {
    error.value = err.message || "注册失败";
  } finally {
    isLoading.value = false;
  }
};

const handleLogin = () => {
  router.push("/login");
};
</script>

<template>
  <div class="register-view">
    <div class="register-view__container">
      <div class="register-view__logo">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
          <path d="M9 9h.01" />
          <path d="M15 9h.01" />
        </svg>
        <h1 class="register-view__title">AI客服系统</h1>
        <p class="register-view__subtitle">创建您的账号</p>
      </div>

      <form class="register-view__form" @submit.prevent="handleSubmit">
        <div class="register-view__form-group">
          <label class="register-view__label">邮箱</label>
          <input
            v-model="email"
            type="email"
            placeholder="请输入邮箱"
            class="register-view__input"
            :disabled="isLoading"
          />
        </div>

        <div class="register-view__form-group">
          <label class="register-view__label">昵称</label>
          <input
            v-model="nickname"
            type="text"
            placeholder="请输入昵称（可选）"
            class="register-view__input"
            :disabled="isLoading"
          />
        </div>

        <div class="register-view__form-group">
          <label class="register-view__label">密码</label>
          <input
            v-model="password"
            type="password"
            placeholder="请输入密码（至少6位）"
            class="register-view__input"
            :disabled="isLoading"
          />
        </div>

        <div v-if="error" class="register-view__error">{{ error }}</div>

        <button
          type="submit"
          class="register-view__submit-btn"
          :disabled="isLoading"
        >
          {{ isLoading ? "注册中..." : "注册" }}
        </button>

        <p class="register-view__login-link">
          已有账号？
          <button
            type="button"
            class="register-view__login-btn"
            @click="handleLogin"
          >
            立即登录
          </button>
        </p>
      </form>
    </div>
  </div>
</template>

<style scoped>
.register-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.register-view__container {
  width: 100%;
  max-width: 400px;
  background-color: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.register-view__logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
  color: #3b82f6;
}

.register-view__title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 16px 0 4px;
}

.register-view__subtitle {
  font-size: 14px;
  color: #64748b;
}

.register-view__form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.register-view__form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.register-view__label {
  font-size: 14px;
  font-weight: 500;
  color: #334155;
}

.register-view__input {
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.register-view__input:focus {
  border-color: #3b82f6;
}

.register-view__input:disabled {
  background-color: #f8fafc;
}

.register-view__error {
  padding: 10px 12px;
  background-color: #fef2f2;
  color: #dc2626;
  border-radius: 6px;
  font-size: 13px;
}

.register-view__submit-btn {
  padding: 14px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.register-view__submit-btn:hover:not(:disabled) {
  background-color: #2563eb;
}

.register-view__submit-btn:disabled {
  background-color: #94a3b8;
  cursor: not-allowed;
}

.register-view__login-link {
  text-align: center;
  font-size: 14px;
  color: #64748b;
}

.register-view__login-btn {
  background: none;
  border: none;
  color: #3b82f6;
  cursor: pointer;
  text-decoration: underline;
}
</style>
