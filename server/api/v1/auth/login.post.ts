import { defineEventHandler, createError, readBody } from 'h3';
import { z } from 'zod';
import { comparePassword, generateToken } from '../../../utils/auth';
import User from '../../../models/User';
import Role from '../../../models/Role';

const loginSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(1, 'Password is required'),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password } = loginSchema.parse(body);

  const user = await User.findOne({ email }).select('+password').populate('role');

  if (!user) {
    throw createError({ statusCode: 401, message: 'Invalid email or password' });
  }

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    throw createError({ statusCode: 401, message: 'Invalid email or password' });
  }

  user.metadata.loginCount = (user.metadata.loginCount || 0) + 1;
  user.metadata.lastLogin = new Date();
  await user.save();

  const token = generateToken({ userId: user._id });
  const roleName = (user.role as any)?.name ?? 'customer';

  const payloadUser = {
    id: user._id,
    email: user.email,
    name: user.name,
    company: user.company,
    role: roleName,
    createdAt: user.createdAt,
  };

  return {
    success: true,
    token,
    user: payloadUser,
  };
});
