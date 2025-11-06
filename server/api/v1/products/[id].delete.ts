import { defineEventHandler, createError, getRouterParam } from 'h3';
import Product from '../../../models/Product';
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

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      throw createError({
        statusCode: 404,
        message: 'Product not found',
      });
    }

    return {
      success: true,
      message: 'Product deleted successfully',
    };
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }

    if (error.name === 'CastError') {
      throw createError({
        statusCode: 400,
        message: 'Invalid product ID',
      });
    }

    console.error('Delete product error:', error);
    throw createError({
      statusCode: 500,
      message: 'Internal server error',
    });
  }
});
