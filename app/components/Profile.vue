<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <!-- Profile Header -->
        <div class="px-6 py-8 sm:px-10 bg-gradient-to-r from-blue-600 to-blue-400 text-white">
          <div class="flex items-center">
            <div class="flex-shrink-0 h-20 w-20 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
              <span class="text-2xl font-bold text-white">{{ userInitials }}</span>
            </div>
            <div class="ml-6">
              <h1 class="text-2xl font-bold">{{ user.name || 'User' }}</h1>
              <p class="mt-1 text-blue-100">{{ user.email }}</p>
              <p class="mt-1 text-sm text-blue-100">
                Member since {{ new Date(user.createdAt).toLocaleDateString() }}
              </p>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex px-6">
            <button
              v-for="tab in tabs"
              :key="tab.name"
              @click="activeTab = tab.id"
              :class="[
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm'
              ]"
            >
              {{ tab.name }}
              <span
                v-if="tab.count"
                :class="[
                  activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-900',
                  'ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium'
                ]"
              >
                {{ tab.count }}
              </span>
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="p-6 sm:px-10">
          <!-- Profile Information -->
          <div v-if="activeTab === 'profile'" class="space-y-6">
            <div class="flex justify-between items-center">
              <h2 class="text-lg font-medium text-gray-900">Profile Information</h2>
              <button
                @click="isEditing = !isEditing"
                class="text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
              >
                {{ isEditing ? 'Cancel' : 'Edit' }}
              </button>
            </div>

            <form @submit.prevent="updateProfile" class="space-y-6">
              <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div class="sm:col-span-3">
                  <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    id="name"
                    v-model="formData.name"
                    :disabled="!isEditing"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    :class="{ 'bg-gray-100': !isEditing }"
                  />
                </div>

                <div class="sm:col-span-4">
                  <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
                  <input
                    type="email"
                    id="email"
                    v-model="formData.email"
                    disabled
                    class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  <p class="mt-1 text-xs text-gray-500">Contact support to change your email address</p>
                </div>

                <div class="sm:col-span-6">
                  <label for="phone" class="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    v-model="formData.phone"
                    :disabled="!isEditing"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    :class="{ 'bg-gray-100': !isEditing }"
                  />
                </div>

                <div class="sm:col-span-6">
                  <label for="address" class="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    id="address"
                    v-model="formData.address"
                    :disabled="!isEditing"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    :class="{ 'bg-gray-100': !isEditing }"
                  />
                </div>

                <div class="sm:col-span-3">
                  <label for="city" class="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    id="city"
                    v-model="formData.city"
                    :disabled="!isEditing"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    :class="{ 'bg-gray-100': !isEditing }"
                  />
                </div>

                <div class="sm:col-span-2">
                  <label for="state" class="block text-sm font-medium text-gray-700">State / Province</label>
                  <input
                    type="text"
                    id="state"
                    v-model="formData.state"
                    :disabled="!isEditing"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    :class="{ 'bg-gray-100': !isEditing }"
                  />
                </div>

                <div class="sm:col-span-2">
                  <label for="postalCode" class="block text-sm font-medium text-gray-700">ZIP / Postal code</label>
                  <input
                    type="text"
                    id="postalCode"
                    v-model="formData.postalCode"
                    :disabled="!isEditing"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    :class="{ 'bg-gray-100': !isEditing }"
                  />
                </div>
              </div>

              <div v-if="isEditing" class="flex justify-end space-x-3">
                <button
                  type="button"
                  @click="isEditing = false"
                  class="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    v-if="isSubmitting"
                    class="-ml-1 mr-2 h-4 w-4 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {{ isSubmitting ? 'Saving...' : 'Save' }}
                </button>
              </div>
            </form>
          </div>

          <!-- Order History -->
          <div v-else-if="activeTab === 'orders'">
            <h2 class="text-lg font-medium text-gray-900 mb-6">Order History</h2>
            
            <div v-if="orders.length === 0" class="text-center py-12">
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
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
              <p class="mt-1 text-sm text-gray-500">
                You haven't placed any orders yet. Start shopping to see your order history here.
              </p>
              <div class="mt-6">
                <a
                  href="/products"
                  class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg
                    class="-ml-1 mr-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  Start Shopping
                </a>
              </div>
            </div>

            <div v-else class="space-y-8">
              <div v-for="order in orders" :key="order.id" class="border border-gray-200 rounded-lg overflow-hidden">
                <div class="bg-gray-50 px-4 py-4 sm:px-6 flex justify-between items-center">
                  <div>
                    <h3 class="text-lg font-medium text-gray-900">Order #{{ order.orderNumber }}</h3>
                    <p class="mt-1 text-sm text-gray-500">
                      Placed on {{ new Date(order.date).toLocaleDateString() }}
                    </p>
                  </div>
                  <div class="ml-4">
                    <span
                      :class="{
                        'bg-green-100 text-green-800': order.status === 'delivered',
                        'bg-yellow-100 text-yellow-800': order.status === 'processing',
                        'bg-blue-100 text-blue-800': order.status === 'shipped',
                        'bg-red-100 text-red-800': order.status === 'cancelled'
                      }"
                      class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium capitalize"
                    >
                      {{ order.status }}
                    </span>
                  </div>
                </div>
                <div class="p-4 sm:p-6">
                  <div class="flow-root">
                    <ul role="list" class="-my-6 divide-y divide-gray-200">
                      <li v-for="item in order.items" :key="item.id" class="py-6 flex">
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
                            <p class="mt-1 text-sm text-gray-500">Qty: {{ item.quantity }}</p>
                          </div>
                          <div class="flex-1 flex items-end justify-between text-sm">
                            <p class="text-gray-500">SKU: {{ item.sku || 'N/A' }}</p>
                            <div class="flex">
                              <button
                                type="button"
                                class="font-medium text-blue-600 hover:text-blue-500"
                                @click="viewProduct(item.productId)"
                              >
                                View Product
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div class="mt-6 flex justify-between items-center">
                    <p class="text-sm font-medium text-gray-500">
                      {{ order.items.length }} {{ order.items.length === 1 ? 'item' : 'items' }}
                    </p>
                    <div class="text-right">
                      <p class="text-sm text-gray-500">Total amount</p>
                      <p class="text-lg font-medium text-gray-900">${{ order.total.toFixed(2) }}</p>
                    </div>
                  </div>

                  <div class="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      @click="reorder(order)"
                      class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg
                        class="-ml-1 mr-2 h-5 w-5 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      Reorder
                    </button>
                    <button
                      type="button"
                      @click="viewOrderDetails(order.id)"
                      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      View Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Address Book -->
          <div v-else-if="activeTab === 'addresses'" class="space-y-6">
            <div class="flex justify-between items-center">
              <h2 class="text-lg font-medium text-gray-900">Saved Addresses</h2>
              <button
                @click="showAddAddressForm = true"
                class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  class="-ml-0.5 mr-1.5 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add New Address
              </button>
            </div>

            <!-- Add/Edit Address Form -->
            <div v-if="showAddAddressForm" class="bg-gray-50 p-6 rounded-lg">
              <h3 class="text-lg font-medium text-gray-900 mb-4">
                {{ editingAddress ? 'Edit Address' : 'Add New Address' }}
              </h3>
              <form @submit.prevent="saveAddress" class="space-y-4">
                <div class="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6">
                  <div class="sm:col-span-3">
                    <label for="fullName" class="block text-sm font-medium text-gray-700">Full name</label>
                    <input
                      type="text"
                      id="fullName"
                      v-model="addressForm.fullName"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div class="sm:col-span-4">
                    <label for="addressLine1" class="block text-sm font-medium text-gray-700">Address line 1</label>
                    <input
                      type="text"
                      id="addressLine1"
                      v-model="addressForm.addressLine1"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div class="sm:col-span-4">
                    <label for="addressLine2" class="block text-sm font-medium text-gray-700">Address line 2 (optional)</label>
                    <input
                      type="text"
                      id="addressLine2"
                      v-model="addressForm.addressLine2"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>

                  <div class="sm:col-span-3">
                    <label for="city" class="block text-sm font-medium text-gray-700">City</label>
                    <input
                      type="text"
                      id="city"
                      v-model="addressForm.city"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div class="sm:col-span-3">
                    <label for="state" class="block text-sm font-medium text-gray-700">State / Province</label>
                    <input
                      type="text"
                      id="state"
                      v-model="addressForm.state"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div class="sm:col-span-2">
                    <label for="postalCode" class="block text-sm font-medium text-gray-700">ZIP / Postal code</label>
                    <input
                      type="text"
                      id="postalCode"
                      v-model="addressForm.postalCode"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div class="sm:col-span-3">
                    <label for="country" class="block text-sm font-medium text-gray-700">Country</label>
                    <select
                      id="country"
                      v-model="addressForm.country"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    >
                      <option value="">Select a country</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="AU">Australia</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="JP">Japan</option>
                      <option value="IN">India</option>
                    </select>
                  </div>

                  <div class="sm:col-span-3">
                    <label for="phone" class="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      v-model="addressForm.phone"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div class="sm:col-span-6">
                    <div class="flex items-start">
                      <div class="flex items-center h-5">
                        <input
                          id="isDefault"
                          type="checkbox"
                          v-model="addressForm.isDefault"
                          class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                      <div class="ml-3 text-sm">
                        <label for="isDefault" class="font-medium text-gray-700">Set as default shipping address</label>
                        <p class="text-gray-500">Use this address as my default for all future orders.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    @click="cancelEditAddress"
                    class="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    :disabled="isSavingAddress"
                    class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      v-if="isSavingAddress"
                      class="-ml-1 mr-2 h-4 w-4 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {{ isSavingAddress ? 'Saving...' : 'Save Address' }}
                  </button>
                </div>
              </form>
            </div>

            <!-- Address List -->
            <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div
                v-for="address in addresses"
                :key="address.id"
                class="relative rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                :class="{ 'border-2 border-blue-500': address.isDefault }"
              >
                <div class="flex items-start">
                  <div class="flex-1">
                    <div class="flex items-center">
                      <h4 class="font-medium text-gray-900">{{ address.fullName }}</h4>
                      <span
                        v-if="address.isDefault"
                        class="ml-2 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                      >
                        Default
                      </span>
                    </div>
                    <p class="mt-1 text-sm text-gray-500">{{ address.addressLine1 }}</p>
                    <p v-if="address.addressLine2" class="text-sm text-gray-500">
                      {{ address.addressLine2 }}
                    </p>
                    <p class="text-sm text-gray-500">
                      {{ address.city }}, {{ address.state }} {{ address.postalCode }}
                    </p>
                    <p class="text-sm text-gray-500">{{ getCountryName(address.country) }}</p>
                    <p class="mt-2 text-sm text-gray-500">
                      <span class="font-medium">Phone:</span> {{ address.phone }}
                    </p>
                  </div>
                  <div class="ml-4 flex-shrink-0">
                    <button
                      type="button"
                      @click="editAddress(address)"
                      class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <span class="sr-only">Edit</span>
                      <svg
                        class="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div class="mt-4 flex space-x-3">
                  <button
                    v-if="!address.isDefault"
                    type="button"
                    @click="setDefaultAddress(address.id)"
                    class="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    <svg
                      class="-ml-1 mr-1 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Set as default
                  </button>
                  <button
                    type="button"
                    @click="deleteAddress(address.id)"
                    class="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-500"
                  >
                    <svg
                      class="-ml-1 mr-1 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>

              <div
                v-if="addresses.length === 0"
                class="relative rounded-lg border-2 border-dashed border-gray-300 p-4 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
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
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">No saved addresses</h3>
                <p class="mt-1 text-sm text-gray-500">You haven't saved any addresses yet.</p>
                <div class="mt-6">
                  <button
                    @click="showAddAddressForm = true"
                    type="button"
                    class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg
                      class="-ml-1 mr-2 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Add New Address
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Account Settings -->
          <div v-else-if="activeTab === 'settings'" class="space-y-6">
            <div>
              <h2 class="text-lg font-medium text-gray-900">Account Settings</h2>
              <p class="mt-1 text-sm text-gray-500">Manage your account preferences and security settings.</p>
            </div>

            <div class="space-y-6">
              <!-- Change Password -->
              <div class="bg-white shadow sm:rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                  <h3 class="text-lg font-medium leading-6 text-gray-900">Change Password</h3>
                  <div class="mt-2 max-w-xl text-sm text-gray-500">
                    <p>Update your password associated with your account.</p>
                  </div>
                  <form @submit.prevent="changePassword" class="mt-5 sm:flex sm:items-center">
                    <div class="w-full sm:max-w-xs">
                      <label for="currentPassword" class="sr-only">Current password</label>
                      <input
                        type="password"
                        name="currentPassword"
                        id="currentPassword"
                        v-model="passwordForm.currentPassword"
                        placeholder="Current password"
                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        required
                      />
                    </div>
                    <div class="w-full mt-3 sm:mt-0 sm:ml-3 sm:max-w-xs">
                      <label for="newPassword" class="sr-only">New password</label>
                      <input
                        type="password"
                        name="newPassword"
                        id="newPassword"
                        v-model="passwordForm.newPassword"
                        placeholder="New password"
                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        required
                      />
                    </div>
                    <div class="w-full mt-3 sm:mt-0 sm:ml-3 sm:max-w-xs">
                      <label for="confirmPassword" class="sr-only">Confirm new password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        v-model="passwordForm.confirmPassword"
                        placeholder="Confirm new password"
                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      :disabled="isChangingPassword"
                      class="mt-3 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg
                        v-if="isChangingPassword"
                        class="-ml-1 mr-2 h-4 w-4 animate-spin text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {{ isChangingPassword ? 'Updating...' : 'Update Password' }}
                    </button>
                  </form>
                  <p v-if="passwordError" class="mt-2 text-sm text-red-600">{{ passwordError }}</p>
                </div>
              </div>

              <!-- Email Notifications -->
              <div class="bg-white shadow sm:rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                  <h3 class="text-lg font-medium leading-6 text-gray-900">Email Notifications</h3>
                  <div class="mt-5">
                    <div class="space-y-4">
                      <div class="flex items-start">
                        <div class="flex h-5 items-center">
                          <input
                            id="order-updates"
                            v-model="notificationSettings.orderUpdates"
                            type="checkbox"
                            class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </div>
                        <div class="ml-3 text-sm">
                          <label for="order-updates" class="font-medium text-gray-700">Order updates</label>
                          <p class="text-gray-500">Get notified when your order status changes.</p>
                        </div>
                      </div>
                      <div class="flex items-start">
                        <div class="flex h-5 items-center">
                          <input
                            id="promotions"
                            v-model="notificationSettings.promotions"
                            type="checkbox"
                            class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </div>
                        <div class="ml-3 text-sm">
                          <label for="promotions" class="font-medium text-gray-700">Promotions</label>
                          <p class="text-gray-500">Get notified about special offers and discounts.</p>
                        </div>
                      </div>
                      <div class="flex items-start">
                        <div class="flex h-5 items-center">
                          <input
                            id="newsletter"
                            v-model="notificationSettings.newsletter"
                            type="checkbox"
                            class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </div>
                        <div class="ml-3 text-sm">
                          <label for="newsletter" class="font-medium text-gray-700">Newsletter</label>
                          <p class="text-gray-500">Get our weekly newsletter with the latest products and updates.</p>
                        </div>
                      </div>
                    </div>
                    <div class="mt-5">
                      <button
                        type="button"
                        @click="saveNotificationSettings"
                        class="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Save Preferences
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Delete Account -->
              <div class="bg-red-50 sm:rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                  <h3 class="text-lg font-medium leading-6 text-red-800">Delete account</h3>
                  <div class="mt-2 max-w-xl text-sm text-red-700">
                    <p>Once you delete your account, there is no going back. Please be certain.</p>
                  </div>
                  <div class="mt-5">
                    <button
                      type="button"
                      @click="showDeleteAccountModal = true"
                      class="inline-flex items-center justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:text-sm"
                    >
                      Delete account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Account Confirmation Modal -->
    <div
      v-if="showDeleteAccountModal"
      class="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

        <span class="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>

        <div
          class="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle"
        >
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div
                class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
              >
                <svg
                  class="h-6 w-6 text-red-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg font-medium leading-6 text-gray-900" id="modal-title">Delete account</h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Are you sure you want to delete your account? All of your data will be permanently removed. This action cannot be
                    undone.
                  </p>
                </div>
                <div class="mt-4">
                  <label for="delete-confirmation" class="block text-sm font-medium text-gray-700"
                    >Type "delete" to confirm</label
                  >
                  <input
                    type="text"
                    id="delete-confirmation"
                    v-model="deleteConfirmation"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                    placeholder="Type 'delete' to confirm"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              @click="deleteAccount"
              :disabled="deleteConfirmation.toLowerCase() !== 'delete'"
              class="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto sm:text-sm"
            >
              Delete
            </button>
            <button
              type="button"
              @click="showDeleteAccountModal = false"
              class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { Address, Order, User } from '~/types';

