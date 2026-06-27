import type { ApiResponse } from './api';

// Type guard: narrows ApiResponse<T> to the success branch
export function isSuccess<T>(response: ApiResponse<T>): response is { success: true; data: T } {
  return response.success === true;
}

// Type guard for OrderStatus
const validStatuses = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const;

export function isOrderStatus(value: string): value is typeof validStatuses[number] {
  return (validStatuses as readonly string[]).includes(value);
}
