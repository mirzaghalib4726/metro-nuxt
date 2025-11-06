import type { HydratedDocument } from 'mongoose';
import type { IOrder } from '../models/Order';

export function formatOrder(order: HydratedDocument<IOrder> | (IOrder & { user?: any })) {
  const user = (order as any).user;
  const formattedUser = user
    ? {
        id: user._id?.toString?.() ?? user.id,
        name: user.name,
        email: user.email,
      }
    : undefined;

  return {
    id: order._id,
    orderNumber: `ORD-${order.createdAt.getTime().toString().slice(-6)}`,
    status: order.status,
    totalAmount: order.totalAmount,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    user: formattedUser,
    items: order.items.map((item: any) => ({
      id: item._id,
      productId: item.product?._id ?? item.product,
      name: item.product?.name ?? undefined,
      price: item.price,
      quantity: item.quantity,
      image: item.product?.image,
    })),
    shippingAddress: order.shippingAddress,
  };
}
