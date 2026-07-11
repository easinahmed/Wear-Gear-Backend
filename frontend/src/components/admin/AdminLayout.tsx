import { Link, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, Package, Grid3X3, Users, ShoppingBag, ArrowLeft, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-black text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="text-lg font-black tracking-tighter">WEAR & GEAR</Link>
          <p className="text-[9px] uppercase tracking-[0.3em] text-gray-400 mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
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
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Shop
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors w-full"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
