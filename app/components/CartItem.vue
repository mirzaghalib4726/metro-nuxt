<template>
  <li class="py-6 flex">
    <div class="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
      <img
        :src="item.image || '/images/placeholder-product.jpg'"
        :alt="item.name"
        class="w-full h-full object-center object-cover"
      />
    </div>

    <div class="ml-4 flex-1 flex flex-col">
      <div>
        <div class="flex justify-between text-base font-medium text-gray-900">
          <h3>{{ item.name }}</h3>
          <p class="ml-4">${{ (item.price * item.quantity).toFixed(2) }}</p>
        </div>
        <p class="mt-1 text-sm text-gray-500">{{ item.category }}</p>
      </div>
      
      <div class="flex-1 flex items-end justify-between text-sm">
        <div class="flex items-center">
          <button 
            @click="updateQuantity(item.id, item.quantity - 1)"
            class="text-gray-500 hover:text-gray-700 px-2 py-1"
            :class="{ 'opacity-50 cursor-not-allowed': item.quantity <= 1 }"
            :disabled="item.quantity <= 1"
          >
            <span class="sr-only">Decrease quantity</span>
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
            </svg>
          </button>
          
          <span class="mx-2 text-gray-700">{{ item.quantity }}</span>
          
          <button 
            @click="updateQuantity(item.id, item.quantity + 1)"
            class="text-gray-500 hover:text-gray-700 px-2 py-1"
          >
            <span class="sr-only">Increase quantity</span>
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        <div class="flex">
          <button 
            type="button" 
            @click="removeItem"
            class="font-medium text-blue-600 hover:text-blue-500"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  </li>
</template>

<script setup lang="ts">
import type { CartItem as CartItemType } from '~/types/cart';

const props = defineProps<{
  item: CartItemType;
}>();

const emit = defineEmits(['update-quantity', 'remove']);

const updateQuantity = (quantity: number) => {
  emit('update-quantity', props.item.id, quantity);
};

const removeItem = () => {
  emit('remove', props.item.id);
};
</script>
