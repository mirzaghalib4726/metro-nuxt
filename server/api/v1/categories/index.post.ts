import { defineEventHandler, readBody, createError } from 'h3';
import Category from '../../../models/Category';
import { createCategorySchema } from '../../../utils/validation';
import { getAuthUser } from '../../../utils/auth';

export default defineEventHandler(async (event) => {
  try {
    await getAuthUser(event, { requireAdmin: true });

    const body = await readBody(event);
    const validatedData = createCategorySchema.parse(body);

    const category = await Category.create({
      name: validatedData.name,
      description: validatedData.description,
      parent: validatedData.parent ?? null,
    });

    if (validatedData.parent) {
      await category.addToTree(validatedData.parent);
    }

    return {
      success: true,
      message: 'Category created successfully',
      data: {
        id: category._id,
        name: category.name,
        description: category.description,
        parent: category.parent,
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

    if (error.code === 11000) {
      throw createError({
        statusCode: 400,
        message: 'Category with this name already exists',
      });
    }

    console.error('Create category error:', error);
    throw createError({
      statusCode: 500,
      message: 'Internal server error',
    });
  }
});
