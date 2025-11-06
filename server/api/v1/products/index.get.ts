import { defineEventHandler, getQuery } from 'h3';
import type { FilterQuery } from 'mongoose';
import Product, { type IProduct } from '../../../models/Product';
import Category from '../../../models/Category';

const SORT_MAP: Record<string, Record<string, 1 | -1>> = {
  'price-asc': { price: 1 },
  'price-desc': { price: -1 },
  'newest': { createdAt: -1 },
  'featured': { createdAt: -1 },
};

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const page = Math.max(parseInt((query.page as string) || '1', 10), 1);
  const limit = Math.min(
    Math.max(parseInt((query.limit as string) || '24', 10), 1),
    100
  );
  const skip = (page - 1) * limit;

  const filters: FilterQuery<IProduct> = {};

  if (query.search && typeof query.search === 'string') {
    const searchRegex = new RegExp(query.search.trim(), 'i');
    filters.$or = [{ name: searchRegex }, { description: searchRegex }];
  }

  if (query.minPrice || query.maxPrice) {
    filters.price = {} as any;
    const priceFilter = filters.price as Record<string, number>;
    if (query.minPrice) {
      priceFilter.$gte = Number(query.minPrice);
    }
    if (query.maxPrice) {
      priceFilter.$lte = Number(query.maxPrice);
    }
  }

  if (query.categoryId && typeof query.categoryId === 'string') {
    filters.category = query.categoryId;
  } else if (query.category && typeof query.category === 'string') {
    const categoryDoc = await Category.findOne({
      name: new RegExp(`^${query.category}$`, 'i'),
    }).select('_id');

    if (categoryDoc) {
      filters.category = categoryDoc._id;
    }
  }

  const sortKey = typeof query.sort === 'string' ? query.sort : 'featured';
  const sort = SORT_MAP[sortKey] ?? SORT_MAP.featured;

  const [products, total] = await Promise.all([
    Product.find(filters)
      .populate('category', 'name description')
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Product.countDocuments(filters),
  ]);

  return {
    success: true,
    data: products.map((product) => {
      const category = product.category as any;
      return {
        id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        image: product.image,
        category: category?.name ?? null,
        categoryId: category?._id ?? product.category,
        createdAt: product.metadata?.createdAt ?? product.createdAt,
        updatedAt: product.metadata?.updatedAt ?? product.updatedAt,
      };
    }),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
});
