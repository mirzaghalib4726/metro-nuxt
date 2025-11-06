<template>
  <div class="bg-white">
    <!-- Profile header -->
    <div>
      <div class="h-32 bg-blue-600 sm:h-40 lg:h-48"></div>
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
          <div class="flex">
            <img class="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32" :src="user.avatar" alt="">
          </div>
          <div class="mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
            <div class="sm:hidden 2xl:block mt-6 min-w-0 flex-1">
              <h1 class="text-2xl font-bold text-gray-900 truncate">{{ user.name }}</h1>
              <p class="text-gray-600">{{ user.email }}</p>
            </div>
            <div class="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
              <button type="button" class="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <svg class="-ml-1 mr-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                <span>Edit</span>
              </button>
              <button type="button" class="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <svg class="-ml-1 mr-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clip-rule="evenodd" />
                </svg>
                <span>Message</span>
              </button>
            </div>
          </div>
        </div>
        <div class="hidden sm:block 2xl:hidden mt-6 min-w-0 flex-1">
          <h1 class="text-2xl font-bold text-gray-900 truncate">{{ user.name }}</h1>
          <p class="text-gray-600">{{ user.email }}</p>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="mt-6 sm:mt-2 2xl:mt-5">
      <div class="border-b border-gray-200">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav class="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              v-for="tab in tabs"
              :key="tab.name"
              @click="currentTab = tab.id"
              :class="[
                tab.id === currentTab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
              ]"
            >
              {{ tab.name }}
              <span v-if="tab.count" :class="[
                tab.id === currentTab ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-900',
                'hidden ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block'
              ]">
                {{ tab.count }}
              </span>
            </button>
          </nav>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="bg-white shadow overflow-hidden sm:rounded-lg mt-6">
      <div class="px-4 py-5 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ tabs.find(t => t.id === currentTab).name }}
        </h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">
          {{ tabs.find(t => t.id === currentTab).description }}
        </p>
      </div>
      <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
        <!-- Tab content will go here -->
        <div v-if="currentTab === 'overview'">
          <p class="text-gray-700">Welcome to your profile dashboard. Here you can manage your account settings, view your order history, and update your personal information.</p>
        </div>
        <div v-else-if="currentTab === 'orders'">
          <div v-if="orders.length === 0" class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No orders</h3>
            <p class="mt-1 text-sm text-gray-500">Get started by placing your first order.</p>
            <div class="mt-6">
              <NuxtLink to="/products" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Start Shopping
              </NuxtLink>
            </div>
          </div>
          <div v-else class="space-y-8">
            <div v-for="order in orders" :key="order.id" class="border border-gray-200 rounded-lg overflow-hidden">
              <div class="bg-gray-50 px-4 py-4 sm:px-6 flex items-center justify-between border-b border-gray-200">
                <div>
                  <p class="text-sm font-medium text-gray-900">Order #{{ order.id }}</p>
                  <p class="text-sm text-gray-500">Placed on {{ formatDate(order.date) }}</p>
                </div>
                <div class="ml-4">
                  <span :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  ]">
                    {{ order.status }}
                  </span>
                </div>
              </div>
              <div class="p-4 sm:p-6">
                <div class="flow-root">
                  <ul role="list" class="divide-y divide-gray-200">
                    <li v-for="item in order.items" :key="item.id" class="py-4 flex">
                      <div class="flex-shrink-0">
                        <img class="w-20 h-20 rounded-md object-cover object-center" :src="item.imageSrc" :alt="item.name" />
                      </div>
                      <div class="ml-4 flex-1 flex flex-col">
                        <div>
                          <div class="flex justify-between text-base font-medium text-gray-900">
                            <h3>{{ item.name }}</h3>
                            <p class="ml-4">${{ item.price.toFixed(2) }}</p>
                          </div>
                          <p class="mt-1 text-sm text-gray-500">{{ item.color }}</p>
                          <p class="text-sm text-gray-500">Qty {{ item.quantity }}</p>
                        </div>
                        <div class="flex-1 flex items-end justify-between text-sm">
                          <p class="text-sm font-medium text-gray-500">Total: ${{ (item.price * item.quantity).toFixed(2) }}</p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
                <div class="mt-6 flex justify-end">
                  <button type="button" class="text-sm font-medium text-blue-600 hover:text-blue-500">
                    View invoice<span aria-hidden="true"> &rarr;</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="currentTab === 'addresses'">
          <div class="space-y-4">
            <div v-for="address in addresses" :key="address.id" class="border border-gray-200 rounded-lg p-4">
              <div class="flex items-start justify-between">
                <div>
                  <h4 class="font-medium text-gray-900">{{ address.name }}</h4>
                  <p class="text-gray-600">{{ address.street }}</p>
                  <p class="text-gray-600">{{ address.city }}, {{ address.state }} {{ address.zip }}</p>
                  <p class="text-gray-600">{{ address.country }}</p>
                  <p class="mt-2 text-sm text-gray-500">Phone: {{ address.phone }}</p>
                </div>
                <div class="flex space-x-2">
                  <button type="button" class="text-blue-600 hover:text-blue-800">Edit</button>
                  <button type="button" class="text-red-600 hover:text-red-800">Remove</button>
                </div>
              </div>
              <div v-if="address.isDefault" class="mt-2">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Default
                </span>
              </div>
            </div>
            <button type="button" class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Add new address
            </button>
          </div>
        </div>
        <div v-else-if="currentTab === 'settings'">
          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium leading-6 text-gray-900">Profile</h3>
              <p class="mt-1 text-sm text-gray-500">This information will be displayed publicly so be careful what you share.</p>
            </div>

            <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div class="sm:col-span-3">
                <label for="first-name" class="block text-sm font-medium text-gray-700">First name</label>
                <input type="text" name="first-name" id="first-name" autocomplete="given-name" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" :value="user.name.split(' ')[0]" />
              </div>

              <div class="sm:col-span-3">
                <label for="last-name" class="block text-sm font-medium text-gray-700">Last name</label>
                <input type="text" name="last-name" id="last-name" autocomplete="family-name" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" :value="user.name.split(' ').slice(1).join(' ')" />
              </div>

              <div class="sm:col-span-4">
                <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
                <input type="email" name="email" id="email" autocomplete="email" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" :value="user.email" />
              </div>

              <div class="sm:col-span-6">
                <label for="photo" class="block text-sm font-medium text-gray-700">Photo</label>
                <div class="mt-1 flex items-center">
                  <img class="inline-block h-12 w-12 rounded-full" :src="user.avatar" alt="" />
                  <div class="ml-4 flex">
                    <div class="relative bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm flex items-center cursor-pointer hover:bg-gray-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      <label for="user-photo" class="relative text-sm font-medium text-gray-700 pointer-events-none">
                        <span>Change</span>
                        <span class="sr-only"> user photo</span>
                      </label>
                      <input id="user-photo" name="user-photo" type="file" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer border-gray-300 rounded-md" />
                    </div>
                    <button type="button" class="ml-3 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="pt-5">
              <div class="flex justify-end">
                <button type="button" class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Cancel
                </button>
                <button type="submit" class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const currentTab = ref('overview');

