<template>
  <div class="auth-layout" style="grid-template-columns: minmax(0, 1fr);">
    <aside class="auth-side">
      <div style="display:grid; gap:18px;">
        <NuxtLink to="/" class="logo" style="color:#fff;">
          <span class="logo__symbol" style="background:rgba(255,255,255,0.2); box-shadow:none;">M</span>
          <span class="logo__text" style="color:#fff;">
            Metro
+            <span class="logo__caption" style="color:rgba(255,255,255,0.6);">E-commerce</span>
          </span>
        </NuxtLink>
        <span class="badge" style="background:rgba(255,255,255,0.15); color:#fff;">Welcome back</span>
        <h1 style="font-family:var(--font-display); font-size:2.6rem; line-height:1.15;">Enter the workspace crafted for modern commerce teams</h1>
        <p style="color:rgba(255,255,255,0.75); font-size:0.95rem;">
          Access insights, manage catalogue updates, and keep your customer experience evolving with Metro.
        </p>
      </div>

      <div class="auth-side__stats">
        <div class="stat-card" style="background:rgba(255,255,255,0.14); box-shadow:none; border: none; color:#fff;">
          <span class="stat-card__value" style="color:#fff;">+32%</span>
          <p style="margin:0; font-size:0.85rem; color:rgba(255,255,255,0.8);">Conversion uplift across Metro partners</p>
        </div>
        <div class="stat-card" style="background:rgba(255,255,255,0.14); box-shadow:none; border: none; color:#fff;">
          <span class="stat-card__value" style="color:#fff;">48h</span>
          <p style="margin:0; font-size:0.85rem; color:rgba(255,255,255,0.8);">Average launch time for curated storefronts</p>
        </div>
      </div>
    </aside>

    <div class="auth-form-wrapper">
      <form class="auth-card" @submit.prevent="handleLogin">
        <div style="text-align:center; display:grid; gap:8px;">
          <h2 style="margin:0; font-family:var(--font-display); font-size:2rem;">Sign in to Metro</h2>
          <p v-if="justRegistered" style="padding:10px 16px; border-radius:14px; background:#dcfce7; color:#15803d; font-size:0.9rem; margin:0;">
            Account created. You can sign in with your new credentials.
          </p>
          <p class="text-muted" style="font-size:0.95rem;">
            New here?
            <NuxtLink to="/auth/register" class="btn btn--ghost" style="padding:4px 10px; margin-left:6px;">Create an account</NuxtLink>
          </p>
        </div>

        <div class="form-grid">
          <label class="form-row">
            <span class="label">Email</span>
            <input
              id="email-address"
              v-model="formData.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="input-field"
              placeholder="you@brandteam.com"
            />
          </label>

          <label class="form-row">
            <span class="label">Password</span>
            <input
              id="password"
              v-model="formData.password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="input-field"
              placeholder="••••••••"
            />
          </label>
        </div>

        <div style="display:flex; justify-content:space-between; font-size:0.9rem;">
          <label style="display:flex; align-items:center; gap:8px; color:var(--slate-500);">
            <input v-model="formData.rememberMe" type="checkbox" />
            Keep me signed in
          </label>
          <NuxtLink to="/auth/forgot" class="btn btn--ghost" style="padding:6px 12px;">Forgot password?</NuxtLink>
        </div>

        <button
          type="submit"
          class="btn btn--primary"
          style="width:100%; justify-content:center;"
          :disabled="loading"
          :style="loading ? 'opacity:0.7; pointer-events:none;' : ''"
        >
          {{ loading ? 'Signing you in…' : 'Access workspace' }}
        </button>

        <p v-if="error" style="margin:0; padding:12px 16px; border-radius:14px; background:#fee2e2; color:#b91c1c; font-size:0.9rem;">
          {{ error }}
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from '#imports';
import { useAuthStore } from '~/store/auth';

const authStore = useAuthStore();
const loading = ref(false);
const error = ref('');
const route = useRoute();
const router = useRouter();

const justRegistered = computed(() => route.query.registered === '1');

const formData = ref({
  email: '',
  password: '',
  rememberMe: false,
});

const handleLogin = async () => {
  if (!formData.value.email || !formData.value.password) {
    error.value = 'Email and password are required.';
    return;
  }

  try {
    loading.value = true;
    error.value = '';

    await authStore.login({
      email: formData.value.email,
      password: formData.value.password,
    });

    await navigateTo('/', { replace: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unable to sign in. Please try again.';
    error.value = message;
    console.error('Login error:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (route.query.registered === '1') {
    const nextQuery = { ...route.query };
    delete (nextQuery as Record<string, any>).registered;
    router.replace({ path: route.path, query: nextQuery });
  }
});
</script>
