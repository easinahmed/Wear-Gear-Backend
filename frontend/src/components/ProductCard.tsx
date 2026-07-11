import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { motion } from 'motion/react';
import { ShoppingBag, Eye } from 'lucide-react';
import QuickViewModal from './QuickViewModal';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="group bg-white flex flex-col items-center text-center pb-4 transition-all duration-300 hover:shadow-xl border border-gray-100"
      >
        <div className="relative w-full aspect-[3/4] overflow-hidden mb-4">
          <Link to={`/product/${product.id}`} className="block w-full h-full">
            <img 
              src={product.images[0]} 
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>

          {product.discountBadge && (
            <div className="absolute top-2 right-2 bg-red-600 text-white text-[9px] font-bold px-2 py-1 uppercase tracking-tighter">
              {product.discountBadge}
            </div>
          )}
        </div>

        <div className="px-3 space-y-1 w-full flex flex-col items-center">
          <h3 className="text-[11px] md:text-xs font-medium text-gray-800 uppercase tracking-tight line-clamp-1 h-4">
            <Link to={`/product/${product.id}`} className="hover:text-red-500 transition-colors">
              {product.name}
            </Link>
          </h3>
          <p className="text-sm font-bold text-black font-mono">৳ {product.price.toLocaleString()}</p>
          
          {/* Action Bar */}
          <div className="pt-3 w-full flex flex-col sm:flex-row gap-1 px-2">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsQuickViewOpen(true)}
              className="flex-1 bg-[#0f172a] text-white py-2.5 text-[9px] font-bold uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center cursor-pointer"
            >
              Shop Now
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => addToCart(product)}
              className="flex-1 bg-[#e2e8f0] text-[#0f172a] py-2.5 text-[9px] font-bold uppercase tracking-widest hover:bg-gray-300 transition-all flex items-center justify-center space-x-1 cursor-pointer"
            >
              <ShoppingBag size={12} />
              <span>Add to Cart</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      <QuickViewModal 
        product={product} 
        isOpen={isQuickViewOpen} 
        onClose={() => setIsQuickViewOpen(false)} 
      />
    </>
  );
};

export default ProductCard;
