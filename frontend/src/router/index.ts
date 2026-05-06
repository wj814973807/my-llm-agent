import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "chat",
      component: () => import("../views/ChatView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/RegisterView.vue"),
    },
  ],
});

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();
  authStore.initAuth();

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next("/login");
  } else if (
    (to.path === "/login" || to.path === "/register") &&
    authStore.isLoggedIn
  ) {
    next("/");
  } else {
    next();
  }
});

export default router;
