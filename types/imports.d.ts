// Add type declarations for Nuxt auto-imports
declare module '#imports' {
  export * from '#app';
  export * from '@nuxt/schema';
  export * from '@nuxt/schema';
  export * from 'vue';
  export * from 'vue-router';
  export * from '@pinia/nuxt';
  export * from '#app/nuxt';
  export * from '@nuxt/kit';
  export * from 'h3';
  export * from '@vueuse/core';
  export * from '@vueuse/head';
  export * from 'ofetch';
  export * from 'ohmyfetch';
  export * from 'vue-demi';
  // Add any other modules you're using
}

// Fix for process.env typings
interface ImportMetaEnv {
  readonly NODE_ENV: string;
  readonly VITE_APP_TITLE: string;
  // Add other env variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Fix for process.client and process.server
declare namespace NodeJS {
  interface Process {
    client: boolean;
    server: boolean;
  }
}

declare const process: NodeJS.Process;