const user = {
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  joinDate: 'January 2023',
};

const tabs = [
  { id: 'overview', name: 'Overview', description: 'View your account overview' },
  { id: 'orders', name: 'Orders', description: 'View your order history', count: 3 },
  { id: 'addresses', name: 'Addresses', description: 'Manage your shipping addresses' },
  { id: 'settings', name: 'Settings', description: 'Manage your account settings' },
];

const orders = [
  {
    id: 'WU88191165',
    date: '2023-04-15',
    status: 'Delivered',
    total: 238.97,
    items: [
      {
        id: 1,
        name: 'Basic Tee',
        color: 'Black',
        price: 32.00,
        quantity: 1,
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/shopping-cart-page-01-product-01.jpg',
      },
      {
        id: 2,
        name: 'Leather Wallet',
        color: 'Brown',
        price: 45.99,
        quantity: 1,
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/shopping-cart-page-01-product-02.jpg',
      },
    ],
  },
  // Add more orders as needed
];

const addresses = [
  {
    id: 1,
    name: 'John Doe',
    street: '123 Main St',
    city: 'San Francisco',
    state: 'CA',
    zip: '94103',
    country: 'United States',
    phone: '(555) 123-4567',
    isDefault: true,
  },
  {
    id: 2,
    name: 'John Doe',
    street: '456 Oak Ave',
    city: 'Portland',
    state: 'OR',
    zip: '97204',
    country: 'United States',
    phone: '(555) 987-6543',
    isDefault: false,
  },
];

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};
</script>
