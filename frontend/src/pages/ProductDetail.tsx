import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { Heart, ShoppingBag, Truck, ShieldCheck, RefreshCw, Minus, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const product = useMemo(() => PRODUCTS.find(p => p.id === id), [id]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  }, [product]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-display mb-4">Product Not Found</h1>
        <button onClick={() => navigate('/shop')} className="btn-primary">Return to Shop</button>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Images */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-100 aspect-[3/4] overflow-hidden"
            >
              <img 
                src={product.images[0]} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-12"
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="w-8 h-[1px] bg-black" />
                  <p className="uppercase tracking-[0.4em] text-[10px] font-bold text-gray-400">{product.category}</p>
                </div>
                <h1 className="font-display text-5xl md:text-7xl text-gray-900 leading-tight italic tracking-tighter">{product.name}</h1>
                <div className="flex items-end space-x-4">
                  <p className="text-3xl font-display">৳ {product.price}</p>
                  {product.originalPrice && (
                    <p className="text-xl text-gray-300 line-through font-light mb-1">৳ {product.originalPrice}</p>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-gray-500 leading-relaxed max-w-xl text-sm md:text-base italic">
                  "{product.description}"
                </p>

                <div className="grid grid-cols-2 gap-8 py-8 border-y border-gray-100">
                  <div className="space-y-3">
                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-black group-hover:text-gray-600 transition-colors">Specifications</h4>
                    <ul className="space-y-1 text-xs text-gray-400 font-medium">
                      {product.features.map((f, i) => <li key={i} className="flex items-center space-x-2">
                        <span className="w-1 h-1 bg-red-500 rounded-full" />
                        <span>{f}</span>
                      </li>)}
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-black">Availability</h4>
                    <p className="text-xs text-gray-400 font-medium">{product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}</p>
                  </div>
                </div>
              </div>

              {/* Interaction */}
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                  <div className="flex items-center border border-black/10 px-2">
                    <button 
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="p-4 hover:text-red-500 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-12 text-center text-sm font-bold font-mono">{quantity.toString().padStart(2, '0')}</span>
                    <button 
                      onClick={() => setQuantity(q => q + 1)}
                      className="p-4 hover:text-green-500 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      for(let i=0; i<quantity; i++) addToCart(product);
                      navigate('/checkout');
                    }}
                    className="flex-grow btn-primary flex items-center justify-center space-x-4 group cursor-pointer"
                  >
                    <ShoppingBag size={16} className="group-hover:scale-110 transition-transform" />
                    <span>Purchase Piece</span>
                  </motion.button>
                </div>
              </div>

              {/* Extra Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-gray-100">
                <div className="flex items-center space-x-3 text-xs uppercase tracking-widest font-bold text-gray-500">
                  <Truck size={18} className="text-black" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center space-x-3 text-xs uppercase tracking-widest font-bold text-gray-500">
                  <RefreshCw size={18} className="text-black" />
                  <span>30-Day Returns</span>
                </div>
                <div className="flex items-center space-x-3 text-xs uppercase tracking-widest font-bold text-gray-500">
                  <ShieldCheck size={18} className="text-black" />
                  <span>Secure Payment</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
          <h2 className="section-title italic text-2xl !mb-12">You may also like</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