const props = defineProps<{
  user: User;
  orders?: Order[];
  addresses?: Address[];
}>();

const emit = defineEmits(['update-profile', 'change-password', 'save-notification-settings', 'delete-account']);
const router = useRouter();

// Tabs
const tabs = [
  { id: 'profile', name: 'Profile' },
  { id: 'orders', name: 'Orders', count: props.orders?.length || 0 },
  { id: 'addresses', name: 'Addresses' },
  { id: 'settings', name: 'Settings' }
];

const activeTab = ref('profile');

// Profile form
const isEditing = ref(false);
const isSubmitting = ref(false);
const formData = ref({
  name: props.user.name || '',
  email: props.user.email || '',
  phone: props.user.phone || '',
  address: props.user.address || '',
  city: props.user.city || '',
  state: props.user.state || '',
  postalCode: props.user.postalCode || ''
});

// Address book
const showAddAddressForm = ref(false);
const isSavingAddress = ref(false);
const editingAddress = ref<Address | null>(null);
const addressForm = ref({
  fullName: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'US',
  phone: '',
  isDefault: false
});

// Password change
const isChangingPassword = ref(false);
const passwordError = ref('');
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// Notification settings
const notificationSettings = ref({
  orderUpdates: true,
  promotions: true,
  newsletter: true,
  ...props.user.notificationSettings
});

