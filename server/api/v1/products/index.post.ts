import { defineEventHandler, createError, readBody } from 'h3';
import { z } from 'zod';
import Product from '../../../models/Product';
import Category from '../../../models/Category';
import { getAuthUser } from '../../../utils/auth';

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.number().positive(),
  stock: z.number().int().min(0).default(0),
  image: z.string().url().optional(),
  categoryId: z.string().min(1),
});

export default defineEventHandler(async (event) => {
  await getAuthUser(event, { requireAdmin: true });

  const body = await readBody(event);
  const payload = productSchema.parse(body);

  const category = await Category.findById(payload.categoryId);
  if (!category) {
    throw createError({ statusCode: 404, message: 'Category not found' });
  }

  const product = await Product.create({
    name: payload.name,
    description: payload.description,
    price: payload.price,
    stock: payload.stock,
    image: payload.image,
    category: category._id,
  });

  return {
    success: true,
    data: {
      id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: category.name,
      categoryId: category._id,
      image: product.image,
    },
  };
});
