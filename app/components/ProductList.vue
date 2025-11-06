<template>
  <div class="product-catalog">
    <header class="product-catalog__header">
      <div class="product-catalog__intro">
        <h1>Products</h1>
        <p>Search across collections, filter by price, and sort by what matters most.</p>
      </div>
      <div class="product-catalog__controls">
        <div class="catalog-search">
          <input
            v-model="filters.searchQuery"
            type="search"
            class="input-field catalog-search__input"
            placeholder="Search products, collections, stories"
          />
        </div>
        <div class="catalog-filter">
          <label class="catalog-filter__label" for="category">Category</label>
          <select id="category" v-model="filters.category" class="input-field">
            <option value="">All categories</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
        <div class="catalog-filter">
          <label class="catalog-filter__label" for="price">Price</label>
          <select id="price" v-model="filters.priceRange" class="input-field">
            <option value="">Any</option>
            <option value="0-50">$0 – $50</option>
            <option value="50-150">$50 – $150</option>
            <option value="150-400">$150 – $400</option>
            <option value="400">$400+</option>
          </select>
        </div>
        <div class="catalog-filter">
          <label class="catalog-filter__label" for="sort">Sort</label>
          <select id="sort" v-model="filters.sortBy" class="input-field">
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="newest">Newest</option>
            <option value="rating">Top rated</option>
          </select>
        </div>
        <button type="button" class="btn btn--ghost" @click="resetFilters">Reset filters</button>
      </div>
    </header>

    <div v-if="loading" class="product-catalog__loading">
      <div class="spinner" />
      <p>Loading products...</p>
    </div>

    <div v-else-if="filteredProducts.length === 0" class="product-catalog__empty">
      <h2>No products match your filters</h2>
      <p>Try switching up the filters or clear them to browse the full catalogue.</p>
      <button type="button" class="btn btn--primary" @click="resetFilters">Clear filters</button>
    </div>

    <div v-else class="product-grid">
      <ProductCard
        v-for="product in paginatedProducts"
        :key="product._id || product.id"
        :product="product"
      />
    </div>

    <nav v-if="totalPages > 1" class="pagination">
      <button type="button" class="btn btn--ghost" :disabled="currentPage === 1" @click="currentPage--">
        Previous
      </button>
      <button
        v-for="page in visiblePages"
        :key="page"
        type="button"
        class="pagination__page"
        :class="{ 'pagination__page--active': currentPage === page }"
        @click="currentPage = page"
      >
        {{ page }}
      </button>
      <button type="button" class="btn btn--ghost" :disabled="currentPage === totalPages" @click="currentPage++">
        Next
      </button>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import ProductCard from '~/components/ProductCard.vue';
import type { Product } from '~/types/product';

const props = defineProps<{
  products: Product[];
  loading?: boolean;
  showFilters?: boolean;
  itemsPerPage?: number;
  availableCategories?: string[];
}>();

const emit = defineEmits(['update-filters']);

const filters = ref({
  category: '',
  priceRange: '',
  sortBy: 'featured',
  searchQuery: '',
});

const currentPage = ref(1);

const loading = computed(() => props.loading ?? false);

const categories = computed(() => {
  if (props.availableCategories && props.availableCategories.length > 0) {
    return props.availableCategories;
  }

  const unique = new Set<string>();
  props.products.forEach((product) => {
    if (product.category) unique.add(product.category);
  });
  return Array.from(unique).sort();
});

const filteredProducts = computed(() => {
  const query = filters.value.searchQuery.trim().toLowerCase();

  return props.products
    .filter((product) => {
      if (filters.value.category && product.category !== filters.value.category) {
        return false;
      }

      if (filters.value.priceRange) {
        const [min, max] = filters.value.priceRange.split('-').map(Number);
        if (!Number.isNaN(min)) {
          if (Number.isNaN(max) && product.price < min) return false;
          if (!Number.isNaN(max) && (product.price < min || product.price > max)) return false;
        }
      }

      if (query.length > 0) {
        const haystack = [product.name, product.description ?? '', product.category ?? '']
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(query)) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      switch (filters.value.sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'newest':
          return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
        case 'rating':
          return (b.rating ?? 0) - (a.rating ?? 0);
        default:
          return 0;
      }
    });
});

const itemsPerPage = computed(() => props.itemsPerPage || 12);
const totalItems = computed(() => filteredProducts.value.length);
const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / itemsPerPage.value)));

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredProducts.value.slice(start, end);
});

const visiblePages = computed(() => {
  const pages = [] as number[];
  const total = totalPages.value;

  if (total <= 5) {
    for (let i = 1; i <= total; i += 1) pages.push(i);
    return pages;
  }

  pages.push(1);
  const start = Math.max(2, currentPage.value - 1);
  const end = Math.min(total - 1, currentPage.value + 1);

  if (start > 2) pages.push(start - 1);
  for (let i = start; i <= end; i += 1) pages.push(i);
  if (end < total - 1) pages.push(end + 1);
  pages.push(total);

  return Array.from(new Set(pages)).sort((a, b) => a - b);
});

const resetFilters = () => {
  filters.value = {
    category: '',
    priceRange: '',
    sortBy: 'featured',
    searchQuery: '',
  };
};

watch(filters, () => {
  currentPage.value = 1;
  emit('update-filters', { ...filters.value });
}, { deep: true });

watch([filteredProducts, totalPages], () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value;
  }
});

watch(currentPage, () => {
  if (process.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

onMounted(() => {
  // Reserved for future hydration of saved filters
});
</script>
