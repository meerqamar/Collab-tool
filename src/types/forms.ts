import type { Product, User } from './index';

// CreateProductInput: all Product fields except auto-generated ones
export type CreateProductInput = Omit<Product, 'id' | 'createdAt' | 'category'> & {
  categoryId: number;
};

// UpdateProductInput: every field optional except id
export type UpdateProductInput = Partial<Omit<Product, 'id'>> & { id: number };

// PublicUser: User without sensitive fields
export type PublicUser = Omit<User, 'email'>;

// ProductSummary: only the fields needed for a product card
export type ProductSummary = Pick<Product, 'id' | 'name' | 'price'> & {
  categoryName: string;
};

// ProductLookup: a dictionary of products by ID
export type ProductLookup = Record<number, Product>;
