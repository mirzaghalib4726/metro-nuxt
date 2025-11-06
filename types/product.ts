export interface Product {
  id?: string;
  _id?: string;
  name: string;
  description: string;
  price: number;
  category?: string;
  categoryId?: string;
  stock: number;
  image?: string;
  images?: string[];
  sku?: string;
  rating?: number;
  reviewCount?: number;
  highlights?: string[];
  details?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
