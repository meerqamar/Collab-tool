'use client';
import Link from 'next/link';
import { useState } from 'react';
import type { Product } from '@prisma/client';

export function ProductGrid({ products }: { products: Product[] }) {
  const [cartCount, setCartCount] = useState(0);

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <span className="font-bold text-lg bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
          Cart Items: {cartCount}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map(p => (
          <div key={p.id} className="block border border-gray-200 rounded-lg p-6 hover:shadow-xl transition duration-300 bg-white">
            <h3 className="font-bold text-xl mb-2 text-gray-800">{p.name}</h3>
            <p className="text-gray-600 mb-4 font-semibold">${p.price.toFixed(2)}</p>
            <div className="flex gap-2">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  setCartCount(prev => prev + 1);
                }}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Add to Cart
              </button>
              <Link 
                href={`/products/${p.id}`} 
                className="flex-1 text-center bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200 transition"
              >
                Quick View
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
