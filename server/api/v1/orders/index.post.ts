import { defineEventHandler, readBody, createError } from 'h3';
import Order from '../../../models/Order';
import Product from '../../../models/Product';
import { createOrderSchema } from '../../../utils/validation';
import { getAuthUser } from '../../../utils/auth';
import { formatOrder } from '../../../utils/transformers';

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuthUser(event);

    const body = await readBody(event);
    const validatedData = createOrderSchema.parse(body);

    const orderItems: {
      product: string;
      quantity: number;
      price: number;
    }[] = [];

    for (const item of validatedData.items) {
      const product = await Product.findById(item.product);

      if (!product) {
        throw createError({
          statusCode: 404,
          message: `Product ${item.product} not found`,
        });
      }

      if (product.stock < item.quantity) {
        throw createError({
          statusCode: 400,
          message: `Insufficient stock for product ${product.name}`,
        });
      }

      orderItems.push({
        product: product._id.toString(),
        quantity: item.quantity,
        price: product.price,
      });

      product.stock -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      user: auth.userId,
      items: orderItems,
      shippingAddress: validatedData.shippingAddress,
    });

    await order.populate([
      { path: 'items.product', select: 'name price image' },
      { path: 'user', select: 'name email' },
    ]);

    return {
      success: true,
      message: 'Order created successfully',
      data: formatOrder(order),
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

    console.error('Create order error:', error);
    throw createError({
      statusCode: 500,
      message: 'Internal server error',
    });
  }
});
