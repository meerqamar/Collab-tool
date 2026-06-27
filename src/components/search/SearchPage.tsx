'use client';

import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Loader2, Sparkles } from 'lucide-react';

interface Gig {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  rating: number;
  tags?: string;
}

export function SearchPage() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [results, setResults] = useState<Gig[]>([]);
  const [facets, setFacets] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [durationMs, setDurationMs] = useState(0);

  // 500ms Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch search results
  useEffect(() => {
    async function performSearch() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (debouncedQuery) params.set('q', debouncedQuery);
        if (category !== 'all') params.set('category', category);
        params.set('maxPrice', maxPrice.toString());

        const res = await fetch(`/api/search?${params.toString()}`);
        const data = await res.json();
        setResults(data.results || []);
        setFacets(data.facets || {});
        setDurationMs(data.durationMs || 0);
      } catch (err) {
        console.error('Search request failed:', err);
      } finally {
        setLoading(false);
      }
    }

    performSearch();
  }, [debouncedQuery, category, maxPrice]);

  // Helper to highlight matching query text
  const renderHighlighted = (text: string) => {
    if (!debouncedQuery || debouncedQuery.length < 2) return text;
    const parts = text.split(new RegExp(`(${debouncedQuery})`, 'gi'));
    return parts.map((part, idx) =>
      part.toLowerCase() === debouncedQuery.toLowerCase() ? (
        <mark key={idx} className="bg-amber-200 dark:bg-amber-800 text-slate-900 dark:text-slate-100 font-medium px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-slate-800 dark:text-slate-100">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Facet Sidebar */}
        <div className="w-full md:w-64 space-y-6 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 h-fit">
          <div className="flex items-center gap-2 font-semibold text-lg pb-3 border-b border-slate-100 dark:border-slate-800">
            <SlidersHorizontal className="w-5 h-5 text-indigo-500" />
            <span>Filters</span>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Category</label>
            <div className="space-y-2">
              {['all', 'design', 'development', 'writing', 'marketing'].map((cat) => (
                <label key={cat} className="flex items-center justify-between cursor-pointer text-sm capitalize">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="category"
                      checked={category === cat}
                      onChange={() => setCategory(cat)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>{cat}</span>
                  </div>
                  <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-slate-500">
                    {facets[cat] || 0}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Max Price Slider */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-slate-600 dark:text-slate-400">Max Price</span>
              <span className="font-semibold text-indigo-600">${maxPrice}</span>
            </div>
            <input
              type="range"
              min="10"
              max="2000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>
        </div>

        {/* Main Search Area */}
        <div className="flex-1 space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search marketplace services (e.g. react developer, ui design)..."
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
            />
            {loading && <Loader2 className="absolute right-4 top-3.5 w-5 h-5 text-indigo-500 animate-spin" />}
          </div>

          {/* Timing stats */}
          <div className="flex justify-between text-xs text-slate-500 px-1">
            <span>Found {results.length} results</span>
            <span>Search speed: <strong className="text-emerald-600 dark:text-emerald-400">{durationMs}ms</strong></span>
          </div>

          {/* Results Grid or Skeleton Loading */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-slate-100 dark:bg-slate-800/50 p-6 rounded-xl animate-pulse space-y-3 h-40">
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((gig) => (
                <div
                  key={gig.id}
                  className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">{gig.category}</span>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 line-clamp-1">
                      {renderHighlighted(gig.title)}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                      {renderHighlighted(gig.description)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-sm font-medium">★ {gig.rating.toFixed(1)}</span>
                    <span className="text-lg font-bold text-slate-900 dark:text-slate-100">${gig.price}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center space-y-4">
              <Sparkles className="w-12 h-12 text-amber-400 mx-auto" />
              <h3 className="font-bold text-xl">No results found for &ldquo;{debouncedQuery}&rdquo;</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Check your spelling or try searching for broader terms like <button onClick={() => setQuery('react')} className="text-indigo-600 underline font-medium">react</button> or <button onClick={() => setQuery('design')} className="text-indigo-600 underline font-medium">design</button>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
