import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import { Product } from '../data/mockData';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/Skeleton';
import { Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ApiCategory {
  _id: string;
  name: string;
  image?: string;
  description?: string;
}

interface PaginatedResponse {
  products: Product[];
  total: number;
  page: number;
  pages: number;
}

const PAGE_SIZE = 12;

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedSearch, setSelectedSearch] = useState(searchParams.get('search') || '');

  const buildQuery = () => {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(PAGE_SIZE));
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (selectedSearch) params.set('search', selectedSearch);
    return params.toString();
  };

  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    const urlCategory = searchParams.get('category') || 'all';
    setSelectedSearch(urlSearch);
    setSelectedCategory(urlCategory);
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get<PaginatedResponse>(`/products?${buildQuery()}`),
      api.get<ApiCategory[]>('/categories'),
    ])
      .then(([productsRes, categoriesData]) => {
        setProducts(productsRes.products.map((p: Product) => ({ ...p, id: p._id || p.id })));
        setTotalPages(productsRes.pages);
        setCategories(categoriesData);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedCategory, selectedSearch, page]);

  const handleCategoryChange = (catId: string) => {
    const params = new URLSearchParams(searchParams);
    if (catId === 'all') {
      params.delete('category');
    } else {
      params.set('category', catId);
    }
    setSearchParams(params);
    setSelectedCategory(catId);
    setPage(1);
    setIsFilterOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-6 md:space-y-0">
        <div>
          <h1 className="section-title mb-2">Shop All</h1>
          <p className="text-gray-500 text-sm italic">
            {loading ? 'Loading...' : `Page ${page} of ${totalPages} — ${products.length} products`}
          </p>
        </div>

        {/* Desktop Filter Tabs */}
        <div className="hidden md:flex items-center space-x-6 border-b border-gray-100 pb-2">
          <button 
            onClick={() => handleCategoryChange('all')}
            className={`text-xs uppercase tracking-widest font-semibold pb-2 border-b-2 transition-all ${selectedCategory === 'all' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'}`}
          >
            All
          </button>
          {categories.map(cat => (
            <button 
              key={cat._id}
              onClick={() => handleCategoryChange(cat.name.toLowerCase())}
              className={`text-xs uppercase tracking-widest font-semibold pb-2 border-b-2 transition-all ${selectedCategory === cat.name.toLowerCase() ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Mobile Filter Toggle */}
        <button 
          onClick={() => setIsFilterOpen(true)}
          className="md:hidden flex items-center space-x-2 text-xs uppercase tracking-widest font-bold"
        >
          <Filter size={16} />
          <span>Filters</span>
        </button>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
            {products.length === 0 && (
              <div className="col-span-full py-24 text-center">
                <p className="text-gray-400 font-display text-2xl">
                  {selectedSearch ? `No results for "${selectedSearch}".` : 'No products found in this category.'}
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-16">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="flex items-center gap-1 px-4 py-2 border border-gray-200 text-xs uppercase tracking-wider font-bold hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={14} />
                Previous
              </button>
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-9 h-9 text-xs font-bold border transition-colors ${
                      page === i + 1
                        ? 'bg-black text-white border-black'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="flex items-center gap-1 px-4 py-2 border border-gray-200 text-xs uppercase tracking-wider font-bold hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </>
      )}

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/40 z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-white z-[70] p-8 space-y-12 shadow-2xl"
            >
              <div className="flex justify-between items-center">
                <h2 className="font-display text-2xl">Categories</h2>
                <button onClick={() => setIsFilterOpen(false)} className="text-gray-400 hover:text-black">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <button 
                  onClick={() => handleCategoryChange('all')}
                  className={`block w-full text-left text-sm uppercase tracking-widest font-bold transition-colors ${selectedCategory === 'all' ? 'text-black' : 'text-gray-400 hover:text-black'}`}
                >
                  All Items
                </button>
                {categories.map(cat => (
                  <button 
                    key={cat._id}
                    onClick={() => handleCategoryChange(cat.name.toLowerCase())}
                    className={`block w-full text-left text-sm uppercase tracking-widest font-bold transition-colors ${selectedCategory === cat.name.toLowerCase() ? 'text-black' : 'text-gray-400 hover:text-black'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}