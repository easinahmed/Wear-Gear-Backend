import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isOrdered, setIsOrdered] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOrdered(true);
    setTimeout(() => {
      clearCart();
      navigate('/');
    }, 3000);
  };

  if (isOrdered) {
    return (
      <div className="fixed inset-0 bg-white z-[100] flex items-center justify-center text-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md space-y-8"
        >
          <div className="w-24 h-24 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-8">
            <Check size={48} />
          </div>
          <h1 className="font-display text-5xl">Thank you.</h1>
          <p className="text-gray-500 italic leading-relaxed">
            Your order has been received and is being processed by our artisans. An email confirmation has been sent to you.
          </p>
          <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-400 pt-8">Redirecting home...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        {/* Checkout Form */}
        <div className="space-y-12">
          <h1 className="section-title">Shipping Details</h1>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">First Name</label>
                <input required type="text" className="w-full border-b border-gray-200 py-3 focus:outline-none focus:border-black transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Last Name</label>
                <input required type="text" className="w-full border-b border-gray-200 py-3 focus:outline-none focus:border-black transition-colors" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Email Address</label>
              <input required type="email" className="w-full border-b border-gray-200 py-3 focus:outline-none focus:border-black transition-colors" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Shipping Address</label>
              <input required type="text" className="w-full border-b border-gray-200 py-3 focus:outline-none focus:border-black transition-colors" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">City</label>
                <input required type="text" className="w-full border-b border-gray-200 py-3 focus:outline-none focus:border-black transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Country</label>
                <input required type="text" className="w-full border-b border-gray-200 py-3 focus:outline-none focus:border-black transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Postal Code</label>
                <input required type="text" className="w-full border-b border-gray-200 py-3 focus:outline-none focus:border-black transition-colors" />
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              className="w-full btn-primary py-5 text-base cursor-pointer"
            >
              Confirm Order • ৳ {cartTotal.toFixed(2)}
            </motion.button>
          </form>
        </div>

        {/* List of items */}
        <div className="space-y-8">
          <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-gray-400">Order Summary</h2>
          <div className="bg-gray-50 p-8 space-y-6 luxury-shadow">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-sm font-medium">
                <span className="text-gray-600 line-clamp-1">{item.name} <span className="text-gray-400 font-light lowercase">x{item.quantity}</span></span>
                <span>৳ {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="pt-6 border-t border-gray-200 flex justify-between items-end">
              <span className="font-bold uppercase tracking-widest text-xs">Total Due</span>
              <span className="font-display text-2xl">৳ {cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
