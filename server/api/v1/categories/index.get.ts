import { defineEventHandler } from 'h3';
import Category from '../../../models/Category';

export default defineEventHandler(async () => {
  const categories = await Category.find().sort({ name: 1 });
  return {
    success: true,
    data: categories.map((category) => ({
      id: category._id,
      name: category.name,
      description: category.description,
      parent: category.parent,
    })),
  };
});
