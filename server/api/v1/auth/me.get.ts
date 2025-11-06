import { defineEventHandler, createError } from 'h3';
import Role from '../../../models/Role';

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  if (!user) {
    throw createError({ statusCode: 401, message: 'Authentication required' });
  }

  const roleDoc = await Role.findById(user.role);

  return {
    success: true,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      company: user.company,
      role: roleDoc?.name ?? 'customer',
      createdAt: user.createdAt,
    },
  };
});
