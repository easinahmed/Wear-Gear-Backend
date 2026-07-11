import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { Product } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { Heart, ShoppingBag, Truck, ShieldCheck, RefreshCw, Minus, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/Skeleton';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    setLoading(true);
    api.get<Product>(`/products/${id}`)
      .then(p => {
        const mapped = { ...p, id: p._id || p.id };
        setProduct(mapped);
        return api.get<{ products: Product[] }>(`/products?limit=50&category=${mapped.category}`);
      })
      .then(res => {
        setRelatedProducts(
          res.products
            .filter(p => p._id !== id && p.id !== id)
            .slice(0, 4)
            .map(p => ({ ...p, id: p._id || p.id }))
        );
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-24">
          <div className="space-y-4">
            <div className="w-full h-[400px] md:h-[600px] bg-gray-200 animate-pulse" />
            <div className="flex space-x-4">
              {[1, 2, 3].map(i => <div key={i} className="w-20 h-24 bg-gray-200 animate-pulse" />)}
            </div>
          </div>
          <div className="space-y-8">
            <div className="h-8 bg-gray-200 animate-pulse w-3/4" />
            <div className="h-6 bg-gray-200 animate-pulse w-1/3" />
            <div className="space-y-2">
              {[1, 2, 3].map(i => <div key={i} className="h-4 bg-gray-200 animate-pulse w-full" />)}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <ProductCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-display mb-4">Product Not Found</h1>
        <button onClick={() => navigate('/shop')} className="btn-primary">Return to Shop</button>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Breadcrumb */}
      <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-8">
        <button onClick={() => navigate('/shop')} className="hover:text-black transition-colors">Shop</button>
        <span className="mx-2">/</span>
        <span className="text-gray-600">{product.category}</span>
        <span className="mx-2">/</span>
        <span className="text-black">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-24">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative bg-gray-50 image-zoom-container">
            <img 
              src={product.images[0]} 
              alt={product.name}
              className="w-full h-[400px] md:h-[600px] object-cover image-zoom"
            />
            {product.discountBadge && (
              <div className="absolute top-4 right-4 bg-red-600 text-white text-[10px] font-bold px-3 py-1.5 uppercase tracking-wider">
                {product.discountBadge}
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex space-x-4">
              {product.images.slice(1, 4).map((img, idx) => (
                <div key={idx} className="w-20 h-24 bg-gray-50 border border-gray-100 cursor-pointer hover:border-black transition-colors">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          <div>
            <h1 className="font-display text-4xl md:text-5xl mb-4">{product.name}</h1>
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold">৳ {product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="text-lg text-gray-400 line-through">৳ {product.originalPrice.toLocaleString()}</span>
              )}
            </div>
          </div>

          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          {product.features.length > 0 && (
            <ul className="space-y-3">
              {product.features.map((f, i) => (
                <li key={i} className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="w-1 h-1 bg-black rounded-full" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Quantity + Add to Cart */}
          <div className="flex items-center space-x-6 pt-4">
            <div className="flex items-center border border-gray-200">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="px-6 py-3 font-medium text-sm border-x border-gray-100">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className="flex-1 btn-primary flex items-center justify-center space-x-3 py-4"
            >
              <ShoppingBag size={16} />
              <span>Add to Cart — ৳ {(product.price * quantity).toLocaleString()}</span>
            </motion.button>

            <button className="p-4 border border-gray-200 hover:bg-gray-50 transition-colors">
              <Heart size={18} />
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-100">
            {[
              { icon: Truck, label: 'Free Shipping', sub: 'On orders over ৳2000' },
              { icon: ShieldCheck, label: 'Secure Checkout', sub: 'SSL encrypted' },
              { icon: RefreshCw, label: 'Easy Returns', sub: '7-day return policy' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="text-center space-y-1">
                <Icon size={20} className="mx-auto text-gray-600" />
                <p className="text-[10px] uppercase tracking-widest font-bold">{label}</p>
                <p className="text-[9px] text-gray-400">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-8">
          <h2 className="font-display text-3xl md:text-4xl">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}