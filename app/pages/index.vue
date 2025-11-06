<template>
  <div>
    <section class="hero">
      <div class="hero__inner">
        <div class="hero__content">
          <span class="badge">Shop the experience</span>
          <h1 class="hero__heading">
            A modern marketplace for thoughtful brands and curious buyers
          </h1>
          <p class="hero__text">
            Metro curates design-led essentials, emerging makers, and favourite staples. Explore collections tailored for the bold, the mindful, and the future-forward.
          </p>
          <div style="display:flex; gap:12px; flex-wrap:wrap;">
            <NuxtLink to="/products" class="btn btn--primary">Browse collections</NuxtLink>
            <NuxtLink to="/auth/register" class="btn btn--ghost">Create customer account</NuxtLink>
          </div>

          <div class="stat-grid">
            <div v-for="stat in heroStats" :key="stat.label" class="stat-card">
              <small style="text-transform:uppercase; letter-spacing:0.24em; font-size:0.7rem; color:var(--slate-400);">{{ stat.label }}</small>
              <span class="stat-card__value">{{ stat.value }}</span>
              <p class="text-muted" style="font-size:0.85rem; margin:0;">{{ stat.caption }}</p>
            </div>
          </div>
        </div>

        <div style="position:relative;">
          <div style="border-radius:var(--radius-large); overflow:hidden; box-shadow:var(--shadow-soft);">
            <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80" alt="Curated lifestyle" />
          </div>
          <div style="position:absolute; bottom:16px; left:24px; background:var(--surface); padding:16px 22px; border-radius:18px; box-shadow:var(--shadow-light);">
            <strong style="display:block; font-size:0.9rem;">Curated by Metro stylists</strong>
            <span class="text-muted" style="font-size:0.8rem;">Updated daily with new arrivals</span>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <header class="section__header">
          <h2 class="section__title">Discover live collections</h2>
          <p class="section__subtitle">{{ categorySubtitle }}</p>
        </header>

        <div v-if="categoriesLoading" class="product-catalog__loading">
          <div class="spinner" />
          <p>Loading collections…</p>
        </div>

        <div v-else-if="categoryError" class="product-catalog__empty">
          <h2>We couldn’t load categories</h2>
          <p>{{ categoryErrorMessage }}</p>
          <button type="button" class="btn btn--primary" @click="refreshAll">Retry</button>
        </div>

        <div v-else-if="categoryHighlights.length === 0" class="product-catalog__empty">
          <h2>No collections yet</h2>
          <p>Run the importer to seed categories and unlock curated browsing on the storefront.</p>
        </div>

        <div v-else class="category-grid">
          <article v-for="category in categoryHighlights" :key="category.id" class="category-card">
            <img :src="category.imageSrc" :alt="category.name" />
            <div class="category-card__body">
              <span class="badge" style="font-size:0.7rem; letter-spacing:0.22em;">{{ category.tagline }}</span>
              <h3 style="margin:8px 0 4px; font-family:var(--font-display); font-size:1.4rem;">{{ category.name }}</h3>
              <p class="text-muted" style="margin:0;">
                Starting at ${{ category.startingPrice.toFixed(2) }} · {{ category.itemCount }} designs
              </p>
              <div style="margin-top:18px; display:flex; justify-content:space-between; align-items:center;">
                <span class="text-muted" style="font-size:0.85rem;">Trending this week</span>
                <NuxtLink
                  :to="`/products?category=${encodeURIComponent(category.name)}`"
                  class="btn btn--ghost"
                  style="padding:8px 16px;"
                >
                  Explore
                </NuxtLink>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="section" style="background:var(--surface);">
      <div class="container">
        <header class="section__header">
          <h2 class="section__title">Featured picks for the season</h2>
          <p class="section__subtitle">{{ featuredSubtitle }}</p>
        </header>

        <div v-if="productsLoading" class="product-catalog__loading">
          <div class="spinner" />
          <p>Loading featured products…</p>
        </div>

        <div v-else-if="productError" class="product-catalog__empty">
          <h2>Products are still syncing</h2>
          <p>{{ productErrorMessage }}</p>
          <button type="button" class="btn btn--primary" @click="refreshAll">Retry</button>
        </div>

        <div v-else-if="featuredProducts.length === 0" class="product-catalog__empty">
          <h2>No featured picks just yet</h2>
          <p>Import or create products to surface editorial highlights on the homepage.</p>
        </div>

        <div v-else class="product-grid">
          <ProductCard
            v-for="product in featuredProducts"
            :key="product._id || product.id"
            :product="product"
            @add-to-cart="() => {}"
          />
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container" style="display:grid; gap:32px; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));">
        <article class="highlight-card" style="padding:32px; display:grid; gap:18px;">
          <span class="badge">Why teams choose Metro</span>
          <h2 class="section__title" style="font-size:1.9rem;">Built for visionary retailers and vibrant communities</h2>
          <p class="text-muted">
            Metro blends editorial-grade storytelling, data-led merchandising, and seamless checkout flows. Empower your brand with delightful experiences at every touchpoint.
          </p>
          <div style="display:grid; gap:16px; grid-template-columns:repeat(auto-fit, minmax(160px,1fr));">
            <div v-for="metric in platformHighlights" :key="metric.label" class="stat-card">
              <span class="stat-card__value" style="font-size:2rem;">{{ metric.value }}</span>
              <p style="margin:6px 0 2px; font-weight:600;">{{ metric.label }}</p>
              <p class="text-muted" style="margin:0; font-size:0.8rem;">{{ metric.caption }}</p>
            </div>
          </div>
        </article>

        <article class="highlight-card" style="padding:32px; display:grid; gap:24px;">
          <h3 class="section__title" style="font-size:1.8rem;">Voices from the Metro community</h3>
          <div class="testimonial-grid" style="gap:18px; grid-template-columns:1fr;">
            <div v-for="(testimonial, index) in testimonials" :key="index" style="padding:20px; border-radius:20px; border:1px solid rgba(148,163,184,0.18); background:var(--surface); box-shadow:var(--shadow-light);">
              <div style="display:flex; align-items:center; gap:14px;">
                <img :src="testimonial.avatar" :alt="testimonial.name" style="width:52px; height:52px; border-radius:50%; object-fit:cover;" />
                <div>
                  <strong>{{ testimonial.name }}</strong>
                  <p class="text-muted" style="margin:4px 0 0; font-size:0.8rem;">{{ testimonial.role }}</p>
                </div>
              </div>
              <p class="text-muted" style="margin-top:14px; font-size:0.9rem;">“{{ testimonial.text }}”</p>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="section">
      <div class="container" style="border-radius:var(--radius-large); background:linear-gradient(135deg, #0f172a, #1d4ed8); color:#fff; padding:54px 48px; text-align:center; box-shadow:var(--shadow-soft);">
        <span class="badge" style="background:rgba(255,255,255,0.12); color:#fff;">For ambitious teams</span>
        <h2 style="font-family:var(--font-display); font-size:2.6rem; margin:18px 0 12px;">Launch a best-in-class commerce experience with Metro</h2>
        <p style="max-width:520px; margin:0 auto 28px; font-size:1rem; color:rgba(255,255,255,0.82);">
          Start your journey today and unlock curated catalogues, dynamic merchandising, and seamless fulfillment.
        </p>
        <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap;">
          <NuxtLink to="/auth/register" class="btn btn--primary" style="background:#fff; color:#0f172a;">Create free account</NuxtLink>
          <NuxtLink to="/contact" class="btn btn--ghost" style="background:rgba(255,255,255,0.14); border-color:rgba(255,255,255,0.35); color:#fff;">Talk to our team</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ProductCard from '~/components/ProductCard.vue';
