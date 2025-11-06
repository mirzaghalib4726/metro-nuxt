import { defineEventHandler, getRequestHeaders, createError } from 'h3';
import User from '../models/User';
import { verifyToken } from '../utils/auth';
import type { IUser } from '../models/User';

declare module 'h3' {
  interface H3EventContext {
    user?: IUser;
  }
}

export default defineEventHandler(async (event) => {
  const url = event.node.req.url || '';
  const pathname = new URL(url, 'http://localhost').pathname;
  const method = event.node.req.method || 'GET';

  // Skip auth for non-API routes
  if (!pathname.startsWith('/api/')) {
    return;
  }

  // Always allow auth endpoints and preflight/HEAD requests
  if (
    pathname.startsWith('/api/v1/auth') ||
    method === 'OPTIONS' ||
    method === 'HEAD'
  ) {
    return;
  }

  // Public read-only endpoints
  const isPublicGet =
    method === 'GET' &&
    (pathname === '/api/v1/products' ||
      pathname.startsWith('/api/v1/products/') ||
      pathname === '/api/v1/categories' ||
      pathname.startsWith('/api/v1/categories/'));

  if (isPublicGet) {
    return;
  }

  const authHeader = getRequestHeaders(event).authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized - No token provided',
    });
  }

  const tokenParts = authHeader.split(' ');
  if (tokenParts.length !== 2) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized - Invalid token format',
    });
  }

  const token = tokenParts[1];

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized - Token is empty',
    });
  }

  const decoded = verifyToken(token);
  
  if (!decoded) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid or expired token',
    });
  }

  // Attach user to the request context
  const user = await User.findById(decoded.userId as string)
    .select('-password')
    .populate('role');
  
  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found',
    });
  }

  event.context.user = user;
});
