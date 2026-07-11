import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

interface Order {
  _id: string;
  user: { _id: string; name: string; email: string };
  items: Array<{ name: string; quantity: number; price: number }>;
  totalAmount: number;
  status: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    country: string;
  };
  createdAt: string;
}

const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchOrders = () => {
    setLoading(true);
    api.get<Order[]>('/admin/orders')
      .then(setOrders)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (orderId: string, status: string) => {
    setUpdating(orderId);
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status });
      fetchOrders();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold uppercase tracking-tight">Orders</h1>
        <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">Manage customer orders</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs uppercase tracking-wider px-4 py-3 mb-6">
          {error}
        </div>
      )}

      <div className="bg-white border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-3 text-[10px] uppercase tracking-wider font-bold text-gray-500">Order ID</th>
                <th className="text-left px-6 py-3 text-[10px] uppercase tracking-wider font-bold text-gray-500">Customer</th>
                <th className="text-left px-6 py-3 text-[10px] uppercase tracking-wider font-bold text-gray-500">Items</th>
                <th className="text-left px-6 py-3 text-[10px] uppercase tracking-wider font-bold text-gray-500">Amount</th>
                <th className="text-left px-6 py-3 text-[10px] uppercase tracking-wider font-bold text-gray-500">Status</th>
                <th className="text-left px-6 py-3 text-[10px] uppercase tracking-wider font-bold text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-xs">#{order._id.slice(-8)}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-sm">{order.user?.name || 'Unknown'}</p>
                      <p className="text-xs text-gray-500">{order.user?.email || ''}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-600">
                    {order.items?.length || 0} item(s)
                  </td>
                  <td className="px-6 py-4 font-medium">${order.totalAmount?.toLocaleString() || 0}</td>
                  <td className="px-6 py-4">
                    <div className="relative group">
                      <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider cursor-pointer ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                        {order.status}
                      </span>
                      <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 shadow-lg z-10 hidden group-hover:block min-w-[130px]">
                        {statuses.map(s => (
                          <button
                            key={s}
                            onClick={() => updateStatus(order._id, s)}
                            disabled={s === order.status || updating === order._id}
                            className={`block w-full text-left px-4 py-2 text-[10px] uppercase tracking-wider font-bold hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed ${
                              s === order.status ? 'text-black' : 'text-gray-500'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-xs text-gray-400 uppercase tracking-wider">
                    No orders yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
