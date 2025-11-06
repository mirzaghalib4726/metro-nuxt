import { defineStore } from 'pinia';
import { useNuxtApp, useRuntimeConfig } from '#imports';
import { $fetch } from 'ofetch';
import type { Product } from '~/types/product';

interface CategorySummary {
  id: string;
  name: string;
  description?: string;
  parent?: string | null;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ProductListResponse {
  success: boolean;
  data: Product[];
  pagination: PaginationMeta;
}

interface CategoryResponse {
  success: boolean;
  data: CategorySummary[];
}

interface ProductsState {
  items: Product[];
  categories: CategorySummary[];
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;
  categoryLoading: boolean;
  categoryError: string | null;
}

export const useProductsStore = defineStore('products', {
  state: (): ProductsState => ({
    items: [],
    categories: [],
    loading: false,
    error: null,
    pagination: null,
    categoryLoading: false,
    categoryError: null,
  }),

  getters: {
    hasProducts: (state) => state.items.length > 0,
    getById: (state) => (id: string) =>
      state.items.find((product) => product.id === id || product._id === id) ?? null,
  },

  actions: {
    getFetcher() {
      const nuxtApp = useNuxtApp();
      const config = useRuntimeConfig();
      return (nuxtApp as any).$apiFetch ??
        $fetch.create({
          baseURL: config.public.apiBase || '/api/v1',
        });
    },

    async fetchProducts(params: Record<string, any> = {}) {
      if (this.loading) return;

      this.loading = true;
      this.error = null;

      try {
        const apiFetch = this.getFetcher();
        const response = await apiFetch<ProductListResponse>('/products', {
          method: 'GET',
          params,
        });

        if (!response?.success) {
          throw new Error('Unable to load products');
        }

        this.items = response.data;
        this.pagination = response.pagination;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Products fetch error:', error);
        this.error = 'Unable to load products right now. Please try again.';
      } finally {
        this.loading = false;
      }
    },

    async fetchCategories(force = false) {
      if (!force && this.categories.length > 0) {
        return;
      }

      try {
        this.categoryLoading = true;
        this.categoryError = null;

        const apiFetch = this.getFetcher();
        const response = await apiFetch<CategoryResponse>('/categories');

        if (!response?.success) {
          throw new Error('Unable to load categories');
        }

        this.categories = response.data;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Categories fetch error:', error);
        this.categoryError = 'Unable to load categories right now. Please try again.';
      } finally {
        this.categoryLoading = false;
      }
    },

    async fetchProduct(id: string) {
      const existing = this.getById(id);
      if (existing) {
        return existing;
      }

      try {
        const apiFetch = this.getFetcher();
        const response = await apiFetch<{ success: boolean; data: Product }>(
          `/products/${id}`,
          {
            method: 'GET',
          }
        );

        if (!response?.success) {
          throw new Error('Unable to load product');
        }

        this.items = [...this.items.filter((item) => item.id !== id && item._id !== id), response.data];
        return response.data;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Product fetch error:', error);
        throw error;
      }
    },
  },
});
