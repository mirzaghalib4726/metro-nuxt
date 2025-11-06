<template>
  <div class="product-page">
    <div v-if="fetchError" class="product-catalog__empty">
      <h2>We couldn’t load products just now</h2>
      <p>{{ fetchErrorMessage }}</p>
      <button type="button" class="btn btn--primary" @click="reload">Retry</button>
    </div>
    <ProductList
      v-else
      :products="products"
      :loading="productsLoading"
      :available-categories="categoryOptions"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ProductList from '~/components/ProductList.vue';
import { useProductsStore } from '~/store/products';
import { storeToRefs } from 'pinia';

const productsStore = useProductsStore();

if (!productsStore.items.length) {
  await productsStore.fetchProducts();
}

await productsStore.fetchCategories();

const { items, loading, error, categories } = storeToRefs(productsStore);

const products = computed(() => items.value);
const productsLoading = computed(() => loading.value);
const fetchError = computed(() => error.value);
const fetchErrorMessage = computed(() =>
  fetchError.value ? 'Please refresh in a moment while we resync the catalogue.' : ''
);
const categoryOptions = computed(() => {
  const unique = new Set(
    categories.value.map((category) => category.name).filter(Boolean)
  );
  return Array.from(unique).sort();
});

const reload = async () => {
  await productsStore.fetchProducts();
  await productsStore.fetchCategories(true);
};
</script>
