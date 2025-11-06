import { defineStore } from 'pinia';
import type { Product } from '~/types/product';
import type { CartItem } from '~/types/cart';

const STORAGE_KEY = 'metro_cart';

interface CartState {
  items: CartItem[];
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    items: [],
  }),

  getters: {
    isEmpty: (state) => state.items.length === 0,
    totalItems: (state) =>
      state.items.reduce((sum, item) => sum + (item.quantity ?? 0), 0),
    subtotal: (state) =>
      state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  },

  actions: {
    hydrate() {
      if (!process.client) return;
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as CartItem[];
          this.items = Array.isArray(parsed)
            ? parsed.filter((item) => typeof item.productId === 'string' && item.productId.length > 0)
            : [];
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn('Unable to hydrate cart from storage', error);
        this.items = [];
      }
    },

    persist() {
      if (!process.client) return;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
    },

    addProduct(product: Product, quantity = 1) {
      const productId = product.id || product._id;
      if (!productId) {
        throw new Error('Product identifier is required to add to cart');
      }

      const existing = this.items.find(
        (item) => item.productId === productId
      );

      if (existing) {
        existing.quantity = Math.min(existing.quantity + quantity, product.stock ?? existing.quantity + quantity);
      } else {
        this.items.unshift({
          id: `${productId}-${Date.now()}`,
          productId,
          name: product.name,
          price: product.price,
          quantity: Math.min(quantity, product.stock ?? quantity),
          image: product.image,
          category: product.category,
        });
      }

      this.persist();
    },

    updateQuantity(productId: string, quantity: number) {
      const item = this.items.find((entry) => entry.productId === productId);
      if (!item) return;

      const nextQuantity = Math.max(quantity, 1);
      item.quantity = nextQuantity;
      this.persist();
    },

    removeItem(productId: string) {
      this.items = this.items.filter((item) => item.productId !== productId);
      this.persist();
    },

    clear() {
      this.items = [];
      this.persist();
    },
  },
});
