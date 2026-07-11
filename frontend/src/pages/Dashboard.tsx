import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { Package, User, MapPin, Phone, Mail, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { OrderCardSkeleton } from '../components/Skeleton';

interface OrderItem {
  _id?: string;
  product?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
  };
  createdAt: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function Dashboard() {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [profile, setProfile] = useState({ name: '', phone: '', street: '', city: '', state: '', postalCode: '', country: '' });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get<Order[]>('/orders')
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));

    if (user) {
      setProfile({
        name: user.name || '',
        phone: user.phone || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        postalCode: user.address?.postalCode || '',
        country: user.address?.country || '',
      });
    }
  }, [user]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await api.put('/auth/profile', {
        name: profile.name,
        phone: profile.phone,
        address: {
          street: profile.street,
          city: profile.city,
          state: profile.state,
          postalCode: profile.postalCode,
          country: profile.country,
        },
      });
      setMessage('Profile updated successfully');
      setEditing(false);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight">My Account</h1>
        <p className="text-gray-500 text-sm mt-2">Welcome back, {user?.name}</p>
      </div>

      {user && !user.isVerified && (
        <div className="mb-8 bg-yellow-50 border border-yellow-200 px-4 md:px-6 py-4 flex items-start gap-3">
          <AlertTriangle size={18} className="text-yellow-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs uppercase tracking-wider font-bold text-yellow-800">Email not verified</p>
            <p className="text-[11px] text-yellow-700 mt-1">
              Please check your inbox and click the verification link to activate your account.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Profile Section */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <User size={20} />
              <h2 className="text-xs uppercase tracking-[0.2em] font-bold">Profile</h2>
            </div>

            {editing ? (
              <form onSubmit={handleProfileSave} className="space-y-4">
                {message && (
                  <div className={`text-[10px] uppercase tracking-wider px-3 py-2 ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message}
                  </div>
                )}
                <div>
                  <label className="block text-[9px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-1">Name</label>
                  <input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black" />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-1">Phone</label>
                  <input value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black" />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-1">Street</label>
                  <input value={profile.street} onChange={e => setProfile({ ...profile, street: e.target.value })} className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-1">City</label>
                    <input value={profile.city} onChange={e => setProfile({ ...profile, city: e.target.value })} className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black" />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-1">State</label>
                    <input value={profile.state} onChange={e => setProfile({ ...profile, state: e.target.value })} className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-1">Postal Code</label>
                    <input value={profile.postalCode} onChange={e => setProfile({ ...profile, postalCode: e.target.value })} className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black" />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-1">Country</label>
                    <input value={profile.country} onChange={e => setProfile({ ...profile, country: e.target.value })} className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black" />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={saving} className="bg-black text-white px-5 py-2.5 text-[10px] font-bold uppercase tracking-wider hover:bg-zinc-900 disabled:opacity-50">
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button type="button" onClick={() => setEditing(false)} className="border border-gray-300 px-5 py-2.5 text-[10px] font-bold uppercase tracking-wider hover:bg-gray-50">Cancel</button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                {message && (
                  <div className={`text-[10px] uppercase tracking-wider px-3 py-2 ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message}
                  </div>
                )}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail size={14} className="text-gray-400" />
                    <span>{user?.email}</span>
                  </div>
                  {user?.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone size={14} className="text-gray-400" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  {user?.address && (
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin size={14} className="text-gray-400 mt-0.5" />
                      <span>
                        {user.address.street && `${user.address.street}, `}
                        {user.address.city && `${user.address.city}, `}
                        {user.address.country}
                      </span>
                    </div>
                  )}
                </div>
                <button onClick={() => setEditing(true)} className="text-[10px] uppercase tracking-wider font-bold underline underline-offset-4 hover:no-underline">
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Orders Section */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <Package size={20} />
            <h2 className="text-xs uppercase tracking-[0.2em] font-bold">Order History</h2>
          </div>

          {loading ? (
            <div className="space-y-4 py-8">
              {[1, 2, 3].map(i => (
                <OrderCardSkeleton key={i} />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 p-12 text-center">
              <Package size={32} className="mx-auto text-gray-300 mb-4" />
              <p className="text-xs uppercase tracking-wider text-gray-400">No orders yet</p>
              <p className="text-sm text-gray-500 mt-2">Your orders will appear here once you place them.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order._id} className="bg-white border border-gray-200">
                  <button
                    onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-xs font-mono font-medium">#{order._id.slice(-8)}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-sm">${order.totalAmount.toLocaleString()}</span>
                      {expandedOrder === order._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </button>

                  {expandedOrder === order._id && (
                    <div className="border-t border-gray-100 px-6 py-4 space-y-4">
                      <div>
                        <h4 className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-2">Items</h4>
                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-3">
                                {item.image && (
                                  <img src={item.image} alt="" className="w-10 h-12 object-cover bg-gray-100" />
                                )}
                                <span className="text-gray-700">{item.name} <span className="text-gray-400">x{item.quantity}</span></span>
                              </div>
                              <span className="font-medium">${(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-1">Shipping To</h4>
                        <p className="text-xs text-gray-600">
                          {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                          {order.shippingAddress.address && ` — ${order.shippingAddress.address}`}
                          {order.shippingAddress.city && `, ${order.shippingAddress.city}`}
                          {order.shippingAddress.country}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
