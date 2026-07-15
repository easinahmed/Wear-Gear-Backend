import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { TrendingUp, ShoppingCart, Package, Users, BarChart3 } from 'lucide-react';

interface AnalyticsData {
  summary: {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalUsers: number;
  };
  revenueByDay: Array<{ _id: string; revenue: number; count: number }>;
  ordersByDay: Array<{ _id: string; count: number }>;
  ordersByStatus: Array<{ _id: string; count: number }>;
  productsByCategory: Array<{ _id: string; count: number }>;
  topProducts: Array<{ _id: string; name: string; totalQuantity: number; totalRevenue: number }>;
  newUsersByDay: Array<{ _id: string; count: number }>;
}

function BarChart({ data, labelKey, valueKey, color = 'bg-black', format }: {
  data: Array<Record<string, any>>;
  labelKey: string;
  valueKey: string;
  color?: string;
  format?: (v: number) => string;
}) {
  const maxVal = Math.max(...data.map(d => d[valueKey]), 1);
  return (
    <div className="space-y-2">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-wider text-gray-500 w-20 text-right truncate shrink-0">{d[labelKey]}</span>
          <div className="flex-1 bg-gray-100 h-6 relative">
            <div
              className={`${color} h-full transition-all duration-500`}
              style={{ width: `${(d[valueKey] / maxVal) * 100}%` }}
            />
          </div>
          <span className="text-xs font-bold w-20 text-right shrink-0">{format ? format(d[valueKey]) : d[valueKey]}</span>
        </div>
      ))}
    </div>
  );
}

function HorizontalBarList({ data, labelKey, valueKey, format }: {
  data: Array<Record<string, any>>;
  labelKey: string;
  valueKey: string;
  format?: (v: number) => string;
}) {
  const maxVal = Math.max(...data.map(d => d[valueKey]), 1);
  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <div key={i} className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium capitalize truncate">{d[labelKey] || 'Unknown'}</span>
            <span className="text-xs font-bold">{format ? format(d[valueKey]) : d[valueKey]}</span>
          </div>
          <div className="bg-gray-100 h-2">
            <div
              className="bg-black h-full transition-all duration-500"
              style={{ width: `${(d[valueKey] / maxVal) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get<AnalyticsData>('/admin/analytics')
      .then(setData)
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white border border-gray-200 p-6 space-y-4">
              <div className="h-4 bg-gray-200 animate-pulse w-1/3" />
              <div className="space-y-3">
                {[1, 2, 3].map(j => (
                  <div key={j} className="h-8 bg-gray-200 animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) return <div className="text-red-600 text-sm">{error}</div>;
  if (!data) return null;

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500',
    processing: 'bg-blue-500',
    shipped: 'bg-purple-500',
    delivered: 'bg-green-500',
    cancelled: 'bg-red-500',
  };

  const summaryCards = [
    { label: 'Total Revenue', value: `$${data.summary.totalRevenue.toLocaleString()}`, icon: TrendingUp },
    { label: 'Total Orders', value: data.summary.totalOrders, icon: ShoppingCart },
    { label: 'Total Products', value: data.summary.totalProducts, icon: Package },
    { label: 'Total Customers', value: data.summary.totalUsers, icon: Users },
  ];

  const revenueData = data.revenueByDay.map(d => ({
    label: new Date(d._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    revenue: d.revenue,
  }));

  const ordersData = data.ordersByDay.map(d => ({
    label: new Date(d._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    count: d.count,
  }));

  const statusData = data.ordersByStatus.map(d => ({
    status: d._id,
    count: d.count,
  }));

  return (
    <div>
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold uppercase tracking-tight">Analytics</h1>
        <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">Last 30 days overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
        {summaryCards.map(card => {
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-gray-200 p-4 md:p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={16} className="text-gray-400" />
            <h2 className="text-xs uppercase tracking-[0.2em] font-bold">Revenue by Day</h2>
          </div>
          {revenueData.length > 0 ? (
            <BarChart
              data={revenueData}
              labelKey="label"
              valueKey="revenue"
              color="bg-black"
              format={v => `$${v.toLocaleString()}`}
            />
          ) : (
            <p className="text-xs text-gray-400 uppercase tracking-wider text-center py-8">No revenue data</p>
          )}
        </div>

        <div className="bg-white border border-gray-200 p-4 md:p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 size={16} className="text-gray-400" />
            <h2 className="text-xs uppercase tracking-[0.2em] font-bold">Orders by Day</h2>
          </div>
          {ordersData.length > 0 ? (
            <BarChart
              data={ordersData}
              labelKey="label"
              valueKey="count"
              color="bg-gray-800"
            />
          ) : (
            <p className="text-xs text-gray-400 uppercase tracking-wider text-center py-8">No order data</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-gray-200 p-4 md:p-6">
          <div className="flex items-center gap-2 mb-6">
            <ShoppingCart size={16} className="text-gray-400" />
            <h2 className="text-xs uppercase tracking-[0.2em] font-bold">Orders by Status</h2>
          </div>
          {statusData.length > 0 ? (
            <div className="space-y-3">
              {statusData.map(d => (
                <div key={d.status} className="flex items-center gap-3">
                  <span className="text-[10px] uppercase tracking-wider text-gray-500 w-20 text-right capitalize shrink-0">{d.status}</span>
                  <div className="flex-1 bg-gray-100 h-6 relative">
                    <div
                      className={`${statusColors[d.status] || 'bg-gray-400'} h-full transition-all duration-500`}
                      style={{ width: `${(d.count / Math.max(...statusData.map(s => s.count), 1)) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold w-12 text-right shrink-0">{d.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 uppercase tracking-wider text-center py-8">No orders</p>
          )}
        </div>

        <div className="bg-white border border-gray-200 p-4 md:p-6">
          <div className="flex items-center gap-2 mb-6">
            <Package size={16} className="text-gray-400" />
            <h2 className="text-xs uppercase tracking-[0.2em] font-bold">Products by Category</h2>
          </div>
          {data.productsByCategory.length > 0 ? (
            <HorizontalBarList
              data={data.productsByCategory}
              labelKey="_id"
              valueKey="count"
            />
          ) : (
            <p className="text-xs text-gray-400 uppercase tracking-wider text-center py-8">No products</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 p-4 md:p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 size={16} className="text-gray-400" />
            <h2 className="text-xs uppercase tracking-[0.2em] font-bold">Top Selling Products</h2>
          </div>
          {data.topProducts.length > 0 ? (
            <div className="space-y-4">
              {data.topProducts.map((p, i) => (
                <div key={p._id} className="flex items-center gap-4">
                  <span className="text-xs font-bold text-gray-400 w-5 shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{p.name}</p>
                    <p className="text-[10px] text-gray-400">{p.totalQuantity} sold &middot; ${p.totalRevenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 uppercase tracking-wider text-center py-8">No sales data</p>
          )}
        </div>

        <div className="bg-white border border-gray-200 p-4 md:p-6">
          <div className="flex items-center gap-2 mb-6">
            <Users size={16} className="text-gray-400" />
            <h2 className="text-xs uppercase tracking-[0.2em] font-bold">New Customers</h2>
          </div>
          {data.newUsersByDay.length > 0 ? (
            <BarChart
              data={data.newUsersByDay.map(d => ({
                label: new Date(d._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                count: d.count,
              }))}
              labelKey="label"
              valueKey="count"
              color="bg-gray-600"
            />
          ) : (
            <p className="text-xs text-gray-400 uppercase tracking-wider text-center py-8">No new customers</p>
          )}
        </div>
      </div>
    </div>
  );
}
