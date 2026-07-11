import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight, Star, Facebook, Twitter, Instagram } from 'lucide-react';
import { Product } from '../data/mockData';
import { useCart } from '../context/CartContext';

interface QuickViewModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const sizes = ['M', 'L', 'XL', 'XXL'];

  const handleNext = () => setActiveImage((prev) => (prev + 1) % product.images.length);
  const handlePrev = () => setActiveImage((prev) => (prev - 1 + product.images.length) % product.images.length);

  const handleShopNow = () => {
    addToCart(product);
    onClose();
    navigate('/checkout');
  };

  const handleAddToCart = () => {
    addToCart(product);
    onClose();
    navigate('/cart');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white w-full max-w-5xl rounded-sm shadow-2xl overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-auto max-h-[850px]"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-50 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>

            {/* Left Column: Image Gallery */}
            <div className="md:w-1/2 flex h-full min-h-[400px]">
              {/* Thumbnails */}
              <div className="hidden md:flex flex-col space-y-2 p-4 bg-gray-50 overflow-y-auto">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-16 h-20 border-2 transition-all ${activeImage === idx ? 'border-black' : 'border-transparent opacity-60'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Main Image */}
              <div className="relative flex-1 bg-gray-100 group">
                <img
                  src={product.images[activeImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            {/* Right Column: Product Info */}
            <div className="md:w-1/2 p-8 md:p-12 overflow-y-auto">
              <div className="flex items-center space-x-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className={i < 4 ? "fill-orange-400 text-orange-400" : "text-gray-300"} />
                ))}
                <span className="text-[10px] text-gray-400 ml-2">(0 customer reviews)</span>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{product.name}</h2>
              <p className="text-2xl font-black text-black mb-6">৳ {product.price.toLocaleString()}</p>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-3">Select Color:</h4>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 border border-black text-[11px] font-bold uppercase tracking-widest">
                      {product.category === 'panjabi' ? 'Chocolate Brown' : 'Standard'}
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Select Size:</h4>
                    <button className="text-[10px] font-bold text-red-600 underline tracking-widest uppercase">View Size Chart</button>
                  </div>
                  <div className="flex space-x-3">
                    {sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-10 border text-[11px] font-bold transition-all ${selectedSize === size ? 'bg-black text-white border-black' : 'border-gray-200 hover:border-black'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleShopNow}
                    className="flex-1 bg-[#0f172a] text-white py-4 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-black transition-colors rounded-sm"
                  >
                    Shop Now
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    className="flex-[1.5] bg-[#e2e8f0] text-[#0f172a] py-4 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-gray-300 transition-colors rounded-sm"
                  >
                    Add To Cart
                  </motion.button>
                </div>

                <div className="pt-8 border-t space-y-2 text-[10px] text-gray-500 font-medium uppercase tracking-widest">
                  <p>SKU: PJ{product.id.padStart(5, '0')}</p>
                  <p>Category: {product.category}</p>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button className="w-8 h-8 rounded-full bg-[#1877f2] text-white flex items-center justify-center hover:opacity-80 transition-opacity">
                    <Facebook size={14} fill="white" />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-[#1da1f2] text-white flex items-center justify-center hover:opacity-80 transition-opacity">
                    <Twitter size={14} fill="white" />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white flex items-center justify-center hover:opacity-80 transition-opacity">
                    <Instagram size={14} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
