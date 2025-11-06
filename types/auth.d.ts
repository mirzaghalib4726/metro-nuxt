import type { Ref } from 'vue';
import type { IUser } from '~/server/models/User';

declare module '#app' {
  interface NuxtApp {
    $auth: {
      user: Ref<IUser | null>;
      isAuthenticated: Ref<boolean>;
      login: (credentials: { email: string; password: string }) => Promise<any>;
      logout: () => void;
    };
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $auth: {
      user: Ref<IUser | null>;
      isAuthenticated: Ref<boolean>;
      login: (credentials: { email: string; password: string }) => Promise<any>;
      logout: () => void;
    };
  }
}

export {};
