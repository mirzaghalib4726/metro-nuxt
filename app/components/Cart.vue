<template>
  <div class="fixed inset-0 z-50 overflow-hidden">
    <div class="absolute inset-0 overflow-hidden">
      <!-- Overlay -->
      <div 
        class="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        @click="$emit('close')"
      ></div>
      
      <!-- Cart Panel -->
      <div class="fixed inset-y-0 right-0 pl-10 max-w-full flex">
        <div class="w-screen max-w-md">
          <div class="h-full flex flex-col bg-white shadow-xl overflow-y-scroll cart-panel">
            <!-- Header -->
            <div class="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
              <div class="flex items-start justify-between">
                <h2 class="text-lg font-medium text-gray-900">Shopping cart</h2>
                <div class="ml-3 h-7 flex items-center">
                  <button 
                    type="button" 
                    class="-m-2 p-2 text-gray-400 hover:text-gray-500"
                    @click="$emit('close')"
                  >
                    <span class="sr-only">Close panel</span>
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div class="mt-8">
                <div class="flow-root">
                  <!-- Empty State -->
                  <div v-if="items.length === 0" class="text-center py-12">
                    <svg
                      class="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    <h3 class="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
                    <p class="mt-1 text-sm text-gray-500">Start adding some items to your cart.</p>
                    <div class="mt-6">
                      <button
                        type="button"
                        class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        @click="$emit('close')"
                      >
                        <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                        </svg>
                        Continue Shopping
                      </button>
                    </div>
                  </div>
                  
                  <!-- Cart Items -->
                  <ul v-else class="-my-6 divide-y divide-gray-200">
                    <CartItem
                      v-for="item in items"
                      :key="item.id"
                      :item="item"
                      @update-quantity="updateQuantity"
                      @remove="removeItem"
                    />
                  </ul>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div v-if="items.length > 0" class="border-t border-gray-200 py-6 px-4 sm:px-6">
              <div class="flex justify-between text-base font-medium text-gray-900">
                <p>Subtotal</p>
                <p>${{ subtotal.toFixed(2) }}</p>
              </div>
              <p class="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
              <div class="mt-6">
                <button
                  type="button"
                  class="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  @click="checkout"
                >
                  Checkout
                </button>
              </div>
              <div class="mt-6 flex justify-center text-sm text-center text-gray-500">
                <p>
                  or
                  <button
                    type="button"
                    class="text-blue-600 font-medium hover:text-blue-500"
                    @click="$emit('close')"
                  >
                    Continue Shopping<span aria-hidden="true"> &rarr;</span>
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
import CartItem from './CartItem.vue';
import type { CartItem as CartItemType } from '~/types/cart';

const props = defineProps<{
  isOpen: boolean;
  items: CartItemType[];
}>();

const emit = defineEmits(['close', 'update-cart', 'checkout']);

const subtotal = computed(() => {
  return props.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

const updateQuantity = (itemId: string, quantity: number) => {
  if (quantity < 1) return;
  emit('update-cart', { itemId, quantity });
};

const removeItem = (itemId: string) => {
  emit('update-cart', { itemId, quantity: 0 });
};

const checkout = () => {
  emit('checkout');
};

// Close cart when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (target.closest('.cart-panel')) return;
  emit('close');
};

// Close on escape key
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    emit('close');
  }
};

// Add event listeners when component mounts
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('keydown', handleKeyDown);
});

// Clean up event listeners
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('keydown', handleKeyDown);
});
</script>
