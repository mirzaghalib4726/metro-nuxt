<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {{ isLogin ? 'Sign in to your account' : 'Create a new account' }}
        </h2>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm space-y-4">
          <!-- Name Field (only for registration) -->
          <div v-if="!isLogin">
            <label for="name" class="sr-only">Full Name</label>
            <input
              id="name"
              v-model="formData.name"
              name="name"
              type="text"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Full Name"
            >
          </div>
          
          <!-- Email Field -->
          <div>
            <label for="email-address" class="sr-only">Email address</label>
            <input
              id="email-address"
              v-model="formData.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              :class="isLogin ? 'rounded-t-md' : ''"
              placeholder="Email address"
            >
          </div>
          
          <!-- Password Field -->
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              v-model="formData.password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              :class="isLogin ? 'rounded-b-md' : ''"
              placeholder="Password"
            >
          </div>
          
          <!-- Confirm Password (only for registration) -->
          <div v-if="!isLogin">
            <label for="confirm-password" class="sr-only">Confirm Password</label>
            <input
              id="confirm-password"
              v-model="formData.confirmPassword"
              name="confirm-password"
              type="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Confirm Password"
            >
          </div>
        </div>

        <div v-if="error" class="text-red-500 text-sm text-center">
          {{ error }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg v-if="loading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ isLogin ? 'Sign in' : 'Sign up' }}
          </button>
        </div>
      </form>
      
      <div class="text-center">
        <button
          @click="toggleMode"
          class="text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
        >
          {{ isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter, useRoute } from '#imports';

const props = defineProps<{
  initialMode?: 'login' | 'register';
}>();

const emit = defineEmits(['success']);
const router = useRouter();
const route = useRoute();

const isLogin = ref(props.initialMode ? props.initialMode === 'login' : true);
const loading = ref(false);
const error = ref('');

const formData = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const toggleMode = () => {
  isLogin.value = !isLogin.value;
  error.value = '';
};

const validateForm = () => {
  if (!isLogin.value && formData.password !== formData.confirmPassword) {
    error.value = 'Passwords do not match';
    return false;
  }
  if (formData.password.length < 6) {
    error.value = 'Password must be at least 6 characters';
    return false;
  }
  return true;
};

const handleSubmit = async () => {
  if (!validateForm()) return;
  
  loading.value = true;
  error.value = '';
  
  try {
    const { $apiFetch } = useNuxtApp();
    const endpoint = isLogin.value ? '/auth/login' : '/auth/register';
    const data = await $apiFetch<{
      success?: boolean;
      token?: string;
      user?: any;
      message?: string;
    }>(endpoint, {
      method: 'POST',
      body: {
        ...(isLogin.value ? {} : { name: formData.name }),
        email: formData.email,
        password: formData.password,
      },
    });
    
    if (!data || (isLogin.value && !data.token)) {
      throw new Error(data?.message || 'Something went wrong');
    }
    
    // Save token and user data
    if (process.client && data.token) {
      localStorage.setItem('metro_token', data.token);
      if (data.user) {
        localStorage.setItem('metro_user', JSON.stringify(data.user));
      }
    }
    
    // Emit success event
    emit('success');
    
    // Redirect to home or intended page
    const redirect = route.query.redirect;
    const redirectTo = Array.isArray(redirect) ? redirect[0] : redirect;
    await router.push(redirectTo || '/');
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'An error occurred. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>
