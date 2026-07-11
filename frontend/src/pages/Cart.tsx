import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react';
import { motion } from 'motion/react';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="inline-flex bg-gray-50 p-10 rounded-full mb-8">
          <ShoppingBag size={80} strokeWidth={1} className="text-gray-200" />
        </div>
        <h1 className="text-3xl font-display mb-6">Your bag is empty</h1>
        <p className="text-gray-500 mb-12 max-w-md mx-auto italic leading-relaxed">
          Looks like you haven't added anything to your cart yet. Browse our collections to find something special.
        </p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block"
        >
          <Link to="/shop" className="btn-primary">Start Shopping</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <h1 className="section-title mb-12">Your Shopping Bag</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Cart items */}
        <div className="lg:col-span-8 space-y-8">
          {cart.map((item) => (
            <motion.div 
              layout
              key={item.id} 
              className="flex items-center space-x-6 py-6 border-b border-gray-100 last:border-0"
            >
              <div className="w-24 h-32 bg-gray-100 flex-shrink-0 overflow-hidden">
                <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold uppercase tracking-widest">{item.name}</h3>
                  <p className="text-xs text-gray-500 italic lowercase">{item.category}</p>
                </div>
                
                <div className="flex items-center">
                  <div className="flex items-center border border-gray-200">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:bg-gray-50 transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-10 text-center text-xs font-medium">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-gray-50 transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between md:justify-end space-x-8">
                  <p className="text-sm font-semibold tracking-wider">৳ {(item.price * item.quantity).toFixed(2)}</p>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-black transition-colors"
                  >
                    <Trash2 size={18} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-4">
          <div className="bg-gray-50 p-8 space-y-8 luxury-shadow">
            <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-gray-400">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 italic">Subtotal</span>
                <span className="font-semibold">৳ {cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 italic">Shipping</span>
                <span className="text-black font-semibold uppercase text-[10px] tracking-widest">Complimentary</span>
              </div>
              <div className="pt-6 border-t border-gray-200 flex justify-between items-end">
                <span className="font-bold uppercase tracking-widest text-xs">Estimated Total</span>
                <span className="font-display text-2xl">৳ {cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link 
                to="/checkout" 
                className="w-full btn-primary flex items-center justify-center space-x-3"
              >
                <span>Continue to Checkout</span>
                <ArrowRight size={16} />
              </Link>
            </motion.div>
            
            <p className="text-[10px] text-gray-400 text-center uppercase tracking-[0.3em] font-medium">
              Secure Payments • Trusted by Thousands
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
