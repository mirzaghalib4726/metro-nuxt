<template>
  <div class="product-detail">
    <div v-if="loading" class="product-catalog__loading">
      <div class="spinner" />
      <p>Loading product…</p>
    </div>

    <div v-else-if="loadError" class="product-catalog__empty">
      <h2>We couldn’t find this product</h2>
      <p>{{ loadError }}</p>
      <NuxtLink to="/products" class="btn btn--primary">Browse catalogue</NuxtLink>
    </div>

    <div v-else-if="product" class="product-detail__layout" style="grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:36px;">
      <div class="product-detail__gallery" style="padding:28px;">
        <div style="position:relative; border-radius: var(--radius-large); overflow:hidden;">
          <img :src="product.image || fallbackImage" :alt="product.name" style="height:480px; width:100%; object-fit:cover;" />
          <div style="position:absolute; top:18px; left:18px; background: rgba(255,255,255,0.88); padding:8px 16px; border-radius:999px; font-size:0.75rem; font-weight:600; letter-spacing:0.28em; text-transform:uppercase; color:var(--slate-500);">
            {{ product.category || 'Collection' }}
          </div>
          <div v-if="product.stock <= 0" style="position:absolute; inset:0; background:rgba(15,23,42,0.55); display:grid; place-items:center; color:white; font-weight:600; letter-spacing:0.2em; text-transform:uppercase;">
            Currently unavailable
          </div>
        </div>
      </div>

      <aside class="product-detail__content" style="display:grid; gap:24px;">
        <div style="display:grid; gap:12px;">
          <span class="badge">{{ product.brand || 'Metro exclusive' }}</span>
          <h1 class="section__title" style="font-size:2.4rem;">{{ product.name }}</h1>
          <p class="text-muted">{{ product.description || defaultDescription }}</p>
        </div>

        <div style="padding:24px; border-radius:var(--radius-medium); border:1px solid rgba(148,163,184,0.2); background:var(--surface); box-shadow:var(--shadow-light); display:grid; gap:16px;">
          <div style="display:flex; justify-content:space-between; align-items:flex-end;">
            <div>
              <span class="text-muted" style="text-transform:uppercase; font-size:0.7rem; letter-spacing:0.3em;">Investment</span>
              <p style="margin:6px 0 0; font-family:var(--font-display); font-size:2.2rem; color:var(--brand-600);">
                ${{ product.price?.toFixed(2) ?? '—' }}
              </p>
            </div>
            <p class="text-muted" style="font-size:0.9rem;">
              {{ product.stock > 0 ? `${product.stock} pieces ready to ship` : 'Pre-order available soon' }}
            </p>
          </div>
          <div style="display:flex; gap:12px; flex-wrap:wrap;">
            <button
              type="button"
              class="btn btn--primary"
              style="flex:1; justify-content:center;"
              :disabled="product.stock <= 0"
              :style="product.stock <= 0 ? 'opacity:0.6; pointer-events:none;' : ''"
              @click="addToCart"
            >
              {{ product.stock > 0 ? 'Add to cart' : 'Notify when in stock' }}
            </button>
            <button type="button" class="btn btn--ghost" style="flex:1; justify-content:center;">Save for later</button>
          </div>
        </div>

        <div style="display:grid; gap:16px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));">
          <div class="stat-card">
            <span class="stat-card__value" style="font-size:1.6rem;">Delivery</span>
            <p class="text-muted" style="margin:0; font-size:0.85rem;">Complimentary carbon-neutral shipping in 3–5 business days.</p>
          </div>
          <div class="stat-card">
            <span class="stat-card__value" style="font-size:1.6rem;">Guarantee</span>
            <p class="text-muted" style="margin:0; font-size:0.85rem;">30-day trial, 2-year repairs, and lifetime design support.</p>
          </div>
        </div>
      </aside>
    </div>

    <section v-if="product" style="margin-top:48px; display:grid; gap:32px; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
      <article class="highlight-card" style="padding:32px; display:grid; gap:16px;">
        <h2 class="section__title" style="font-size:1.8rem;">Product story</h2>
        <p class="text-muted">
          {{ defaultStory }}
        </p>
        <ul class="text-muted" style="list-style:none; padding:0; margin:0; display:grid; gap:10px; font-size:0.9rem;">
          <li>• Sustainably sourced materials with third-party certifications</li>
          <li>• Designed collaboratively with Metro’s research collective</li>
          <li>• Delivered with reusable packaging and repair resources</li>
        </ul>
      </article>

      <article class="highlight-card" style="padding:32px; display:grid; gap:18px;">
        <h3 class="section__title" style="font-size:1.6rem;">Care &amp; dimensions</h3>
        <dl style="display:grid; gap:12px; font-size:0.95rem; color:var(--slate-500);">
          <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(148,163,184,0.2); padding-bottom:12px;">
            <dt>Dimensions</dt>
            <dd>{{ product.dimensions || defaultDimensions }}</dd>
          </div>
          <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(148,163,184,0.2); padding-bottom:12px;">
            <dt>Materials</dt>
            <dd>{{ product.materials || defaultMaterials }}</dd>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <dt>Care guide</dt>
            <dd>{{ defaultCareGuide }}</dd>
          </div>
        </dl>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useHead } from '#imports';
import type { Product } from '~/types/product';
import { useProductsStore } from '~/store/products';
import { useCartStore } from '~/store/cart';

const fallbackImage = 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=900&q=80';
const defaultDescription =
  'A refined, human-first product crafted with attention to detail and enduring materials.';
const defaultStory =
  'Each Metro piece is thoughtfully sourced with planet-first materials and crafted by partners paid living wages. Expect tactile finishes, durable builds, and modularity that evolves with you.';
const defaultDimensions = '48" × 24" × 18"';
const defaultMaterials = 'Solid oak, powder-coated steel, recycled wool blend';
const defaultCareGuide = 'Spot clean, gentle wood oil biannually';

const route = useRoute();
const productsStore = useProductsStore();
const cartStore = useCartStore();

const id = route.params.id as string;
const product = ref<Product | null>(productsStore.getById(id));
const loading = ref(false);
const loadError = ref('');

if (!product.value) {
  loading.value = true;
  try {
    product.value = await productsStore.fetchProduct(id);
    if (!product.value) {
      loadError.value = 'Please refresh the page or explore other collections.';
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Product detail load error:', error);
    loadError.value =
      error instanceof Error
        ? error.message
        : 'Please refresh the page or explore other collections.';
  } finally {
    loading.value = false;
  }
}

const addToCart = () => {
  if (!product.value || product.value.stock <= 0) return;
  cartStore.addProduct(product.value, 1);
};

useHead(
  computed(() => ({
    title: product.value?.name ? `${product.value.name} · Metro` : 'Product details · Metro',
    meta: [
      {
        name: 'description',
        content: product.value?.description || 'Discover product details curated by Metro.',
      },
    ],
  }))
);

defineExpose({
  loading,
  loadError,
  product,
});
</script>
