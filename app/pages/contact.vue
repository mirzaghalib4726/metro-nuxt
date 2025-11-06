<template>
  <div class="page">
    <header class="page__header">
      <span class="badge">Support</span>
      <h1 class="page__title">Let’s build memorable retail experiences together</h1>
      <p class="page__subtitle">
        Whether you are onboarding your catalogue, tracking an order, or exploring a partnership, the Metro team is here
        to help. Tell us what you need and we’ll respond within one business day.
      </p>
    </header>

    <section class="page-grid page-grid--two" style="align-items:start;">
      <div class="page-grid" style="gap:24px;">
        <article class="info-card">
          <span class="badge">Talk with a specialist</span>
          <h2 class="info-card__title">Direct channels</h2>
          <p class="info-card__meta">
            Reach the right team immediately. We route every message to the people best equipped to solve it.
          </p>

          <div style="display:grid; gap:18px;">
            <div v-for="channel in contactGroups" :key="channel.title" style="display:grid; gap:6px;">
              <p style="margin:0; font-weight:600; color:var(--slate-900);">{{ channel.title }}</p>
              <p class="text-muted" style="margin:0;">{{ channel.summary }}</p>
              <div style="display:flex; gap:12px; flex-wrap:wrap;">
                <a :href="`mailto:${channel.email}`" class="btn btn--ghost" style="padding:6px 14px;">
                  {{ channel.email }}
                </a>
                <a :href="`tel:${channel.phone.replace(/[^0-9+]/g, '')}`" class="btn btn--ghost" style="padding:6px 14px;">
                  {{ channel.phone }}
                </a>
              </div>
            </div>
          </div>
        </article>

        <article class="info-card">
          <span class="badge">Hours & updates</span>
          <h2 class="info-card__title">When we’re online</h2>
          <div style="display:grid; gap:12px;">
            <div v-for="slot in officeHours" :key="slot.label" style="display:flex; justify-content:space-between; gap:16px;">
              <span style="font-weight:600; color:var(--slate-500);">{{ slot.label }}</span>
              <span style="color:var(--slate-900); font-weight:500;">{{ slot.value }}</span>
            </div>
          </div>
          <div style="border-top:1px solid rgba(148,163,184,0.18); padding-top:18px; display:grid; gap:12px;">
            <p style="margin:0; font-weight:600; color:var(--slate-900);">Follow along</p>
            <div style="display:flex; gap:14px; flex-wrap:wrap;">
              <a v-for="link in socialLinks" :key="link.label" :href="link.href" class="btn btn--ghost" style="padding:6px 16px;">
                {{ link.label }} · {{ link.handle }}
              </a>
            </div>
          </div>
        </article>
      </div>

      <form class="info-card form-grid" @submit.prevent="handleSubmit">
        <span class="badge">Send us a note</span>
        <h2 class="info-card__title">We reply within 24 hours</h2>

        <div class="form-grid" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr));">
          <label class="form-row">
            <span class="label">Name</span>
            <input v-model="formState.name" type="text" class="input-field" placeholder="Your full name" required />
          </label>

          <label class="form-row">
            <span class="label">Email</span>
            <input v-model="formState.email" type="email" class="input-field" placeholder="you@studio.com" required />
          </label>
        </div>

        <label class="form-row">
          <span class="label">Topic</span>
          <select v-model="formState.topic" class="input-field">
            <option v-for="topic in topics" :key="topic.value" :value="topic.value">
              {{ topic.label }}
            </option>
          </select>
        </label>

        <label class="form-row">
          <span class="label">Message</span>
          <textarea
            v-model="formState.message"
            rows="5"
            class="input-field"
            placeholder="How can we help?"
            required
          />
        </label>

        <label style="display:flex; align-items:center; gap:10px; font-size:0.9rem; color:var(--slate-500);">
          <input v-model="formState.updates" type="checkbox" />
          Keep me in the loop about Metro product releases.
        </label>

        <button type="submit" class="btn btn--primary" style="justify-content:center;">
          Submit message
        </button>
      </form>
    </section>

    <section>
      <header class="page__header" style="max-width:520px;">
        <span class="badge">Visit our studio</span>
        <h2 class="page__title" style="font-size:clamp(2rem,4vw,2.6rem);">Metro headquarters, San Francisco</h2>
        <p class="page__subtitle">
          Collaboration hubs in San Francisco, London, and Singapore keep us close to the communities we serve.
        </p>
      </header>
      <div class="map-placeholder">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 12.75a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M19.5 10.5c0 7.125-7.5 11.25-7.5 11.25S4.5 17.625 4.5 10.5a7.5 7.5 0 0115 0z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <p style="margin:0; font-weight:600; color:var(--slate-900);">{{ hqLocation.name }}</p>
        <p class="text-muted" style="margin:0;">{{ hqLocation.address }}</p>
        <a
          :href="hqLocation.mapLink"
          class="btn btn--ghost"
          style="padding:6px 16px; margin-top:8px;"
          target="_blank"
          rel="noopener"
        >
          Open in Maps
        </a>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

const contactGroups = [
  {
    title: 'Customer care',
    summary: 'Order updates, returns, product questions, and billing support.',
    email: 'support@metro.com',
    phone: '+1 (415) 555-2045',
  },
  {
    title: 'Retail partnerships',
    summary: 'Brand onboarding, merchandising collaborations, and wholesale inquiries.',
    email: 'partners@metro.com',
    phone: '+1 (415) 555-3141',
  },
  {
    title: 'Press & media',
    summary: 'Press kits, interview requests, and speaking opportunities.',
    email: 'press@metro.com',
    phone: '+1 (415) 555-1200',
  },
];

const officeHours = [
  { label: 'Live chat & phone', value: 'Mon – Fri · 8am – 6pm PT' },
  { label: 'Email follow-ups', value: 'Under 24 hours on weekdays' },
  { label: 'Priority support', value: '24/7 for enterprise plans' },
];

const socialLinks = [
  { label: 'Instagram', handle: '@metro.market', href: 'https://instagram.com' },
  { label: 'LinkedIn', handle: 'Metro Commerce', href: 'https://linkedin.com' },
  { label: 'Behance', handle: 'Metro Studio', href: 'https://behance.net' },
];

const topics = [
  { value: 'support', label: 'Customer support' },
  { value: 'partnerships', label: 'Brand partnerships' },
  { value: 'press', label: 'Press & media' },
  { value: 'careers', label: 'Careers at Metro' },
];

const hqLocation = {
  name: 'Metro HQ',
  address: '123 Market Street · San Francisco, CA 94105',
  mapLink: 'https://maps.google.com',
};

const formState = reactive({
  name: '',
  email: '',
  topic: topics[0].value,
  message: '',
  updates: false,
});

const handleSubmit = () => {
  console.info('Contact form submitted', { ...formState });
};
</script>
