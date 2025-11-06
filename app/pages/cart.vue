<template>
  <div class="cart">
    <header class="product-catalog__header" style="gap:16px;">
      <div class="product-catalog__intro">
        <h1>Your Metro tote</h1>
        <p>Curate pieces with purpose. Secure checkout, flexible fulfilment, and concierge support.</p>
      </div>
      <NuxtLink to="/products" class="btn btn--ghost" style="justify-self:start;">Discover more pieces</NuxtLink>
    </header>

    <section class="cart__layout" style="grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:32px;">
      <div class="cart__items" style="padding:28px; display:grid; gap:20px;">
        <div v-if="isEmpty" class="product-catalog__empty">
          <h2>Your cart is feeling minimal</h2>
          <p>Save favourites as you browse. Ready when you are.</p>
          <NuxtLink to="/products" class="btn btn--primary">Continue shopping</NuxtLink>
        </div>

        <ul v-else class="list-reset" style="display:grid; gap:18px;">
          <li
            v-for="item in items"
            :key="item.productId"
            class="highlight-card"
            style="padding:20px; display:grid; gap:16px; grid-template-columns:120px 1fr; align-items:center;"
          >
            <div style="width:120px; height:120px; overflow:hidden; border-radius:16px; background:var(--slate-100);">
              <img :src="item.image || fallbackImage" :alt="item.name" style="width:100%; height:100%; object-fit:cover;" />
            </div>

            <div style="display:grid; gap:12px;">
              <div style="display:flex; justify-content:space-between; gap:12px; align-items:flex-start;">
                <div>
                  <NuxtLink
                    :to="`/products/${item.productId}`"
                    style="font-family:var(--font-display); font-size:1.05rem; font-weight:600; color:var(--slate-900);"
                  >
                    {{ item.name }}
                  </NuxtLink>
                  <p class="text-muted" style="margin:4px 0 0; font-size:0.8rem;">{{ item.category || 'Curated selection' }}</p>
                </div>
                <button type="button" class="btn btn--ghost" style="padding:6px 12px;" @click="removeItem(item.productId)">
                  Remove
                </button>
              </div>

              <div style="display:flex; gap:16px; flex-wrap:wrap; align-items:center;">
                <label :for="`quantity-${item.productId}`" style="font-size:0.75rem; letter-spacing:0.3em; text-transform:uppercase; color:var(--slate-400);">
                  Quantity
                </label>
                <select
                  :id="`quantity-${item.productId}`"
                  :value="item.quantity"
                  class="input-field"
                  style="width:90px; text-align:center;"
                  @change="onQuantityChange(item.productId, $event)"
                >
                  <option v-for="count in 10" :key="count" :value="count">{{ count }}</option>
                </select>
                <div style="margin-left:auto; text-align:right;">
                  <p class="text-muted" style="margin:0; font-size:0.8rem;">Unit</p>
                  <p style="margin:4px 0 0; font-weight:600;">${{ item.price.toFixed(2) }}</p>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <aside class="cart__summary" style="display:grid; gap:18px;">
        <h2 style="font-family:var(--font-display); font-size:1.6rem; margin:0;">Order summary</h2>
        <dl style="display:grid; gap:12px; font-size:0.95rem; color:var(--slate-500);">
          <div style="display:flex; justify-content:space-between;">
            <dt>Subtotal</dt>
            <dd style="font-weight:600; color:var(--slate-900);">${{ subtotal.toFixed(2) }}</dd>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <dt>Shipping</dt>
            <dd>{{ shippingEstimate > 0 ? `$${shippingEstimate.toFixed(2)}` : 'Complimentary' }}</dd>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <dt>Carbon offset</dt>
            <dd>Included</dd>
          </div>
          <div style="display:flex; justify-content:space-between; border-top:1px solid rgba(148,163,184,0.2); padding-top:12px; font-weight:600; color:var(--slate-900);">
            <dt>Total</dt>
            <dd>${{ total.toFixed(2) }}</dd>
          </div>
        </dl>

        <form class="highlight-card" style="display:grid; gap:16px; padding:24px;" @submit.prevent="handleCheckout">
          <h3 style="font-size:0.95rem; text-transform:uppercase; letter-spacing:0.28em; color:var(--slate-400); margin:0;">
            Delivery details
          </h3>
          <div style="display:grid; gap:12px;">
            <div style="display:grid; gap:12px; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr));">
              <label class="form-row" style="margin:0;">
                <span class="label">Street</span>
                <input v-model="shipping.street" type="text" class="input-field" required placeholder="123 Market Street" />
              </label>
              <label class="form-row" style="margin:0;">
                <span class="label">City</span>
                <input v-model="shipping.city" type="text" class="input-field" required placeholder="San Francisco" />
              </label>
            </div>
            <div style="display:grid; gap:12px; grid-template-columns:repeat(auto-fit, minmax(120px, 1fr));">
              <label class="form-row" style="margin:0;">
                <span class="label">State</span>
                <input v-model="shipping.state" type="text" class="input-field" required placeholder="CA" />
              </label>
              <label class="form-row" style="margin:0;">
                <span class="label">Postal code</span>
                <input v-model="shipping.zipCode" type="text" class="input-field" required placeholder="94105" />
              </label>
              <label class="form-row" style="margin:0;">
                <span class="label">Country</span>
                <input v-model="shipping.country" type="text" class="input-field" required placeholder="United States" />
              </label>
            </div>
          </div>

          <button
            type="submit"
            class="btn btn--primary"
            style="width:100%; justify-content:center;"
            :disabled="isEmpty || isSubmitting"
            :style="isEmpty || isSubmitting ? 'opacity:0.6; pointer-events:none;' : ''"
          >
            {{ isSubmitting ? 'Processing…' : 'Proceed to checkout' }}
          </button>

          <p class="text-muted" style="text-align:center; font-size:0.8rem; margin:0;">
            Taxes calculated at payment · Secure checkout powered by Metro Pay
          </p>
          <p v-if="!authStore.isAuthenticated" class="text-muted" style="text-align:center; font-size:0.8rem; margin:0;">
            Sign in with an admin or customer account to complete checkout.
          </p>

          <div v-if="submissionStatus" :style="statusStyles">
            {{ submissionMessage }}
          </div>
        </form>

        <div class="highlight-card" style="padding:24px; display:grid; gap:12px;">
          <h3 style="font-size:0.9rem; text-transform:uppercase; letter-spacing:0.3em; color:var(--slate-400);">Need a hand?</h3>
          <p class="text-muted" style="font-size:0.9rem;">Our concierge team can help curate sets, arrange bespoke delivery, or answer material questions.</p>
          <NuxtLink to="/contact" class="btn btn--ghost" style="justify-content:center;">Chat with us</NuxtLink>
        </div>
      </aside>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useCartStore } from '~/store/cart';
