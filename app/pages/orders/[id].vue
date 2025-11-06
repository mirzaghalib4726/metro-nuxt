<template>
  <div v-if="order" class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      <!-- Order Header -->
      <div class="md:flex md:items-center md:justify-between mb-6">
        <div class="flex-1 min-w-0">
          <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Order #{{ order.orderNumber }}
          </h2>
          <div class="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
            <div class="mt-2 flex items-center text-sm text-gray-500">
              <CalendarIcon class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
              Placed on {{ formatDate(order.createdAt) }}
            </div>
            <div class="mt-2 flex items-center text-sm text-gray-500">
              <CashIcon class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
              {{ formatCurrency(order.totalAmount) }}
            </div>
            <div class="mt-2 flex items-center text-sm text-gray-500">
              <span class="flex items-center">
                <span class="h-2 w-2 rounded-full bg-green-400 mr-1.5" :class="statusColor" />
                {{ order.status }}
              </span>
            </div>
          </div>
        </div>
        <div class="mt-4 flex md:mt-0 md:ml-4">
          <button
            v-if="canUpdateOrderStatus(order.status)"
            @click="updateOrderStatus(getNextStatus(order.status))"
            type="button"
            class="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ArrowPathIcon class="-ml-1 mr-2 h-5 w-5" />
            Mark as {{ getNextStatus(order.status) }}
          </button>
          <button
            v-if="canCancelOrder"
            @click="cancelOrder"
            type="button"
            class="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <XMarkIcon class="-ml-1 mr-2 h-5 w-5 text-gray-500" />
            Cancel Order
          </button>
          <a
            :href="`/api/v1/orders/${order._id}/invoice`"
            target="_blank"
            class="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <DocumentArrowDownIcon class="-ml-1 mr-2 h-5 w-5 text-gray-500" />
            Invoice
          </a>
        </div>
      </div>

      <!-- Order Details -->
      <div class="mt-8">
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Order Information
            </h3>
          </div>
          <div class="border-t border-gray-200">
            <dl>
              <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">
                  Order number
                </dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {{ order.orderNumber }}
                </dd>
              </div>
              <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">
                  Date placed
                </dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {{ formatDate(order.createdAt) }}
                </dd>
              </div>
              <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">
                  Payment method
                </dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {{ order.payment?.method || 'N/A' }}
                  <p class="text-xs text-gray-500 mt-1" v-if="order.payment?.transactionId">
                    Transaction ID: {{ order.payment.transactionId }}
                  </p>
                </dd>
              </div>
              <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">
                  Order status
                </dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span :class="`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor} ${statusTextColor}`">
                    {{ order.status }}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <!-- Order Items -->
      <div class="mt-8">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
          Order Items
        </h3>
        <div class="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" class="divide-y divide-gray-200">
            <li v-for="item in order.items" :key="item._id" class="px-4 py-4 sm:px-6">
              <div class="flex items-center">
                <div class="min-w-0 flex-1 flex items-center">
                  <div class="flex-shrink-0">
                    <img class="h-16 w-16 rounded-md object-cover" :src="item.product.images?.[0] || 'https://via.placeholder.com/150'" :alt="item.product.name" />
                  </div>
                  <div class="min-w-0 flex-1 px-4">
                    <div>
                      <h4 class="text-sm font-medium text-indigo-600 truncate">
                        {{ item.product.name }}
                      </h4>
                      <p class="mt-1 text-sm text-gray-500">
                        Quantity: {{ item.quantity }}
                      </p>
                      <p class="mt-1 text-sm text-gray-500">
                        SKU: {{ item.product.sku || 'N/A' }}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="ml-4 flex-shrink-0">
                  <p class="text-sm font-medium text-gray-900">
                    {{ formatCurrency(item.price * item.quantity) }}
                    <span v-if="item.quantity > 1" class="text-xs text-gray-500">
                      ({{ formatCurrency(item.price) }} each)
                    </span>
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="mt-8">
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Order Summary
            </h3>
          </div>
          <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl class="sm:divide-y sm:divide-gray-200">
              <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">
                  Subtotal
                </dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {{ formatCurrency(order.subtotal) }}
                </dd>
              </div>
              <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">
                  Shipping
                </dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {{ order.shippingCost ? formatCurrency(order.shippingCost) : 'Free' }}
                </dd>
              </div>
              <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">
                  Tax
                </dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {{ formatCurrency(order.taxAmount || 0) }}
                </dd>
              </div>
              <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
                <dt class="text-lg font-bold text-gray-900">
                  Total
                </dt>
                <dd class="mt-1 text-lg font-bold text-gray-900 sm:mt-0 sm:col-span-2">
                  {{ formatCurrency(order.totalAmount) }}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <!-- Customer Information -->
      <div class="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <!-- Shipping Address -->
        <div>
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
            Shipping Information
          </h3>
          <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <div class="text-sm text-gray-900">
                <p class="font-medium">{{ order.shippingAddress?.name || 'N/A' }}</p>
                <p>{{ order.shippingAddress?.street }}</p>
                <p>{{ order.shippingAddress?.city }}, {{ order.shippingAddress?.state }} {{ order.shippingAddress?.postalCode }}</p>
                <p>{{ order.shippingAddress?.country }}</p>
                <p class="mt-2">
                  <span class="font-medium">Phone:</span> {{ order.shippingAddress?.phone || 'N/A' }}
                </p>
                <p v-if="order.shippingMethod">
                  <span class="font-medium">Method:</span> {{ order.shippingMethod }}
                </p>
                <p v-if="order.trackingNumber">
                  <span class="font-medium">Tracking #:</span> {{ order.trackingNumber }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Billing Address -->
        <div>
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
            Billing Information
          </h3>
          <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <div class="text-sm text-gray-900">
                <p class="font-medium">{{ order.billingAddress?.name || 'N/A' }}</p>
                <p>{{ order.billingAddress?.street }}</p>
                <p>{{ order.billingAddress?.city }}, {{ order.billingAddress?.state }} {{ order.billingAddress?.postalCode }}</p>
                <p>{{ order.billingAddress?.country }}</p>
                <p class="mt-2">
                  <span class="font-medium">Phone:</span> {{ order.billingAddress?.phone || 'N/A' }}
                </p>
                <p v-if="order.payment?.method">
                  <span class="font-medium">Payment Method:</span> {{ order.payment.method }}
                </p>
                <p v-if="order.payment?.transactionId">
                  <span class="font-medium">Transaction ID:</span> {{ order.payment.transactionId }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Notes -->
      <div v-if="order.notes" class="mt-8">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
          Order Notes
        </h3>
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <p class="text-sm text-gray-700 whitespace-pre-line">{{ order.notes }}</p>
          </div>
        </div>
      </div>

      <!-- Order Timeline -->
      <div class="mt-8">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
          Order Status History
        </h3>
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="flow-root">
              <ul role="list" class="-mb-8">
                <li v-for="(event, eventIdx) in orderHistory" :key="event.id">
                  <div class="relative pb-8">
                    <span v-if="eventIdx !== orderHistory.length - 1" 
                          class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" 
                          aria-hidden="true" />
                    <div class="relative flex space-x-3">
                      <div>
                        <span :class="[event.iconBackground, 'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white']">
                          <component :is="event.icon" class="h-5 w-5 text-white" aria-hidden="true" />
                        </span>
                      </div>
                      <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p class="text-sm text-gray-500">
                            {{ event.content }}
                          </p>
                        </div>
                        <div class="text-right text-sm whitespace-nowrap text-gray-500">
                          <time :datetime="event.date">{{ formatDateTime(event.date) }}</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { 
  CheckCircleIcon, 
  XMarkIcon, 
  ClockIcon, 
  TruckIcon, 
  HomeIcon, 
  ArrowPathIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  DocumentArrowDownIcon
} from '@heroicons/vue/24/outline';

interface OrderItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    sku?: string;
    images?: string[];
  };
  quantity: number;
  price: number;
}

