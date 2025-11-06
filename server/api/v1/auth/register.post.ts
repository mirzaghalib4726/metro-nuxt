import { defineEventHandler, createError, readBody } from 'h3';
import { z } from 'zod';
import { hashPassword, generateToken } from '../../../utils/auth';
import User from '../../../models/User';
import Role from '../../../models/Role';

const registerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  company: z.string().optional(),
  email: z.string().email('Valid email required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { name, company, email, password } = registerSchema.parse(body);

  const existing = await User.findOne({ email });
  if (existing) {
    throw createError({
      statusCode: 409,
      message: 'An account already exists with this email address',
    });
  }

  let role = await Role.findOne({ name: 'customer' });
  if (!role) {
    role = await Role.create({
      name: 'customer',
      permissions: [
        { resource: 'product', actions: ['read'] },
        { resource: 'category', actions: ['read'] },
        { resource: 'order', actions: ['create', 'read'] },
      ],
    });
  }

  const hashed = await hashPassword(password);

  const user = await User.create({
    email,
    name,
    company,
    password: hashed,
    role: role._id,
    metadata: { loginCount: 0 },
  });

  const token = generateToken({ userId: user._id });

  const payloadUser = {
    id: user._id,
    email: user.email,
    name: user.name,
    company: user.company,
    role: role.name,
    createdAt: user.createdAt,
  };

  return {
    success: true,
    token,
    user: payloadUser,
  };
});
