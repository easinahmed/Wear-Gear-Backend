import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Users, Package, ShoppingCart, DollarSign } from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: Array<{
    _id: string;
    user: { name: string; email: string };
    totalAmount: number;
    status: string;
    createdAt: string;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get<DashboardStats>('/admin/dashboard')
      .then(setStats)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white border border-gray-200 p-6 space-y-4">
              <div className="h-4 bg-gray-200 animate-pulse w-1/2" />
              <div className="h-8 bg-gray-200 animate-pulse w-1/3" />
            </div>
          ))}
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-16 bg-gray-200 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 text-sm">{error}</div>;
  }

  if (!stats) return null;

  const cards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users },
    { label: 'Total Products', value: stats.totalProducts, icon: Package },
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart },
    { label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign },
  ];

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div>
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold uppercase tracking-tight">Dashboard</h1>
        <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">Overview of your store</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
        {cards.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white border border-gray-200 p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">{card.label}</span>
                <Icon size={18} className="text-gray-400" />
              </div>
              <p className="text-2xl md:text-3xl font-bold">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Desktop table */}
      <div className="bg-white border border-gray-200 hidden md:block">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-xs uppercase tracking-[0.2em] font-bold">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 text-[10px] uppercase tracking-wider font-bold text-gray-500">Order ID</th>
                <th className="text-left px-6 py-3 text-[10px] uppercase tracking-wider font-bold text-gray-500">Customer</th>
                <th className="text-left px-6 py-3 text-[10px] uppercase tracking-wider font-bold text-gray-500">Amount</th>
                <th className="text-left px-6 py-3 text-[10px] uppercase tracking-wider font-bold text-gray-500">Status</th>
                <th className="text-left px-6 py-3 text-[10px] uppercase tracking-wider font-bold text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map(order => (
                <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-xs">#{order._id.slice(-8)}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-sm">{order.user?.name || 'Unknown'}</p>
                      <p className="text-xs text-gray-500">{order.user?.email || ''}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">${order.totalAmount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {stats.recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-xs text-gray-400 uppercase tracking-wider">
                    No orders yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        <h2 className="text-xs uppercase tracking-[0.2em] font-bold mb-3">Recent Orders</h2>
        {stats.recentOrders.map(order => (
          <div key={order._id} className="bg-white border border-gray-200 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs">#{order._id.slice(-8)}</span>
              <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                {order.status}
              </span>
            </div>
            <p className="text-sm font-medium">{order.user?.name || 'Unknown'}</p>
            <p className="text-xs text-gray-500">{order.user?.email || ''}</p>
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold">${order.totalAmount.toLocaleString()}</span>
              <span className="text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
        {stats.recentOrders.length === 0 && (
          <div className="text-center py-8 text-xs text-gray-400 uppercase tracking-wider">No orders yet</div>
        )}
      </div>
    </div>
  );
}
