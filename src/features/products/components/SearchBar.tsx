'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useOptimistic, useTransition } from 'react';

export function SearchBar({ initialQuery = '' }: { initialQuery?: string }) {
 const router = useRouter();
 const pathname = usePathname();
 const searchParams = useSearchParams();
 const [, startTransition] = useTransition();

 const [optimisticQuery, setOptimisticQuery] = useOptimistic(initialQuery);

 const handleSearch = (q: string) => {
   startTransition(() => {
     setOptimisticQuery(q); // Instant UI update
     const params = new URLSearchParams(searchParams.toString());
     if (q) {
         params.set('q', q);
     } else {
         params.delete('q');
     }
     router.push(`${pathname}?${params.toString()}`);
   });
 };

 return (
    <input
      type="text"
      placeholder="Search products..."
      value={optimisticQuery}
      onChange={(e) => handleSearch(e.target.value)}
      className="w-full bg-slate-900/90 text-slate-100 placeholder-slate-400 border border-slate-800 rounded-xl p-4 mb-6 shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-base font-medium"
    />
 );
}
