import { defineNuxtPlugin, useCookie, useRuntimeConfig } from '#imports';
import { useAuthStore } from '~/store/auth';
import { useCartStore } from '~/store/cart';

export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();
  const cartStore = useCartStore();

  const tokenCookie = useCookie<string | null>('metro_token');

  const getAuthToken = () => {
    if (authStore.token) {
      return authStore.token;
    }

    if (tokenCookie.value) {
      return tokenCookie.value;
    }

    if (process.client) {
      return localStorage.getItem('metro_token');
    }

    return null;
  };

  const apiFetch = $fetch.create({
    baseURL: config.public.apiBase || '/api/v1',
    credentials: 'include',
    onRequest: ({ options }) => {
      const token = getAuthToken();
      const headers =
        options.headers instanceof Headers
          ? options.headers
          : new Headers(options.headers as HeadersInit | undefined);

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      options.headers = headers;
    },
    onResponseError: ({ response }) => {
      if (response.status === 401) {
        authStore.logout({ keepStorage: false });
      }
    },
  });

  nuxtApp.provide('apiFetch', apiFetch);

  await authStore.initialize();

  if (process.client) {
    cartStore.hydrate();
  }
});
