'use client';

import { useOptimistic, useTransition } from 'react';
import { deleteProduct } from '@/features/products/actions/product.actions';
import type { Product } from '@prisma/client';

export function ProductList({ products }: { products: Product[] }) {
  // Next.js 15+ useOptimistic typing fix
  const [optimisticProducts, removeOptimistic] = useOptimistic<Product[], number>(
    products,
    (state, deletedId) => state.filter(p => p.id !== deletedId)
  );
  
  const [, startTransition] = useTransition();
  
  const handleDelete = (id: number) => {
    startTransition(async () => {
      removeOptimistic(id); // Instant UI update
      await deleteProduct(id); // Server catches up
    });
  };

  return (
    <ul className='space-y-2 mt-6'>
      {optimisticProducts.map(product => (
        <li key={product.id} className='flex justify-between items-center border rounded p-4 bg-white shadow-sm'>
          <span>
            <span className="font-semibold">{product.name}</span> 
            <span className="text-gray-500 ml-2">${product.price.toFixed(2)}</span>
          </span>
          <button onClick={() => handleDelete(product.id)}
            className='text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1 rounded transition-colors text-sm font-medium'>
            Delete
          </button>
        </li>
      ))}
      {optimisticProducts.length === 0 && (
          <p className="text-gray-500 text-sm italic">No products found.</p>
      )}
    </ul>
  );
}
