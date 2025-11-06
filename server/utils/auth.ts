import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createError, getHeader, type H3Event } from 'h3';
import { useRuntimeConfig } from '#imports';
import User from '../models/User';

const SALT_ROUNDS = 10;

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare a plain password with a hashed password
 */
export async function comparePassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

/**
 * Generate a JWT token
 */
export function generateToken(payload: any): string {
  const config = useRuntimeConfig();
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
}

/**
 * Verify a JWT token
 */
export function verifyToken(token: string): any {
  const config = useRuntimeConfig();
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (error) {
    return null;
  }
}

/**
 * Extract token from Authorization header
 */
export function extractToken(event: H3Event): string | null {
  const authHeader = getHeader(event, 'authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * Get authenticated user from request
 */
export async function getAuthUser(
  event: H3Event,
  options: { requireAdmin?: boolean } = {}
) {
  const token = extractToken(event);
  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Authentication required',
    });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    throw createError({
      statusCode: 401,
      message: 'Invalid or expired token',
    });
  }

  const user = await User.findById(decoded.userId as string)
    .select('-password')
    .populate('role');

  if (!user) {
    throw createError({
      statusCode: 404,
      message: 'User not found',
    });
  }

  const roleName = (user.role as any)?.name ?? 'customer';

  if (options.requireAdmin && roleName !== 'admin') {
    throw createError({
      statusCode: 403,
      message: 'Admin privileges required',
    });
  }

  return {
    token,
    userId: user._id.toString(),
    role: roleName,
    user,
  };
}
