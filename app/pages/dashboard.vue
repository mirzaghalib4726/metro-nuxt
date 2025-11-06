<template>
  <div class="page">
    <header class="page__header">
      <span class="badge">Admin overview</span>
      <h1 class="page__title">Metro operations cockpit</h1>
      <p class="page__subtitle">
        Monitor catalogue health, stay ahead of fulfilment, and keep a pulse on revenue across teams.
      </p>
    </header>

    <section v-if="loading" class="product-catalog__loading">
      <div class="spinner" />
      <p>Loading dashboard insights…</p>
    </section>

    <section v-else-if="error" class="product-catalog__empty">
      <h2>We couldn’t load your metrics</h2>
      <p>{{ error }}</p>
      <button type="button" class="btn btn--primary" @click="reload">Retry</button>
    </section>

    <template v-else>
      <section class="page-grid page-grid--two">
        <article class="info-card" v-for="card in statCards" :key="card.label">
          <span class="badge">{{ card.label }}</span>
          <p class="info-card__title" style="font-size:2.2rem;">{{ card.value }}</p>
          <p class="info-card__meta">{{ card.caption }}</p>
        </article>
      </section>

      <section class="page-grid page-grid--balanced">
        <article class="highlight-card" style="display:grid; gap:18px; padding:32px;">
          <h2 class="section__title" style="margin:0;">Revenue snapshot</h2>
          <p class="text-muted" style="margin:0;">
            Revenue in the last 30 days reflects delivered and processing orders excluding cancellations.
          </p>
          <div style="display:grid; gap:16px; grid-template-columns:repeat(auto-fit, minmax(160px, 1fr));">
            <div class="stat-card">
              <span class="stat-card__value" style="font-size:1.8rem;">{{ formatCurrency(stats.revenueLast30Days) }}</span>
              <p class="text-muted" style="margin:4px 0 0; font-size:0.85rem;">Revenue · last 30 days</p>
            </div>
            <div class="stat-card">
              <span class="stat-card__value" style="font-size:1.8rem;">{{ stats.pendingOrders }}</span>
              <p class="text-muted" style="margin:4px 0 0; font-size:0.85rem;">Orders awaiting fulfilment</p>
            </div>
          </div>
        </article>

        <article class="highlight-card" style="display:grid; gap:18px; padding:32px;">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:16px;">
            <h2 class="section__title" style="margin:0;">Recent orders</h2>
            <NuxtLink to="/orders" class="btn btn--ghost" style="padding:6px 16px;">View all</NuxtLink>
          </div>
          <div v-if="recentOrders.length === 0" class="product-catalog__empty" style="padding:32px;">
            <h3>No orders yet</h3>
            <p>Launch a campaign or import catalogue data to start receiving orders.</p>
          </div>
          <ul v-else class="list-reset" style="display:grid; gap:12px;">
            <li
              v-for="order in recentOrders"
              :key="order.id"
              style="display:grid; gap:12px; padding:18px; border-radius:var(--radius-medium); border:1px solid rgba(148,163,184,0.18); background:var(--surface);"
            >
              <div style="display:flex; justify-content:space-between; align-items:center; gap:12px;">
                <div>
                  <strong style="font-family:var(--font-display);">{{ order.orderNumber }}</strong>
                  <p class="text-muted" style="margin:4px 0 0; font-size:0.85rem;">
                    {{ order.items.length }} item{{ order.items.length === 1 ? '' : 's' }} · {{ formatCurrency(order.totalAmount) }}
                  </p>
                </div>
                <span :class="['badge', statusBadge(order.status)]" style="letter-spacing:0; text-transform:none;">
                  {{ statusLabel(order.status) }}
                </span>
              </div>
              <div style="display:flex; justify-content:space-between; font-size:0.85rem; color:var(--slate-500);">
                <span>{{ order.user?.name || 'Guest shopper' }}</span>
                <span>{{ formatDate(order.createdAt) }}</span>
              </div>
            </li>
          </ul>
        </article>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useNuxtApp } from '#imports';
import { useAuthStore } from '~/store/auth';

definePageMeta({
  middleware: ['admin'],
});

interface DashboardStats {
  products: number;
  orders: number;
  categories: number;
  users: number;
  revenueLast30Days: number;
  pendingOrders: number;
}

interface OrderSummary {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  items: Array<{
    productId: string;
    name?: string;
    quantity: number;
    price: number;
  }>;
}

const { $apiFetch } = useNuxtApp();
const authStore = useAuthStore();
await authStore.initialize();

const loading = ref(true);
const error = ref('');
const stats = reactive<DashboardStats>({
  products: 0,
  orders: 0,
  categories: 0,
  users: 0,
  revenueLast30Days: 0,
  pendingOrders: 0,
});
const recentOrders = ref<OrderSummary[]>([]);

const fetchDashboard = async () => {
  loading.value = true;
  error.value = '';

  try {
    const statsResponse = await $apiFetch<{ success: boolean; data: DashboardStats }>('/dashboard/stats');
    if (!statsResponse?.success) {
      throw new Error('Unable to load dashboard statistics');
    }

    Object.assign(stats, statsResponse.data);

    const ordersResponse = await $apiFetch<{
      success: boolean;
      data: { orders: OrderSummary[] };
    }>('/orders', {
      params: { limit: 5, scope: 'admin' },
    });

    if (!ordersResponse?.success) {
      throw new Error('Unable to load recent orders');
    }

    recentOrders.value = ordersResponse.data.orders;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Dashboard load error:', err);
    error.value =
      err instanceof Error ? err.message : 'Failed to load dashboard data. Please try again.';
  } finally {
    loading.value = false;
  }
};

await fetchDashboard();

const statCards = computed(() => [
  {
    label: 'Catalogue',
    value: stats.products.toLocaleString(),
    caption: `${stats.categories} curated categories`,
  },
  {
    label: 'Orders processed',
    value: stats.orders.toLocaleString(),
    caption: `${stats.pendingOrders} waiting fulfilment`,
  },
  {
    label: 'Customers',
    value: stats.users.toLocaleString(),
    caption: 'Active accounts in the last 12 months',
  },
  {
    label: '30-day revenue',
    value: formatCurrency(stats.revenueLast30Days),
    caption: 'Delivered + in-progress orders',
  },
]);

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

const statusBadge = (status: string) => {
  const mapping: Record<string, string> = {
    pending: 'status--warning',
    processing: 'status--info',
    shipped: 'status--info',
    delivered: 'status--success',
    cancelled: 'status--danger',
  };
  return mapping[status.toLowerCase()] ?? 'status--neutral';
};

const statusLabel = (status: string) =>
  status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

const reload = async () => {
  await fetchDashboard();
};
</script>

<style scoped>
.status--warning {
  background: rgba(250, 204, 21, 0.18);
  color: #b45309;
}

.status--info {
  background: rgba(59, 130, 246, 0.12);
  color: #1d4ed8;
}

.status--success {
  background: rgba(34, 197, 94, 0.15);
  color: #15803d;
}

.status--danger {
  background: rgba(239, 68, 68, 0.15);
  color: #b91c1c;
}

.status--neutral {
  background: rgba(148, 163, 184, 0.15);
  color: #475569;
}
</style>
