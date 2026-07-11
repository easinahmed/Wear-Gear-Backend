import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

interface PaginatedOrders {
  orders: Order[];
  total: number;
  page: number;
  pages: number;
}

const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusStyles: Record<string, { bg: string; color: string }> = {
  pending: { bg: '#fef9c3', color: '#854d0e' },
  processing: { bg: '#dbeafe', color: '#1e40af' },
  shipped: { bg: '#f3e8ff', color: '#6b21a8' },
  delivered: { bg: '#dcfce7', color: '#166534' },
  cancelled: { bg: '#fee2e2', color: '#991b1b' },
};

const PAGE_SIZE = 10;

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = () => {
    setLoading(true);
    api.get<Order[] | PaginatedOrders>(`/admin/orders?page=${page}&limit=${PAGE_SIZE}`)
      .then(res => {
        if (Array.isArray(res)) {
          setOrders(res);
          setTotalPages(1);
        } else {
          setOrders(res.orders || []);
          setTotalPages(res.pages || 1);
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, [page]);

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
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-16 bg-gray-200 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold uppercase tracking-tight">Orders</h1>
        <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">Manage customer orders</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs uppercase tracking-wider px-4 py-3 mb-6">
          {error}
        </div>
      )}

      {/* Desktop table */}
      <div className="bg-white border border-gray-200 overflow-hidden hidden md:block">
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
                    <select
                      value={order.status}
                      onChange={e => updateStatus(order._id, e.target.value)}
                      disabled={updating === order._id}
                      className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border cursor-pointer focus:outline-none disabled:opacity-50 rounded"
                      style={{
                        backgroundColor: statusStyles[order.status]?.bg || '#f3f4f6',
                        color: statusStyles[order.status]?.color || '#374151',
                      }}
                    >
                      {statuses.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 md:gap-4 mt-6 md:mt-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="flex items-center gap-1 px-3 md:px-4 py-2 border border-gray-200 text-xs uppercase tracking-wider font-bold hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={14} />
            <span className="hidden sm:inline">Previous</span>
          </button>
          <div className="flex items-center gap-1 md:gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-8 h-8 md:w-9 md:h-9 text-xs font-bold border transition-colors ${
                  page === i + 1
                    ? 'bg-black text-white border-black'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="flex items-center gap-1 px-3 md:px-4 py-2 border border-gray-200 text-xs uppercase tracking-wider font-bold hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {orders.map(order => (
          <div key={order._id} className="bg-white border border-gray-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs">#{order._id.slice(-8)}</span>
              <span className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
            <div>
              <p className="text-sm font-medium">{order.user?.name || 'Unknown'}</p>
              <p className="text-xs text-gray-500">{order.user?.email || ''}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">{order.items?.length || 0} item(s)</span>
              <span className="font-bold text-sm">${order.totalAmount?.toLocaleString() || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500">Status</span>
              <select
                value={order.status}
                onChange={e => updateStatus(order._id, e.target.value)}
                disabled={updating === order._id}
                className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border cursor-pointer focus:outline-none disabled:opacity-50 rounded"
                style={{
                  backgroundColor: statusStyles[order.status]?.bg || '#f3f4f6',
                  color: statusStyles[order.status]?.color || '#374151',
                }}
              >
                {statuses.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="text-center py-12 text-xs text-gray-400 uppercase tracking-wider">No orders yet</div>
        )}
      </div>
    </div>
  );
}