// Delete account
const showDeleteAccountModal = ref(false);
const deleteConfirmation = ref('');

// Computed
const userInitials = computed(() => {
  if (!props.user.name) return 'U';
  return props.user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
});

// Methods
const updateProfile = async () => {
  isSubmitting.value = true;
  try {
    await emit('update-profile', formData.value);
    isEditing.value = false;
  } catch (error) {
    console.error('Failed to update profile:', error);
  } finally {
    isSubmitting.value = false;
  }
};

const changePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordError.value = 'New passwords do not match';
    return;
  }

  if (passwordForm.value.newPassword.length < 8) {
    passwordError.value = 'Password must be at least 8 characters long';
    return;
  }

  isChangingPassword.value = true;
  passwordError.value = '';

  try {
    await emit('change-password', {
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword
    });
    
    // Reset form on success
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  } catch (error: any) {
    passwordError.value = error.message || 'Failed to change password';
  } finally {
    isChangingPassword.value = false;
  }
};

const saveNotificationSettings = async () => {
  try {
    await emit('save-notification-settings', notificationSettings.value);
  } catch (error) {
    console.error('Failed to save notification settings:', error);
  }
};

const deleteAccount = async () => {
  if (deleteConfirmation.value.toLowerCase() !== 'delete') return;
  
  try {
    await emit('delete-account');
    // Redirect to home or login page after account deletion
    router.push('/');
  } catch (error) {
    console.error('Failed to delete account:', error);
  } finally {
    showDeleteAccountModal.value = false;
    deleteConfirmation.value = '';
  }
};

