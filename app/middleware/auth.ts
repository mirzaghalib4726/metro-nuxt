import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { useAuthStore } from '~/store/auth';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore();

  await authStore.initialize();

  if (!authStore.isAuthenticated) {
    return navigateTo({ path: '/auth/login', query: { redirect: to.fullPath } });
  }

  // You can add permission checks here if needed
  // const requiredPermission = to.meta.permission;
  // if (requiredPermission && !hasPermission(user, requiredPermission)) {
  //   return navigateTo('/403');
  // }
});