import { useAuthStore } from '~/store/auth';
import { useNuxtApp, useRouter } from '#imports';

const fallbackImage = 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=900&q=80';

const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter();
const { $apiFetch } = useNuxtApp();

const { items } = storeToRefs(cartStore);

const subtotal = computed(() => cartStore.subtotal);
const shippingEstimate = computed(() => (items.value.length > 0 ? 12 : 0));
const total = computed(() => subtotal.value + shippingEstimate.value);
const isEmpty = computed(() => cartStore.isEmpty);

const shipping = reactive({
  street: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
});

const isSubmitting = ref(false);
const submissionStatus = ref<'success' | 'error' | ''>('');
const submissionMessage = ref('');

const statusStyles = computed(() =>
  submissionStatus.value === 'success'
    ? 'padding:12px 16px; border-radius:14px; background:#dcfce7; color:#166534; font-size:0.85rem;'
    : 'padding:12px 16px; border-radius:14px; background:#fee2e2; color:#b91c1c; font-size:0.85rem;'
);

const onQuantityChange = (productId: string, event: Event) => {
  const value = Number((event.target as HTMLSelectElement).value);
  if (Number.isNaN(value)) return;
  cartStore.updateQuantity(productId, value);
};

const removeItem = (productId: string) => {
  cartStore.removeItem(productId);
};

const handleCheckout = async () => {
  submissionMessage.value = '';
  submissionStatus.value = '';

  if (isEmpty.value) {
    return;
  }

  const missingField = Object.entries(shipping).find(([, value]) => !value.trim());
  if (missingField) {
    submissionStatus.value = 'error';
    submissionMessage.value = 'Please complete the shipping address before checking out.';
    return;
  }

  if (!authStore.isAuthenticated) {
    await router.push({ path: '/auth/login', query: { redirect: '/cart' } });
    return;
  }

  try {
    isSubmitting.value = true;

    await $apiFetch('/orders', {
      method: 'POST',
      body: {
        items: items.value.map((item) => ({
          product: item.productId,
          quantity: item.quantity,
        })),
        shippingAddress: { ...shipping },
      },
    });

    submissionStatus.value = 'success';
    submissionMessage.value = 'Order placed successfully. We will follow up with confirmation shortly.';
    cartStore.clear();
    Object.assign(shipping, {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    });
  } catch (error: any) {
    submissionStatus.value = 'error';

    const message =
      error?.data?.message ||
      (error instanceof Error ? error.message : 'Checkout failed. Please try again.');

    submissionMessage.value = message;

    if (error?.status === 401) {
      authStore.logout();
      await router.push({ path: '/auth/login', query: { redirect: '/cart' } });
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>
