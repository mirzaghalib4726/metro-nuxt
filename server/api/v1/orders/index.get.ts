import { defineEventHandler, getQuery, createError } from 'h3';
import type { FilterQuery } from 'mongoose';
import Order, { type IOrder } from '../../../models/Order';
import { getAuthUser } from '../../../utils/auth';
import { formatOrder } from '../../../utils/transformers';

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuthUser(event);

    const query = getQuery(event);
    
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const filter: FilterQuery<IOrder> = {};

    if (auth.role !== 'admin' || query.scope !== 'admin') {
      filter.user = auth.userId;
    }

    if (query.status && typeof query.status === 'string') {
      filter.status = query.status;
    }

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('items.product', 'name price image')
        .populate('user', 'name email')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Order.countDocuments(filter),
    ]);

    return {
      success: true,
      data: {
        orders: orders.map(formatOrder),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }

    console.error('Get orders error:', error);
    throw createError({
      statusCode: 500,
      message: 'Internal server error',
    });
  }
});
