import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { motion } from 'motion/react';
import { Check, AlertTriangle } from 'lucide-react';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isOrdered, setIsOrdered] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', address: '', city: '', country: '', postalCode: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
    if (user) {
      setForm(prev => ({
        ...prev,
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
        address: user.address?.street || '',
        city: user.address?.city || '',
        country: user.address?.country || '',
        postalCode: user.address?.postalCode || '',
      }));
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const items = cart.map(item => ({
        ...(item._id ? { product: item._id } : {}),
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.images?.[0] || '',
      }));

      await api.post('/orders', {
        items,
        shippingAddress: form,
      });

      setIsOrdered(true);
      setTimeout(() => {
        clearCart();
        navigate('/dashboard');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Order failed');
    } finally {
      setSubmitting(false);
    }
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
          <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-400 pt-8">Redirecting to dashboard...</p>
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

          {user && !user.isVerified && (
            <div className="bg-red-50 border border-red-200 px-4 py-3 flex items-start gap-3">
              <AlertTriangle size={16} className="text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] text-red-700 font-bold uppercase tracking-wider">Email not verified</p>
                <p className="text-[11px] text-red-600 mt-1">
                  You must verify your email before placing an order. Check your inbox for the verification link.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs uppercase tracking-wider px-4 py-3">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">First Name</label>
                <input required type="text" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} className="w-full border-b border-gray-200 py-3 focus:outline-none focus:border-black transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Last Name</label>
                <input required type="text" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} className="w-full border-b border-gray-200 py-3 focus:outline-none focus:border-black transition-colors" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Email Address</label>
              <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full border-b border-gray-200 py-3 focus:outline-none focus:border-black transition-colors" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Shipping Address</label>
              <input required type="text" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full border-b border-gray-200 py-3 focus:outline-none focus:border-black transition-colors" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">City</label>
                <input required type="text" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="w-full border-b border-gray-200 py-3 focus:outline-none focus:border-black transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Country</label>
                <input required type="text" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} className="w-full border-b border-gray-200 py-3 focus:outline-none focus:border-black transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Postal Code</label>
                <input required type="text" value={form.postalCode} onChange={e => setForm({ ...form, postalCode: e.target.value })} className="w-full border-b border-gray-200 py-3 focus:outline-none focus:border-black transition-colors" />
              </div>
            </div>

            <motion.button
              whileHover={user?.isVerified ? { scale: 1.02 } : undefined}
              whileTap={user?.isVerified ? { scale: 0.98 } : undefined}
              type="submit"
              disabled={submitting || !user?.isVerified}
              className="w-full btn-primary py-5 text-base cursor-pointer disabled:opacity-50"
            >
              {!user?.isVerified ? 'Verify Email to Checkout' : submitting ? 'Processing...' : `Confirm Order • $${cartTotal.toFixed(2)}`}
            </motion.button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="space-y-8">
          <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-gray-400">Order Summary</h2>
          <div className="bg-gray-50 p-8 space-y-6 luxury-shadow">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-sm font-medium">
                <span className="text-gray-600 line-clamp-1">{item.name} <span className="text-gray-400 font-light lowercase">x{item.quantity}</span></span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="pt-6 border-t border-gray-200 flex justify-between items-end">
              <span className="font-bold uppercase tracking-widest text-xs">Total Due</span>
              <span className="font-display text-2xl">${cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
