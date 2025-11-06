import { defineEventHandler } from 'h3';
import Product from '../../../models/Product';
import Category from '../../../models/Category';
import Order from '../../../models/Order';
import User from '../../../models/User';
import { getAuthUser } from '../../../utils/auth';

export default defineEventHandler(async (event) => {
  await getAuthUser(event, { requireAdmin: true });

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [products, orders, categories, users, revenueResult, pendingOrders] = await Promise.all([
    Product.countDocuments({}),
    Order.countDocuments({}),
    Category.countDocuments({}),
    User.countDocuments({}),
    Order.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
          status: { $nin: ['cancelled'] },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' },
        },
      },
    ]),
    Order.countDocuments({ status: 'pending' }),
  ]);

  const revenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

  return {
    success: true,
    data: {
      products,
      orders,
      categories,
      users,
      revenueLast30Days: revenue,
      pendingOrders,
    },
  };
});
