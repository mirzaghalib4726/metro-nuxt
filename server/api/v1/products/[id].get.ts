import { defineEventHandler, createError } from 'h3';
import Product from '../../../models/Product';
import Category from '../../../models/Category';

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  if (!id) {
    throw createError({ statusCode: 400, message: 'Product id is required' });
  }

  const product = await Product.findById(id).populate('category', 'name description');

  if (!product) {
    throw createError({ statusCode: 404, message: 'Product not found' });
  }

  return {
    success: true,
    data: {
      id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      image: product.image,
      category: (product.category as any)?.name,
      categoryId: (product.category as any)?._id ?? product.category,
      details: product.metadata,
      createdAt: product.metadata?.createdAt ?? product.createdAt,
      updatedAt: product.metadata?.updatedAt ?? product.updatedAt,
    },
  };
});
