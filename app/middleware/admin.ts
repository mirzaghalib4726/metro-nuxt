import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { useAuthStore } from '~/store/auth';

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();
  await authStore.initialize();

  if (!authStore.isAuthenticated) {
    return navigateTo({ path: '/auth/login', query: { redirect: to.fullPath } });
  }

  if (authStore.user?.role !== 'admin') {
    return navigateTo('/');
  }
});
