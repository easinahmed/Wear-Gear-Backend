import { Link, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, Package, Grid3X3, Users, ShoppingBag, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

const navItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Inventory', path: '/admin/products', icon: Package },
  { name: 'Categories', path: '/admin/categories', icon: Grid3X3 },
  { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
  { name: 'Customers', path: '/admin/users', icon: Users },
];

export default function AdminLayout() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebar = (
    <aside className="w-64 bg-black text-white flex flex-col h-full">
      <div className="p-4 md:p-6 border-b border-white/10 flex items-center justify-between">
        <div>
          <Link to="/" className="text-lg font-black tracking-tighter">WEAR & GEAR</Link>
          <p className="text-[9px] uppercase tracking-[0.3em] text-gray-400 mt-1">Admin Panel</p>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 hover:bg-white/10 rounded">
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider font-bold transition-colors ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={16} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-2">
        <div className="px-4 py-2">
          <p className="text-xs font-medium truncate">{user?.name}</p>
          <p className="text-[9px] uppercase tracking-wider text-gray-400 truncate">{user?.email}</p>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors w-full"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64">{sidebar}</div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-col">{sidebar}</div>

      <main className="flex-1 min-w-0 overflow-auto">
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200 md:hidden flex items-center gap-3 px-4 py-3">
          <button onClick={() => setSidebarOpen(true)} className="p-1.5 hover:bg-gray-100 rounded">
            <Menu size={20} />
          </button>
          <span className="text-sm font-bold uppercase tracking-tight">Admin Panel</span>
        </div>
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
