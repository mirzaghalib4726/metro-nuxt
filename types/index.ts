export interface Address {
  id?: string;
  label?: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

export interface OrderItemSummary {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
  productId?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  totalAmount: number;
  subtotal?: number;
  shippingCost?: number;
  taxAmount?: number;
  items: OrderItemSummary[];
}

export interface NotificationSettings {
  orderUpdates?: boolean;
  promotions?: boolean;
  newsletter?: boolean;
  [key: string]: boolean | undefined;
}

export interface User {
  id?: string;
  name: string;
  email: string;
  createdAt: string;
  company?: string;
  role?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  membershipTier?: string;
  loyaltyPoints?: number;
  nextTierPoints?: number;
  avatarUrl?: string;
  notificationSettings?: NotificationSettings;
  preferredCategories?: string[];
  savedCards?: Array<{
    id: string;
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
    isDefault?: boolean;
  }>;
  loyaltyLevel?: string;
  totalSpend?: number;
  ordersPlaced?: number;
}

export type { Product } from './product';
export type { CartItem } from './cart';
