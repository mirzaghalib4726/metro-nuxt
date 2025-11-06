<template>
  <div class="page">
    <header class="page__header">
      <span class="badge">About Metro</span>
      <h1 class="page__title">Better ways to shop, sell, and scale</h1>
      <p class="page__subtitle">
        We orchestrate a marketplace where thoughtful brands and curious buyers meet. Every tool we craft is focused on
        elevating storytelling, trust, and fulfilment for modern commerce teams.
      </p>
    </header>

    <section class="stat-grid">
      <div v-for="stat in companyStats" :key="stat.label" class="stat-card">
        <span class="stat-card__value">{{ stat.value }}</span>
        <p style="margin:4px 0 2px; font-weight:600; font-size:0.95rem;">{{ stat.label }}</p>
        <p class="text-muted" style="margin:0; font-size:0.85rem;">{{ stat.caption }}</p>
      </div>
    </section>

    <section class="page-grid page-grid--two">
      <article v-for="feature in features" :key="feature.name" class="info-card">
        <div class="info-card__header">
          <div class="info-card__icon">
            <component :is="feature.icon" aria-hidden="true" />
          </div>
          <div>
            <h3 class="info-card__title">{{ feature.name }}</h3>
            <p class="info-card__meta">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </article>
    </section>

    <section class="page-grid page-grid--balanced">
      <article class="highlight-card" style="display:grid; gap:18px;">
        <span class="badge">Our mission</span>
        <h2 class="section__title">Commerce that feels curated, not commoditised</h2>
        <p class="text-muted">
          Metro combines editorial-grade merchandising with data intelligence so every interaction feels personal.
          From emerging makers to established retailers, we help teams launch immersive commerce experiences without
          sacrificing craft.
        </p>
        <p class="text-muted">
          We believe commerce should celebrate the people behind products. That is why we invest in storytelling
          tools, operational clarity, and sustainable supply chain partners across every region we serve.
        </p>
      </article>

      <article class="highlight-card" style="display:grid; gap:18px;">
        <span class="badge">What drives us</span>
        <ul class="bullet-list" style="margin:0;">
          <li v-for="pillar in culturePillars" :key="pillar">
            {{ pillar }}
          </li>
        </ul>
        <div class="info-card__footer">
          Backed by partners in 18 countries and aligned with B Corp-aligned reporting standards.
        </div>
      </article>
    </section>

    <section>
      <header class="page__header" style="max-width:520px;">
        <span class="badge">Meet the team</span>
        <h2 class="page__title" style="font-size:clamp(2rem,4vw,2.6rem);">People shaping the Metro experience</h2>
        <p class="page__subtitle">
          Designers, engineers, and operators who care deeply about building kinder, smarter retail journeys.
        </p>
      </header>
      <div class="team-grid">
        <article v-for="member in team" :key="member.name" class="team-card">
          <img :src="member.image" :alt="member.name" class="team-card__avatar" loading="lazy" />
          <h3 class="team-card__name">{{ member.name }}</h3>
          <p class="team-card__role">{{ member.role }}</p>
          <p class="team-card__bio">{{ member.bio }}</p>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ArrowPathIcon, ShieldCheckIcon, ShoppingBagIcon, TruckIcon } from '@heroicons/vue/24/outline';

const companyStats = [
  { label: 'Brands onboarded', value: '320+', caption: 'Independently curated makers on Metro' },
  { label: 'Orders orchestrated', value: '1.4M', caption: 'Fulfilments supported for partner teams' },
  { label: 'Customer satisfaction', value: '4.9/5', caption: 'Average rating across support touchpoints' },
];

const features = [
  {
    name: 'Curated selection',
    description: 'Our merchandising team vets every brand to ensure storytelling, sustainability, and supply readiness.',
    icon: ShoppingBagIcon,
  },
  {
    name: 'Fulfilment with heart',
    description: 'From same-day dispatch to conscious delivery windows, Metro keeps logistics transparent for buyers.',
    icon: TruckIcon,
  },
  {
    name: 'Privacy-first payments',
    description: '256-bit encryption and tokenised payments create trust without trading off conversion rates.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Returns redesigned',
    description: 'Smart routing, automated labels, and customer-friendly policies built to keep items in circulation.',
    icon: ArrowPathIcon,
  },
];

const culturePillars = [
  'Pairing data with editorial instincts so every product story lands with purpose.',
  'Championing inclusive design and accessibility across storefronts and dashboards.',
  'Building resilient operations with partners who prioritise ethical production.',
];

const team = [
  {
    name: 'Alex Johnson',
    role: 'Founder & CEO',
    bio: 'Leads vision and partnerships, shaping how Metro empowers independent retailers worldwide.',
    image: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=facearea&w=320&h=320&q=80',
  },
  {
    name: 'Sarah Williams',
    role: 'Chief Experience Officer',
    bio: 'Keeps every touchpoint intentional, from product discovery to white-glove customer support.',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=facearea&w=320&h=320&q=80',
  },
  {
    name: 'Michael Chen',
    role: 'Head of Operations',
    bio: 'Partners with fulfilment teams to keep shipping agile, sustainable, and reliability obsessed.',
    image: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=facearea&w=320&h=320&q=80',
  },
  {
    name: 'Priya Patel',
    role: 'Director of Merchandising',
    bio: 'Curates product stories, ensures brand fit, and nurtures our community of emerging makers.',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=facearea&w=320&h=320&q=80',
  },
];
</script>
