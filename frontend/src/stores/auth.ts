/**
 * 认证状态管理 - Pinia store
 *
 * 功能说明：
 * - 管理用户登录状态
 * - 处理登录、注册、退出操作
 * - 维护 JWT token 和用户信息
 * - 支持页面刷新后自动恢复登录状态
 * - 退出时自动跳转登录页
 *
 * 状态字段：
 * - user: 当前登录用户信息
 * - token: JWT 认证令牌
 * - isLoggedIn: 是否已登录（计算属性）
 *
 * 使用方法：
 * ```typescript
 * const authStore = useAuthStore();
 * await authStore.login({ email, password });
 * ```
 */

import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { User, LoginDto, RegisterDto, ApiResponse } from "../types";
import axios from "../utils/axios";
import router from "../router";

export const useAuthStore = defineStore("auth", () => {
  /** 当前登录用户信息 */
  const user = ref<User | null>(null);

  /** JWT 认证令牌 */
  const token = ref<string | null>(null);

  /** 是否已登录（计算属性） */
  const isLoggedIn = computed(() => !!token.value);

  /**
   * 初始化认证状态
   * 从 localStorage 恢复之前保存的 token 和用户信息
   */
  const initAuth = () => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      token.value = savedToken;
      user.value = JSON.parse(savedUser);
    }
  };

  /**
   * 用户登录
   *
   * @param dto - 登录信息（email, password）
   */
  const login = async (dto: LoginDto): Promise<void> => {
    const response = await axios.post<
      ApiResponse<{ user: User; token: string }>
    >("/auth/login", dto);
    if (response.data.success) {
      user.value = response.data.data.user;
      token.value = response.data.data.token;
      localStorage.setItem("token", token.value);
      localStorage.setItem("user", JSON.stringify(user.value));
    } else {
      throw new Error(response.data.message);
    }
  };

  /**
   * 用户注册
   *
   * @param dto - 注册信息（email, password, nickname可选）
   */
  const register = async (dto: RegisterDto): Promise<void> => {
    const response = await axios.post<ApiResponse<User>>("/auth/register", dto);
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
  };

  /**
   * 用户退出登录
   * 清除本地状态和 localStorage，并重定向到登录页
   */
  const logout = (): void => {
    user.value = null;
    token.value = null;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return {
    user,
    token,
    isLoggedIn,
    initAuth,
    login,
    register,
    logout,
  };
});
