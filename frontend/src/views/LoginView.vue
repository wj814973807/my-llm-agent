<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const error = ref("");
const isLoading = ref(false);

const handleSubmit = async () => {
  error.value = "";

  if (!email.value || !password.value) {
    error.value = "请填写邮箱和密码";
    return;
  }

  isLoading.value = true;

  try {
    await authStore.login({ email: email.value, password: password.value });
    await router.push("/");
  } catch (err: any) {
    error.value = err.message || "登录失败";
  } finally {
    isLoading.value = false;
  }
};

const handleRegister = () => {
  router.push("/register");
};
</script>

<template>
  <div class="login-view">
    <div class="login-view__container">
      <div class="login-view__logo">
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
        <h1 class="login-view__title">AI客服系统</h1>
        <p class="login-view__subtitle">专业的智能客服助手</p>
      </div>

      <form class="login-view__form" @submit.prevent="handleSubmit">
        <div class="login-view__form-group">
          <label class="login-view__label">邮箱</label>
          <input
            v-model="email"
            type="email"
            placeholder="请输入邮箱"
            class="login-view__input"
            :disabled="isLoading"
          />
        </div>

        <div class="login-view__form-group">
          <label class="login-view__label">密码</label>
          <input
            v-model="password"
            type="password"
            placeholder="请输入密码"
            class="login-view__input"
            :disabled="isLoading"
          />
        </div>

        <div v-if="error" class="login-view__error">{{ error }}</div>

        <button
          type="submit"
          class="login-view__submit-btn"
          :disabled="isLoading"
        >
          {{ isLoading ? "登录中..." : "登录" }}
        </button>

        <p class="login-view__register-link">
          还没有账号？
          <button
            type="button"
            class="login-view__register-btn"
            @click="handleRegister"
          >
            立即注册
          </button>
        </p>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-view__container {
  width: 100%;
  max-width: 400px;
  background-color: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.login-view__logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
  color: #3b82f6;
}

.login-view__title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 16px 0 4px;
}

.login-view__subtitle {
  font-size: 14px;
  color: #64748b;
}

.login-view__form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.login-view__form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.login-view__label {
  font-size: 14px;
  font-weight: 500;
  color: #334155;
}

.login-view__input {
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.login-view__input:focus {
  border-color: #3b82f6;
}

.login-view__input:disabled {
  background-color: #f8fafc;
}

.login-view__error {
  padding: 10px 12px;
  background-color: #fef2f2;
  color: #dc2626;
  border-radius: 6px;
  font-size: 13px;
}

.login-view__submit-btn {
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

.login-view__submit-btn:hover:not(:disabled) {
  background-color: #2563eb;
}

.login-view__submit-btn:disabled {
  background-color: #94a3b8;
  cursor: not-allowed;
}

.login-view__register-link {
  text-align: center;
  font-size: 14px;
  color: #64748b;
}

.login-view__register-btn {
  background: none;
  border: none;
  color: #3b82f6;
  cursor: pointer;
  text-decoration: underline;
}
</style>
