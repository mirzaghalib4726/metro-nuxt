import { defineEventHandler, readBody, createError, getRouterParam } from 'h3';
import Product from '../../../models/Product';
import { updateProductSchema } from '../../../utils/validation';
import { getAuthUser } from '../../../utils/auth';

export default defineEventHandler(async (event) => {
  try {
    await getAuthUser(event, { requireAdmin: true });

    const id = getRouterParam(event, 'id');
    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Product ID is required',
      });
    }

    // Parse and validate request body
    const body = await readBody(event);
    const validatedData = updateProductSchema.parse(body);

    // Update product
    const product = await Product.findByIdAndUpdate(
      id,
      {
        ...validatedData,
        'metadata.updatedAt': new Date(),
      },
      { new: true, runValidators: true }
    ).populate('category', 'name');

    if (!product) {
      throw createError({
        statusCode: 404,
        message: 'Product not found',
      });
    }

    const category = (product as any).category;

    return {
      success: true,
      message: 'Product updated successfully',
      data: {
        id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        image: product.image,
        category: category?.name ?? null,
        categoryId: category?._id ?? product.category,
        updatedAt: product.metadata?.updatedAt ?? product.updatedAt,
      },
    };
  } catch (error: any) {
    if (error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        message: 'Validation failed',
        data: error.errors,
      });
    }

    if (error.statusCode) {
      throw error;
    }

    if (error.name === 'CastError') {
      throw createError({
        statusCode: 400,
        message: 'Invalid product ID',
      });
    }

    console.error('Update product error:', error);
    throw createError({
      statusCode: 500,
      message: 'Internal server error',
    });
  }
});
