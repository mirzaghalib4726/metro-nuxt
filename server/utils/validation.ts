import { z } from 'zod';

// Password validation helpers
const hasLowercase = (str: string) => /[a-z]/.test(str);
const hasUppercase = (str: string) => /[A-Z]/.test(str);
const hasNumber = (str: string) => /\d/.test(str);
const hasSpecialChar = (str: string) => /[@$!%*?&#]/.test(str);

// Reusable password schema
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .refine(hasLowercase, 'Password must contain at least one lowercase letter')
  .refine(hasUppercase, 'Password must contain at least one uppercase letter')
  .refine(hasNumber, 'Password must contain at least one number')
  .refine(
    hasSpecialChar,
    'Password must contain at least one special character (@, $, !, %, *, ?, &, #)'
  );

// Auth schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: passwordSchema,
  role: z.enum(['customer', 'seller']).default('customer'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Product schemas
export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  stock: z.number().int().min(0, 'Stock cannot be negative').default(0),
});

export const updateProductSchema = createProductSchema.partial();

// Category schemas
export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional(),
  parent: z.string().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

// Order schemas
export const createOrderSchema = z.object({
  items: z.array(
    z.object({
      product: z.string(),
      quantity: z.number().int().positive(),
    })
  ).min(1, 'Order must have at least one item'),
  shippingAddress: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    zipCode: z.string().min(1),
    country: z.string().min(1),
  }),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
});
