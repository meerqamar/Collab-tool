export type { Product, Category, Order, OrderItem, User } from '@prisma/client';

export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
