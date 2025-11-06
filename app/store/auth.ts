import { defineStore } from 'pinia';
import { useCookie, useNuxtApp, useRuntimeConfig } from '#imports';
import { $fetch } from 'ofetch';
import type { User } from '~/types';

const TOKEN_COOKIE_KEY = 'metro_token';
const TOKEN_STORAGE_KEY = 'metro_token';
const USER_STORAGE_KEY = 'metro_user';

interface AuthState {
  user: User | null;
  token: string | null;
  initialized: boolean;
  status: 'idle' | 'loading';
  error: string | null;
}

interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    initialized: false,
    status: 'idle',
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => Boolean(state.token && state.user),
  },

  actions: {
    setAuth(token: string, user: User) {
      this.token = token;
      this.user = user;

      const tokenCookie = useCookie<string | null>(TOKEN_COOKIE_KEY);
      tokenCookie.value = token;

      if (process.client) {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      }
    },

    async initialize() {
      if (this.initialized) {
        return;
      }

      const tokenCookie = useCookie<string | null>(TOKEN_COOKIE_KEY);
      const storedToken =
        tokenCookie.value || (process.client ? localStorage.getItem(TOKEN_STORAGE_KEY) : null);

      if (storedToken) {
        this.token = storedToken;
      }

      if (process.client) {
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);
        if (storedUser) {
          try {
            this.user = JSON.parse(storedUser) as User;
          } catch (error) {
            // eslint-disable-next-line no-console
            console.warn('Unable to parse stored user profile', error);
            this.user = null;
          }
        }
      }

      this.initialized = true;

      if (this.token && !this.user) {
        try {
          await this.fetchCurrentUser();
        } catch (error) {
          // eslint-disable-next-line no-console
          console.warn('Failed to hydrate user profile', error);
          this.logout({ keepStorage: false });
        }
      }
    },

    resolveApiFetch() {
      const nuxtApp = useNuxtApp();
      const instance = (nuxtApp as any).$apiFetch;
      if (instance) {
        return instance;
      }

      const config = useRuntimeConfig();
      return $fetch.create({
        baseURL: config.public.apiBase || '/api/v1',
      });
    },

    async fetchCurrentUser() {
      if (!this.token) return;

      const apiFetch = this.resolveApiFetch();
      const response = await apiFetch<{ success: boolean; user: User }>('/auth/me');

      if (!response?.success) {
        throw new Error('Unable to fetch current user');
      }

      this.user = response.user;

      if (process.client) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));
      }
    },

    async login(credentials: { email: string; password: string }) {
      this.status = 'loading';
      this.error = null;

      try {
        const apiFetch = this.resolveApiFetch();
        const response = await apiFetch<AuthResponse>('/auth/login', {
          method: 'POST',
          body: credentials,
        });

        if (!response?.success || !response.token) {
          throw new Error(response?.message || 'Login failed');
        }

        this.setAuth(response.token, response.user);
        return response;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Unable to sign in. Please try again.';
        this.error = message;
        throw new Error(message);
      } finally {
        this.status = 'idle';
      }
    },

    logout(options: { keepStorage?: boolean } = {}) {
      this.user = null;
      this.token = null;
      this.error = null;

      const tokenCookie = useCookie<string | null>(TOKEN_COOKIE_KEY);
      tokenCookie.value = null;

      if (!options.keepStorage && process.client) {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    },
  },
});
