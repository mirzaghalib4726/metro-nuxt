<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Orders</h1>
      <div class="flex space-x-2">
        <select 
          v-model="filters.status"
          class="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">All Status</option>
          <option v-for="status in orderStatuses" :key="status" :value="status">
            {{ status }}
          </option>
        </select>
        <input
          type="date"
          v-model="filters.startDate"
          class="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
        <input
          type="date"
          v-model="filters.endDate"
          class="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
        <input
          type="text"
          v-model="filters.search"
          placeholder="Search orders..."
          class="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
      </div>
    </div>

    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="order in orders" :key="order._id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                #{{ order.orderNumber }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ order.user?.name || 'Guest' }}</div>
                <div class="text-sm text-gray-500">{{ order.user?.email || '' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(order.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.status)}`">
                  {{ order.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                ${{ order.totalAmount?.toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <NuxtLink 
                  :to="`/orders/${order._id}`" 
                  class="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  View
                </NuxtLink>
                <button 
                  v-if="canUpdateOrderStatus(order.status)"
                  @click="updateOrderStatus(order._id, getNextStatus(order.status))"
                  class="text-green-600 hover:text-green-900"
                >
                  Mark as {{ getNextStatus(order.status) }}
                </button>
              </td>
            </tr>
            <tr v-if="orders.length === 0">
              <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
                No orders found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing <span class="font-medium">{{ pagination.offset + 1 }}</span>
              to <span class="font-medium">{{ Math.min(pagination.offset + pagination.limit, pagination.total) }}</span>
              of <span class="font-medium">{{ pagination.total }}</span> results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                @click="previousPage"
                :disabled="pagination.page === 1"
                :class="`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${pagination.page === 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'}`"
              >
                <span class="sr-only">Previous</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
              <button
                v-for="pageNumber in visiblePageNumbers"
                :key="pageNumber"
                @click="goToPage(pageNumber)"
                :class="`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${pageNumber === pagination.page ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`"
              >
                {{ pageNumber }}
              </button>
              <button
                @click="nextPage"
                :disabled="pagination.page >= pagination.totalPages"
                :class="`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${pagination.page >= pagination.totalPages ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'}`"
              >
                <span class="sr-only">Next</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';

interface Order {
  _id: string;
  orderNumber: string;
  user?: {
    name: string;
    email: string;
  };
  status: string;
  totalAmount: number;
  createdAt: string;
  items: Array<{
    product: {
      _id: string;
      name: string;
      price: number;
    };
    quantity: number;
    price: number;
  }>;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  offset: number;
}

const router = useRouter();
const orders = ref<Order[]>([]);
const loading = ref(false);
const orderStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const filters = ref({
  status: '',
  startDate: '',
  endDate: '',
  search: ''
});

const pagination = ref<Pagination>({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
  offset: 0
});

// Computed property for visible page numbers in pagination
const visiblePageNumbers = computed(() => {
  const current = pagination.value.page;
  const total = pagination.value.totalPages;
  const range = 2; // Number of pages to show before and after current page
  
  let start = Math.max(1, current - range);
  let end = Math.min(total, current + range);
  
  if (current - range <= 1) {
    end = Math.min(2 * range + 1, total);
  }
  
  if (current + range >= total) {
    start = Math.max(1, total - 2 * range);
  }
  
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

// Watch for filter changes and reload orders
watch([() => filters.value, () => pagination.value.page], () => {
  fetchOrders();
}, { deep: true });

// Fetch orders from API
async function fetchOrders() {
  try {
    loading.value = true;
    
    const query = new URLSearchParams({
      page: pagination.value.page.toString(),
      limit: pagination.value.limit.toString(),
      ...(filters.value.status && { status: filters.value.status }),
      ...(filters.value.startDate && { startDate: filters.value.startDate }),
      ...(filters.value.endDate && { endDate: filters.value.endDate }),
      ...(filters.value.search && { search: filters.value.search })
    }).toString();
    
    const response = await $fetch<{
      data: {
        orders: Order[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      };
      success: boolean;
    }>(`/api/v1/orders?${query}`);
    
    if (response.data) {
      orders.value = response.data.orders || [];
      pagination.value = {
        ...pagination.value,
        total: response.data.pagination.total,
        totalPages: response.data.pagination.totalPages,
        offset: (response.data.pagination.page - 1) * response.data.pagination.limit
      };
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
  } finally {
    loading.value = false;
  }
}

// Navigation functions
function previousPage() {
  if (pagination.value?.page > 1) {
    pagination.value.page--;
  }
}

function nextPage() {
  if (pagination.value?.page < pagination.value?.totalPages) {
    pagination.value.page++;
  }
}

function goToPage(page: number) {
  if (page >= 1 && page <= pagination.value?.totalPages) {
    pagination.value.page = page;
  }
}

// Format date for display
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Get badge class based on status
function getStatusBadgeClass(status?: string) {
  if (!status) return 'bg-gray-100 text-gray-800';
  
  const statusClasses: Record<string, string> = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'processing': 'bg-blue-100 text-blue-800',
    'shipped': 'bg-indigo-100 text-indigo-800',
    'delivered': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800',
  };
  
  return statusClasses[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
}

// Check if order status can be updated
function canUpdateOrderStatus(currentStatus: string): boolean {
  if (!currentStatus) return false;
  
  const validTransitions: Record<string, string[]> = {
    'pending': ['processing', 'cancelled'],
    'processing': ['shipped', 'cancelled'],
    'shipped': ['delivered'],
    'delivered': [],
    'cancelled': []
  };
  
  const transitions = validTransitions[currentStatus.toLowerCase()];
  return Array.isArray(transitions) && transitions.length > 0;
}

// Get next status for order
function getNextStatus(currentStatus: string): string {
  const nextStatus: Record<string, string> = {
    'pending': 'processing',
    'processing': 'shipped',
    'shipped': 'delivered',
    'delivered': 'delivered',
    'cancelled': 'cancelled'
  };
  return nextStatus[currentStatus] || currentStatus;
}

// Update order status
async function updateOrderStatus(orderId: string, newStatus: string) {
  if (!confirm(`Are you sure you want to mark this order as ${newStatus}?`)) {
    return;
  }
  
  try {
    await $fetch(`/api/v1/orders/${orderId}/status`, {
      method: 'POST',
      body: { status: newStatus }
    } as const);
    
    // Refresh orders
    await fetchOrders();
  } catch (error) {
    console.error('Error updating order status:', error);
    alert('Failed to update order status');
  }
}

// Initial fetch
fetchOrders();
</script>
