<template>
  <article class="product-card">
    <div class="product-card__media">
      <img :src="imageSrc" :alt="product.name" />
      <div v-if="product.stock <= 0" class="product-card__status">Sold out</div>
      <div v-else class="product-card__label">{{ product.category || 'Featured' }}</div>
      <div v-if="product.rating" class="product-card__rating">
        <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14" aria-hidden="true" style="color:#f59e0b;">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span>{{ product.rating }} · {{ product.reviewCount ?? 0 }} reviews</span>
      </div>
    </div>

    <div class="product-card__body">
      <div>
        <h3 class="product-card__title">{{ product.name }}</h3>
        <p class="product-card__meta">
          {{ product.description || 'Thoughtfully designed with premium materials and intuitive functionality.' }}
        </p>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span class="product-card__price">${{ product.price.toFixed(2) }}</span>
        <span class="text-muted" style="font-size:0.8rem;">
          {{ product.stock > 0 ? `${product.stock} left` : 'Unavailable' }}
        </span>
      </div>

      <div style="display:flex; gap:12px;">
        <button
          type="button"
          class="btn btn--primary"
          style="flex:1; justify-content:center;"
          :disabled="product.stock <= 0"
          :style="product.stock <= 0 ? 'opacity:0.6; pointer-events:none;' : ''"
          @click="handleAddToCart"
        >
          {{ product.stock > 0 ? (added ? 'Added!' : 'Add to cart') : 'Notify me' }}
        </button>
        <NuxtLink :to="`/products/${product._id || product.id}`" class="btn btn--ghost" style="flex:1; justify-content:center;">
          View
        </NuxtLink>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, ref, onUnmounted } from 'vue';
import type { Product } from '~/types/product';
import { useCartStore } from '~/store/cart';

const props = defineProps<{
  product: Product;
}>();

const cartStore = useCartStore();
const added = ref(false);
let addedTimeout: ReturnType<typeof setTimeout> | null = null;

const imageSrc = computed(
  () =>
    props.product.image ||
    'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=900&q=80'
);

const handleAddToCart = () => {
  if (props.product.stock <= 0) return;
  cartStore.addProduct(props.product, 1);
  added.value = true;
if (addedTimeout) {
  clearTimeout(addedTimeout);
}
addedTimeout = setTimeout(() => {
  added.value = false;
  addedTimeout = null;
}, 1800);
};

onUnmounted(() => {
  if (addedTimeout) {
    clearTimeout(addedTimeout);
  }
});
</script>
