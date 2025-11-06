<template>
  <div class="auth-layout" style="grid-template-columns: minmax(0, 1fr);">
    <aside class="auth-side">
      <div style="display:grid; gap:18px;">
        <NuxtLink to="/" class="logo" style="color:#fff;">
          <span class="logo__symbol" style="background:rgba(255,255,255,0.2); box-shadow:none;">M</span>
          <span class="logo__text" style="color:#fff;">
            Metro
            <span class="logo__caption" style="color:rgba(255,255,255,0.6);">E-commerce</span>
          </span>
        </NuxtLink>
        <span class="badge" style="background:rgba(255,255,255,0.15); color:#fff;">Onboard in minutes</span>
        <h1 style="font-family:var(--font-display); font-size:2.6rem; line-height:1.15;">Build meaningful commerce experiences with Metro’s adaptive platform</h1>
        <p style="color:rgba(255,255,255,0.75); font-size:0.95rem;">
          From curated storytelling to logistics, Metro empowers teams to launch confident storefronts and grow communities with purpose.
        </p>
      </div>

      <div class="auth-side__stats">
        <div class="stat-card" style="background:rgba(255,255,255,0.14); box-shadow:none; border:none; color:#fff;">
          <span class="stat-card__value" style="color:#fff;">48h</span>
          <p style="margin:0; font-size:0.85rem; color:rgba(255,255,255,0.8);">Average launch time for curated storefronts</p>
        </div>
        <div class="stat-card" style="background:rgba(255,255,255,0.14); box-shadow:none; border:none; color:#fff;">
          <span class="stat-card__value" style="color:#fff;">4.9★</span>
          <p style="margin:0; font-size:0.85rem; color:rgba(255,255,255,0.8);">Customer satisfaction across Metro partners</p>
        </div>
      </div>
    </aside>

    <div class="auth-form-wrapper">
      <form class="auth-card" @submit.prevent="handleSubmit">
        <div style="text-align:center; display:grid; gap:8px;">
          <h2 style="margin:0; font-family:var(--font-display); font-size:2rem;">Create your Metro account</h2>
          <p class="text-muted" style="font-size:0.95rem;">
            Already collaborating?
            <NuxtLink to="/auth/login" class="btn btn--ghost" style="padding:4px 10px; margin-left:6px;">Sign in</NuxtLink>
          </p>
        </div>

        <div class="form-grid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));">
          <label class="form-row">
            <span class="label">Full name</span>
            <input v-model="formData.name" type="text" class="input-field" required placeholder="Jordan Lee" />
          </label>
          <label class="form-row">
            <span class="label">Company</span>
            <input v-model="formData.company" type="text" class="input-field" placeholder="Metro Studio" />
          </label>
        </div>

        <label class="form-row">
          <span class="label">Email</span>
          <input v-model="formData.email" type="email" class="input-field" required placeholder="teamlead@brand.com" />
        </label>

        <div class="form-grid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));">
          <label class="form-row">
            <span class="label">Password</span>
            <input v-model="formData.password" type="password" class="input-field" required placeholder="Create a strong password" />
          </label>
          <label class="form-row">
            <span class="label">Confirm</span>
            <input v-model="formData.confirmPassword" type="password" class="input-field" required placeholder="Repeat password" />
          </label>
        </div>

        <label class="form-row" style="flex-direction:row; align-items:flex-start; gap:12px; margin-top:8px;">
          <input v-model="formData.acceptTerms" type="checkbox" required style="margin-top:4px;" />
          <span class="text-muted" style="font-size:0.9rem;">
            I agree to Metro’s <NuxtLink to="/terms" class="btn btn--ghost" style="padding:0 6px;">Terms</NuxtLink> and
            <NuxtLink to="/privacy" class="btn btn--ghost" style="padding:0 6px;">Privacy Policy</NuxtLink>.
          </span>
        </label>

        <button
          type="submit"
          class="btn btn--primary"
          style="width:100%; justify-content:center;"
          :disabled="loading"
          :style="loading ? 'opacity:0.7; pointer-events:none;' : ''"
        >
          {{ loading ? 'Creating your workspace…' : 'Create account' }}
        </button>

        <div v-if="Object.keys(errors).length" style="padding:12px 16px; border-radius:14px; background:#fee2e2; color:#b91c1c; font-size:0.9rem;">
          Please address the highlighted fields and try again.
        </div>

        <div v-if="formError" style="padding:12px 16px; border-radius:14px; background:#fee2e2; color:#b91c1c; font-size:0.9rem;">
          {{ formError }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useNuxtApp, useRuntimeConfig } from '#imports';
import { $fetch } from 'ofetch';

const loading = ref(false);
const errors = reactive<Record<string, string>>({});
const formError = ref('');

const formData = reactive({
  name: '',
  company: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
});

const validate = () => {
  errors.name = formData.name ? '' : 'Please enter your name.';
  errors.email = /.+@.+\..+/.test(formData.email) ? '' : 'Add a valid email address.';
  errors.password = formData.password.length >= 8 ? '' : 'Password must be at least 8 characters.';
  errors.confirmPassword = formData.password === formData.confirmPassword ? '' : 'Passwords need to match.';
  errors.acceptTerms = formData.acceptTerms ? '' : '';

  formError.value = '';
  return Object.values(errors).every((value) => value === '');
};

const nuxtApp = useNuxtApp();
const config = useRuntimeConfig();

const resolveApiFetch = () => {
  const instance = (nuxtApp as any).$apiFetch;
  if (instance) {
    return instance;
  }
  return $fetch.create({
    baseURL: config.public.apiBase || '/api/v1',
  });
};

const handleSubmit = async () => {
  if (!validate() || loading.value) {
    return;
  }

  try {
    loading.value = true;

    const apiFetch = resolveApiFetch();

    const response = await apiFetch<{
      success?: boolean;
      message?: string;
    }>('/auth/register', {
      method: 'POST',
      body: {
        name: formData.name,
        company: formData.company,
        email: formData.email,
        password: formData.password,
      },
    });

    if (response && response.success === false) {
      throw new Error(response.message || 'Registration failed. Please try again.');
    }

    await navigateTo({ path: '/auth/login', query: { registered: '1' } });
  } catch (err) {
    formError.value = err instanceof Error ? err.message : 'Registration failed. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>