interface Address {
  name: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

interface Payment {
  method: string;
  status: string;
  transactionId?: string;
  amount?: number;
  currency?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  totalAmount: number;
  status: string;
  payment: Payment;
  shippingAddress: Address;
  billingAddress: Address;
  shippingMethod?: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  history?: Array<{
    status: string;
    date: string;
    note?: string;
  }>;
}

const route = useRoute();
const orderId = route.params.id as string;
const order = ref<Order | null>(null);
const canCancelOrder = computed(() => {
  if (!order.value?.status) return false;
  return order.value.status === 'pending' || order.value.status === 'processing';
});
const loading = ref(true);
const error = ref('');

// Fetch order details
onMounted(async () => {
  try {
    const response = await $fetch<{ data: Order; success: boolean }>(`/api/v1/orders/${orderId}`);
    if (response.success && response.data) {
      order.value = response.data;
    }
  } catch (err: any) {
    console.error('Error fetching order:', err);
    error.value = 'Failed to load order details. Please try again.';
  } finally {
    loading.value = false;
  }
});

// Computed properties for status display
const statusColor = computed(() => {
  if (!order.value?.status) return 'bg-gray-100 text-gray-800';
  
  const statusColors: Record<string, string> = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'processing': 'bg-blue-100 text-blue-800',
    'shipped': 'bg-indigo-100 text-indigo-800',
    'delivered': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800',
  };
  
  return statusColors[order.value.status.toLowerCase()] || 'bg-gray-100 text-gray-800';
});