import { useProductsStore } from '~/store/products';
import { storeToRefs } from 'pinia';
import type { Product } from '~/types/product';

type CategoryHighlight = {
  id: string;
  name: string;
  itemCount: number;
  startingPrice: number;
  tagline: string;
  imageSrc: string;
};

const categoryVisuals: Record<string, { image: string; tagline: string }> = {
  'Electronics': {
    image: 'https://images.unsplash.com/photo-1510552776732-03e61cf4b144?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Precision tech for modern living',
  },
  'Music & Audio': {
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Soundscapes for every mood',
  },
  'Games & Entertainment': {
    image: 'https://images.unsplash.com/photo-1580128637393-f289c0dc5b6b?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Playful escapes for every crew',
  },
  'Clothing & Apparel': {
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Wardrobe heroes for every season',
  },
  'Jewelry': {
    image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Details crafted to shine',
  },
  'Beauty & Wellness': {
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Rituals to revive and restore',
  },
  'Home & Living': {
    image: 'https://images.unsplash.com/photo-1616627457224-4a96e0c3fdbc?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Spaces that feel like home',
  },
  'Home & Garden': {
    image: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Indoor comfort meets outdoor calm',
  },
  'Grocery & Gourmet': {
    image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Pantry staples with character',
  },
  'Books & Stationery': {
    image: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Pages and pens for curious minds',
  },
  'Sports & Fitness': {
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Gear that keeps pace with you',
  },
  "Kids' Collection": {
    image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Playful edits for little imaginations',
  },
  'Baby Essentials': {
    image: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Calm comforts for new arrivals',
  },
  'Outdoors & Adventure': {
    image: 'https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Ready for every trail ahead',
  },
  'Automotive': {
    image: 'https://images.unsplash.com/photo-1503739171234-22d547d351f9?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Everyday drives, elevated',
  },
  'Garden & Patio': {
    image: 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Grow lush, live vibrant',
  },
  'Computers & Tablets': {
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Performance tools for hybrid work',
  },
  'Shoes & Accessories': {
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Steps that make a statement',
  },
  'Toys & Learning': {
    image: 'https://images.unsplash.com/photo-1610530532171-9861932f67a6?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Curiosity sparked in every box',
  },
  'General': {
    image: 'https://images.unsplash.com/photo-1515169067865-5387ec356754?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Product stories in progress',
  },
};

