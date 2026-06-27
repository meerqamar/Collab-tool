'use client';
import Link from 'next/link';
import { useState } from 'react';
import type { Product } from '@prisma/client';

export function ProductGrid({ products }: { products: Product[] }) {
  const [cartCount, setCartCount] = useState(0);

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <span className="font-bold text-base bg-indigo-950/80 border border-indigo-800 text-indigo-300 px-4 py-2 rounded-full shadow-lg">
          🛒 Cart Items: {cartCount}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map(p => (
          <div key={p.id} className="flex flex-col justify-between border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 bg-slate-900/80 backdrop-blur-sm">
            <div>
              <h3 className="font-bold text-xl mb-2 text-slate-100 line-clamp-1">{p.name}</h3>
              <p className="text-indigo-400 mb-6 font-extrabold text-2xl">${p.price.toFixed(2)}</p>
            </div>
            <div className="flex gap-3 pt-4 border-t border-slate-800/80">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  setCartCount(prev => prev + 1);
                }}
                className="flex-1 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition cursor-pointer text-sm"
              >
                Add to Cart
              </button>
              <Link 
                href={`/products/${p.id}`} 
                className="flex-1 text-center bg-slate-800 text-slate-300 px-4 py-2.5 rounded-xl font-medium hover:bg-slate-700 hover:text-white transition text-sm flex items-center justify-center"
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
