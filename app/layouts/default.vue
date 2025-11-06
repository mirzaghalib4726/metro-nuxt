<template>
  <div class="app-shell">
    <header class="app-header">
      <div class="app-header__inner">
        <NuxtLink to="/" class="logo">
          <span class="logo__symbol">M</span>
          <span class="logo__text">
            Metro
            <span class="logo__caption">E-commerce</span>
          </span>
        </NuxtLink>

        <nav class="nav-links" aria-label="Main navigation">
          <NuxtLink
            v-for="link in primaryLinks"
            :key="link.to"
            :to="link.to"
            :class="['nav-links__item', { 'nav-links__item--active': isLinkActive(link.to) }]"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>

        <button
          type="button"
          class="mobile-nav-toggle"
          aria-label="Open navigation menu"
          @click="openMobileNav"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
        </button>

        <div class="app-header__actions">
          <NuxtLink to="/cart" class="btn btn--ghost cart-link">
            Cart
            <span v-if="cartCount > 0" class="cart-count">{{ cartCount }}</span>
          </NuxtLink>
          <NuxtLink to="/auth/login" class="btn btn--primary">Sign in</NuxtLink>
        </div>
      </div>
    </header>

    <div
      class="mobile-nav-backdrop"
      :class="{ 'is-active': isMobileNavOpen }"
      @click="closeMobileNav"
    />
    <nav class="mobile-nav" :class="{ 'is-open': isMobileNavOpen }" aria-label="Mobile navigation">
      <div class="mobile-nav__header">
        <NuxtLink to="/" class="logo" @click="closeMobileNav">
          <span class="logo__symbol">M</span>
          <span class="logo__text">
            Metro
            <span class="logo__caption">E-commerce</span>
          </span>
        </NuxtLink>
        <button type="button" class="mobile-nav__close" aria-label="Close navigation menu" @click="closeMobileNav">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M7 7l10 10M17 7L7 17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
        </button>
      </div>

      <div class="mobile-nav__links">
        <NuxtLink
          v-for="link in primaryLinks"
          :key="`mobile-${link.to}`"
          :to="link.to"
          class="mobile-nav__link"
          :class="{ 'nav-links__item--active': isLinkActive(link.to) }"
          @click="closeMobileNav"
        >
          {{ link.label }}
        </NuxtLink>
      </div>

      <div class="mobile-nav__actions">
        <NuxtLink to="/cart" class="btn btn--ghost" @click="closeMobileNav">Cart</NuxtLink>
        <NuxtLink to="/auth/login" class="btn btn--primary" @click="closeMobileNav">Sign in</NuxtLink>
      </div>
    </nav>

    <main class="app-main">
      <slot />
    </main>

    <footer class="app-footer">
      <div class="footer__inner">
        <div class="footer__meta">
          <NuxtLink to="/" class="logo">
            <span class="logo__symbol">M</span>
            <span class="logo__text">
              Metro
              <span class="logo__caption">E-commerce</span>
            </span>
          </NuxtLink>
          <p class="text-muted" style="margin-top: 16px;">
            Crafted for ambitious commerce teams. Discover products, manage orders, and earn trust with beautifully considered experiences.
          </p>
        </div>

        <div class="footer__nav">
          <div v-for="section in footerLinks" :key="section.title">
            <h3 class="footer__nav-title">{{ section.title }}</h3>
            <NuxtLink
              v-for="item in section.items"
              :key="item.label"
              :to="item.to"
              class="footer__link"
            >
              {{ item.label }}
            </NuxtLink>
          </div>
        </div>
      </div>
      <div class="footer__bottom">
        © {{ currentYear }} Metro Commerce. All rights reserved.
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute } from '#imports';
import { useCartStore } from '~/store/cart';

const route = useRoute();
const isMobileNavOpen = ref(false);
const initialBodyOverflow = ref('');

const cartStore = useCartStore();
const cartCount = computed(() => cartStore.totalItems);

const primaryLinks = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/about', label: 'About' },
  { to: '/blog', label: 'Stories' },
  { to: '/contact', label: 'Support' },
];

const footerLinks = [
  {
    title: 'Explore',
    items: [
      { label: 'New arrivals', to: '/products?sort=new' },
      { label: 'Best sellers', to: '/products?sort=top' },
      { label: 'Collections', to: '/products' },
      { label: 'Gift cards', to: '/products?category=gifts' },
    ],
  },
  {
    title: 'Company',
    items: [
      { label: 'About Metro', to: '/about' },
      { label: 'Careers', to: '/about#careers' },
      { label: 'Press', to: '/blog' },
      { label: 'Privacy policy', to: '/privacy' },
    ],
  },
  {
    title: 'Support',
    items: [
      { label: 'Help center', to: '/contact' },
      { label: 'Track order', to: '/orders' },
      { label: 'Returns', to: '/terms#returns' },
      { label: 'FAQs', to: '/contact#faq' },
    ],
  },
];

const currentYear = new Date().getFullYear();

const isLinkActive = (target: string) => {
  if (target === '/') {
    return route.path === '/';
  }

  return route.path === target || route.path.startsWith(`${target}/`);
};

const openMobileNav = () => {
  isMobileNavOpen.value = true;
};

const closeMobileNav = () => {
  isMobileNavOpen.value = false;
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeMobileNav();
  }
};

watch(
  () => route.path,
  () => {
    if (isMobileNavOpen.value) {
      closeMobileNav();
    }
  }
);

watch(
  isMobileNavOpen,
  (value) => {
    if (!process.client) return;

    if (value) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = initialBodyOverflow.value || '';
    }
  }
);

onMounted(() => {
  if (!process.client) return;

  initialBodyOverflow.value = document.body.style.overflow;
  window.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
  if (!process.client) return;

  document.body.style.overflow = initialBodyOverflow.value || '';
  window.removeEventListener('keydown', handleKeydown);
});
</script>
