import { defineEventHandler, createError } from 'h3';
import type { IUser } from '../models/User';

declare module 'h3' {
  interface H3EventContext {
    user?: IUser;
  }
}

export default defineEventHandler((event) => {
  // Skip for non-API routes
  if (!event.node.req.url?.startsWith('/api/')) {
    return;
  }

  // Skip for non-admin API routes
  if (!event.node.req.url?.startsWith('/api/admin')) {
    return;
  }

  // Get user from context (set by auth middleware)
  const user = event.context.user;

  // Check if user is admin
  if (!user || (user.role as any).name !== 'admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden - Admin access required',
    });
  }
});
