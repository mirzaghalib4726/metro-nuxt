<template>
  <div class="bg-white">
    <!-- Product Image Gallery -->
    <div class="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-16 lg:max-w-7xl lg:px-8">
      <div class="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
        <!-- Image Gallery -->
        <div class="flex flex-col-reverse">
          <!-- Image selector -->
          <div class="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
            <div class="grid grid-cols-4 gap-6">
              <button
                v-for="(image, index) in product.images || []"
                :key="index"
                type="button"
                @click="selectedImage = image"
                class="flex aspect-square cursor-pointer items-center justify-center rounded-md bg-white"
                :class="{ 'ring-2 ring-blue-500': selectedImage === image }"
              >
                <img
                  :src="image"
                  :alt="product.name + ' thumbnail ' + (index + 1)"
                  class="h-full w-full object-cover object-center"
                />
              </button>
            </div>
          </div>

          <!-- Main image -->
          <div class="aspect-h-1 aspect-w-1 w-full">
            <img
              :src="selectedImage || product.image || '/images/placeholder-product.jpg'"
              :alt="product.name"
              class="h-full w-full object-cover object-center sm:rounded-lg"
            />
          </div>
        </div>

        <!-- Product info -->
        <div class="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
          <h1 class="text-3xl font-bold tracking-tight text-gray-900">
            {{ product.name }}
          </h1>

          <div class="mt-3">
            <h2 class="sr-only">Product information</h2>
            <p class="text-3xl tracking-tight text-gray-900">
              ${{ product.price.toFixed(2) }}
            </p>
          </div>

          <!-- Reviews -->
          <div class="mt-3">
            <div class="flex items-center">
              <div class="flex items-center">
                <svg
                  v-for="rating in [0, 1, 2, 3, 4]"
                  :key="rating"
                  :class="[
                    product.rating > rating ? 'text-yellow-400' : 'text-gray-300',
                    'h-5 w-5 flex-shrink-0'
                  ]"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <p class="ml-2 text-sm text-gray-500">
                {{ product.reviewCount || 0 }} reviews
              </p>
            </div>
          </div>

          <div class="mt-6">
            <h3 class="sr-only">Description</h3>
            <div class="space-y-6 text-base text-gray-700">
              <p>{{ product.description }}</p>
            </div>
          </div>

          <div class="mt-6">
            <h3 class="text-sm font-medium text-gray-900">Highlights</h3>
            <div class="mt-4">
              <ul role="list" class="list-disc space-y-2 pl-4 text-sm">
                <li
                  v-for="(highlight, index) in product.highlights || []"
                  :key="index"
                  class="text-gray-600"
                >
                  <span class="text-gray-600">{{ highlight }}</span>
                </li>
              </ul>
            </div>
          </div>

          <div class="mt-8">
            <div class="mt-10 flex">
              <button
                @click="addToCart"
                :disabled="isAddingToCart || product.stock <= 0"
                class="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-blue-600 px-8 py-3 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  v-if="isAddingToCart"
                  class="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {{ isAddingToCart ? 'Adding...' : product.stock > 0 ? 'Add to cart' : 'Out of stock' }}
              </button>

              <button
                type="button"
                class="ml-4 flex items-center justify-center rounded-md px-3 py-3 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="h-6 w-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
                <span class="sr-only">Add to favorites</span>
              </button>
            </div>
          </div>

          <section class="mt-12 pt-6 border-t border-gray-200">
            <h3 class="text-sm font-medium text-gray-900">Details</h3>
            <div class="mt-4 space-y-6">
              <p class="text-sm text-gray-600">
                {{ product.details || 'No additional details available.' }}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Product } from '~/types/product';

const props = defineProps<{
  product: Product;
}>();

const emit = defineEmits(['add-to-cart']);

const selectedImage = ref(props.product.image || '');
const isAddingToCart = ref(false);

const addToCart = async () => {
  if (props.product.stock <= 0) return;
  
  isAddingToCart.value = true;
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    emit('add-to-cart', { ...props.product, quantity: 1 });
  } catch (error) {
    console.error('Failed to add to cart:', error);
  } finally {
    isAddingToCart.value = false;
  }
};
</script>