const defaultCategoryVisual = categoryVisuals.General;

const normalizeKey = (value: string) => value.toLowerCase().replace(/[^a-z]/g, '');

const getCategoryVisual = (name: string) => {
  const target = normalizeKey(name);
  const match = Object.entries(categoryVisuals).find(
    ([label]) => normalizeKey(label) === target
  );
  return match ? match[1] : defaultCategoryVisual;
};

const productsStore = useProductsStore();

await productsStore.fetchProducts({ limit: 24 });
await productsStore.fetchCategories();

const {
  items: storeProducts,
  categories: storeCategories,
  loading: productsLoadingRef,
  error: productsErrorRef,
  categoryLoading: categoriesLoadingRef,
  categoryError: categoriesErrorRef,
} = storeToRefs(productsStore);

const products = computed<Product[]>(() => storeProducts.value);
const categories = computed(() => storeCategories.value);

const productsLoading = computed(() => productsLoadingRef.value);
const categoriesLoading = computed(() => categoriesLoadingRef.value);

const productError = computed(() => productsErrorRef.value);
const categoryError = computed(() => categoriesErrorRef.value);

const averageStock = computed(() => {
  if (products.value.length === 0) return 0;
  const total = products.value.reduce((acc, product) => acc + (product.stock ?? 0), 0);
  return Math.max(0, Math.round(total / products.value.length));
});

const heroStats = computed(() => {
  const categoryCount = categories.value.length;
  const productCount = products.value.length;
  const avgStock = averageStock.value;

  return [
    {
      label: 'Categories live',
      value: categoryCount ? `${categoryCount}` : '—',
      caption: 'Active collections available now',
    },
    {
      label: 'Products onboarded',
      value: productCount ? `${productCount}` : '—',
      caption: 'SKUs ready for shoppers',
    },
    {
      label: 'Avg. stock depth',
      value: productCount ? `${avgStock} units` : 'Syncing',
      caption: productCount
        ? 'Inventory per product across the catalogue'
        : 'Import the catalogue to populate stock',
    },
  ];
});

