import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PRODUCTS, CATEGORIES } from '../data/mockData';
import ProductCard from '../components/ProductCard';
import { Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const activeCategory = searchParams.get('category') || 'all';

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return PRODUCTS;
    return PRODUCTS.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  const setCategory = (id: string) => {
    if (id === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', id);
    }
    setSearchParams(searchParams);
    setIsFilterOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-6 md:space-y-0">
        <div>
          <h1 className="section-title mb-2">Shop All</h1>
          <p className="text-gray-500 text-sm italic">Showing {filteredProducts.length} refined essentials</p>
        </div>

        {/* Desktop Filter Tabs */}
        <div className="hidden md:flex items-center space-x-6 border-b border-gray-100 pb-2">
          <button 
            onClick={() => setCategory('all')}
            className={`text-xs uppercase tracking-widest font-semibold pb-2 border-b-2 transition-all ${activeCategory === 'all' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'}`}
          >
            All
          </button>
          {CATEGORIES.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`text-xs uppercase tracking-widest font-semibold pb-2 border-b-2 transition-all ${activeCategory === cat.id ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'}`}
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        {filteredProducts.length === 0 && (
          <div className="col-span-full py-24 text-center">
            <p className="text-gray-400 font-display text-2xl">No products found in this category.</p>
          </div>
        )}
      </div>

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
                  onClick={() => setCategory('all')}
                  className={`block w-full text-left text-sm uppercase tracking-widest font-bold transition-colors ${activeCategory === 'all' ? 'text-black' : 'text-gray-400 hover:text-black'}`}
                >
                  All Items
                </button>
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`block w-full text-left text-sm uppercase tracking-widest font-bold transition-colors ${activeCategory === cat.id ? 'text-black' : 'text-gray-400 hover:text-black'}`}
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