const statusTextColor = computed(() => {
  if (!order.value) return '';
  
  const statusColors: Record<string, string> = {
    'pending': 'text-yellow-800',
    'processing': 'text-blue-800',
    'shipped': 'text-indigo-800',
    'delivered': 'text-green-800',
    'cancelled': 'text-red-800',
  };
  
  return statusColors[order.value?.status?.toLowerCase()] || 'text-gray-800';
});

// Format order history for timeline
const orderHistory = computed(() => {
  if (!order.value?.history?.length) return [];
  
  const history = [
    {
      id: 1,
      type: 'order_placed',
      content: 'Order placed',
      date: order.value.createdAt,
      icon: CheckCircleIcon,
      iconBackground: 'bg-green-500',
    },
  ];

  // Add payment status
  if (order.value.payment?.status === 'paid') {
    history.push({
      id: 2,
      type: 'payment_received',
      content: 'Payment received',
      date: order.value.updatedAt, // This should ideally be the payment date
      icon: CheckCircleIcon,
      iconBackground: 'bg-green-500',
    });
  }

  // Add status changes from history
  if (order.value.history && order.value.history.length > 0) {
    order.value.history.forEach((item, index) => {
      let icon = ClockIcon;
      let iconBg = 'bg-gray-400';
      
      switch(item.status.toLowerCase()) {
        case 'processing':
          icon = ArrowPathIcon;
          iconBg = 'bg-blue-500';
          break;
        case 'shipped':
          icon = TruckIcon;
          iconBg = 'bg-indigo-500';
          break;
        case 'delivered':
          icon = CheckCircleIcon;
          iconBg = 'bg-green-500';
          break;
        case 'cancelled':
          icon = XMarkIcon;
          iconBg = 'bg-red-500';
          break;
      }
      
      history.push({
        id: 10 + index,
        type: `status_${item.status.toLowerCase()}`,
        content: `Order marked as ${item.status}${item.note ? `: ${item.note}` : ''}`,
        date: item.date,
        icon,
        iconBackground: iconBg,
      });
    });
  }
  
  // If no history, add current status
  if (history.length === 1) {
    history.push({
      id: 9,
      type: `status_${order.value.status.toLowerCase()}`,
      content: `Order is ${order.value.status}`,
      date: order.value.updatedAt,
      icon: getStatusIcon(order.value.status),
      iconBackground: getStatusIconBg(order.value.status),
    });
  }
  
  // Sort by date
  return history.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
});

// Helper functions
function getStatusIcon(status: string) {
  const statusIcons: Record<string, any> = {
    'pending': ClockIcon,
    'processing': ArrowPathIcon,
    'shipped': TruckIcon,
    'delivered': CheckCircleIcon,
    'cancelled': XMarkIcon,
  };
  return statusIcons[status.toLowerCase()] || ClockIcon;
}

function getStatusIconBg(status: string) {
  const statusColors: Record<string, string> = {
    'pending': 'bg-yellow-500',
    'processing': 'bg-blue-500',
    'shipped': 'bg-indigo-500',
    'delivered': 'bg-green-500',
    'cancelled': 'bg-red-500',
  };
  return statusColors[status.toLowerCase()] || 'bg-gray-400';
}

function formatDate(dateString: string) {
  if (!order.value) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatDateTime(dateString?: string) {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleString();
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

// Order status management
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

function getNextStatus(currentStatus: string): string {
  if (!currentStatus) return '';
  
  const statusFlow: Record<string, string> = {
    'pending': 'processing',
    'processing': 'shipped',
    'shipped': 'delivered',
    'delivered': '',
    'cancelled': ''
  };
  
  return statusFlow[currentStatus.toLowerCase()] || '';
}

async function updateOrderStatus(newStatus: string) {
  if (!order.value) return;
  
  if (!confirm(`Are you sure you want to mark this order as ${newStatus}?`)) {
    return;
  }
  
  try {
    await $fetch(`/api/v1/orders/${order.value._id}/status`, {
      method: 'POST',
      body: { status: newStatus }
    } as const);
    
    // Refresh order data
    const response = await $fetch<{ data: Order; success: boolean }>(`/api/v1/orders/${orderId}`);
    if (response.success && response.data) {
      order.value = response.data;
    }
    
  } catch (err: any) {
    console.error('Error updating order status:', err);
    alert('Failed to update order status');
  }
}

async function cancelOrder() {
  if (!order.value) return;
  
  if (!confirm('Are you sure you want to cancel this order?')) {
    return;
  }
  
  try {
    await updateOrderStatus('cancelled');
  } catch (err) {
    console.error('Error cancelling order:', err);
    alert('Failed to cancel order');
  }
}
</script>
