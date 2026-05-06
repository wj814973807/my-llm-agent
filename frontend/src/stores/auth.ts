import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { User, LoginDto, RegisterDto, ApiResponse } from "../types";
import axios from "../utils/axios";
import router from "../router";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);

  const isLoggedIn = computed(() => !!token.value);

  const initAuth = () => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      token.value = savedToken;
      user.value = JSON.parse(savedUser);
    }
  };

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

  const register = async (dto: RegisterDto): Promise<void> => {
    const response = await axios.post<ApiResponse<User>>("/auth/register", dto);
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
  };

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