const categoryHighlights = computed(() => {
  if (products.value.length === 0) return [] as CategoryHighlight[];

  const stats = new Map<string, CategoryHighlight>();
  const categoriesById = new Map(
    categories.value.map((category) => [String(category.id), category])
  );

  for (const product of products.value) {
    const key = product.categoryId ? String(product.categoryId) : '__uncategorized';
    const categoryInfo = categoriesById.get(key);
    const name = categoryInfo?.name ?? product.category ?? 'Curated Picks';
    const visual = getCategoryVisual(name);
    const existing = stats.get(key);

    if (!existing) {
      stats.set(key, {
        id: key,
        name,
        itemCount: 1,
        startingPrice: product.price,
        tagline: visual.tagline,
        imageSrc: visual.image,
      });
    } else {
      existing.itemCount += 1;
      existing.startingPrice = Math.min(existing.startingPrice, product.price);
    }
  }

  return Array.from(stats.values())
    .sort((a, b) => {
      if (b.itemCount !== a.itemCount) return b.itemCount - a.itemCount;
      return a.startingPrice - b.startingPrice;
    })
    .slice(0, 4);
});

const categorySubtitle = computed(() => {
  if (categoriesLoading.value) return 'Syncing collections from the live catalogue.';
  if (categoryError.value) return 'We couldn’t reach the categories API just yet.';
  if (categoryHighlights.value.length === 0) {
    return 'Create categories from the admin workspace to unlock featured collections.';
  }
  return `Explore ${categoryHighlights.value.length} spotlight collections sourced from live catalogue data.`;
});

const featuredProducts = computed(() => {
  if (products.value.length === 0) return [] as Product[];

  return [...products.value]
    .sort((a, b) => {
      if ((b.rating ?? 0) !== (a.rating ?? 0)) {
        return (b.rating ?? 0) - (a.rating ?? 0);
      }
      if (b.stock !== a.stock) {
        return b.stock - a.stock;
      }
      return a.price - b.price;
    })
    .slice(0, 4);
});

const featuredSubtitle = computed(() => {
  if (productsLoading.value) return 'Loading editorial picks from the Metro catalogue.';
  if (productError.value) return 'Products are still syncing — refresh or retry shortly.';
  if (featuredProducts.value.length === 0) {
    return 'Add products from the admin dashboard to surface featured items here.';
  }
  return 'Elevated essentials surfaced from your live catalogue and ready to merchandise.';
});

const categoryErrorMessage = computed(() =>
  categoryHighlights.value.length === 0 && !categoriesLoading.value
    ? 'No collections yet — add a category in the dashboard to get started.'
    : 'Please refresh once the catalogue updates finish.'
);

const productErrorMessage = computed(() =>
  featuredProducts.value.length === 0 && !productsLoading.value
    ? 'No featured items yet — add products to see curated picks.'
    : 'Please refresh once the catalogue updates finish.'
);

const refreshAll = async () => {
  await Promise.all([
    productsStore.fetchProducts({ limit: 24 }),
    productsStore.fetchCategories(true),
  ]);
};

const platformHighlights = [
  { label: 'Launch-to-live time', value: '48 hrs', caption: 'White-label storefronts with preset brand kits' },
  { label: 'Conversion uplift', value: '+32%', caption: 'Guided shopping stories & smart bundles' },
  { label: 'Fulfilment coverage', value: '190+', caption: 'Countries serviced via Metro logistics' },
  { label: 'Sustainability rating', value: 'A+', caption: 'Partner brands audited quarterly' },
];

const testimonials = [
  {
    name: 'Elijah Carter',
    role: 'Founder · Naoko Ceramics',
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
    text: 'Metro transforms our small studio into a global boutique. Their storytelling and inventory tools help us stay human at scale.',
  },
  {
    name: 'Maya Fernández',
    role: 'Experience Lead · Shift Collective',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    text: 'Our team launches seasonal edits in hours, not weeks. Metro’s merchandising gives us clarity, velocity, and joy.',
  },
  {
    name: 'Luca Moretti',
    role: 'Loyal Metro Shopper',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    text: 'It feels like walking into a beautifully curated concept store, minus the commute. Everything just fits my lifestyle.',
  },
];
</script>