// Address book methods
const editAddress = (address: Address) => {
  editingAddress.value = address;
  addressForm.value = { ...address };
  showAddAddressForm.value = true;
};

const saveAddress = async () => {
  isSavingAddress.value = true;
  try {
    const addressData = { ...addressForm.value };
    
    if (editingAddress.value) {
      // Update existing address
      await emit('update-address', {
        id: editingAddress.value.id,
        ...addressData
      });
    } else {
      // Add new address
      await emit('add-address', addressData);
    }
    
    // Reset form
    cancelEditAddress();
  } catch (error) {
    console.error('Failed to save address:', error);
  } finally {
    isSavingAddress.value = false;
  }
};

const cancelEditAddress = () => {
  editingAddress.value = null;
  showAddAddressForm.value = false;
  addressForm.value = {
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
    phone: '',
    isDefault: false
  };
};

const setDefaultAddress = (addressId: string) => {
  emit('set-default-address', addressId);
};

const deleteAddress = (addressId: string) => {
  if (confirm('Are you sure you want to delete this address?')) {
    emit('delete-address', addressId);
  }
};

const getCountryName = (code: string) => {
  const countries: Record<string, string> = {
    US: 'United States',
    CA: 'Canada',
    UK: 'United Kingdom',
    AU: 'Australia',
    DE: 'Germany',
    FR: 'France',
    JP: 'Japan',
    IN: 'India'
  };
  return countries[code] || code;
};

// Order methods
const viewOrderDetails = (orderId: string) => {
  router.push(`/orders/${orderId}`);
};

const reorder = (order: Order) => {
  emit('reorder', order);
};

const viewProduct = (productId: string) => {
  router.push(`/products/${productId}`);
};

// Initialize
onMounted(() => {
  // Load user data if not passed as props
  if (!props.user) {
    // Fetch user data here if needed
  }
});
</script>