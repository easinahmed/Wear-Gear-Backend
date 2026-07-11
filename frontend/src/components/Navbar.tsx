import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';


export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      {/* Top Tier: Logo, Search, Icons */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-2 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Logo Section */}
        <Link to="/" className="flex-shrink-0 flex items-center group">
          <div className="border border-gray-200 p-1.5 flex items-center space-x-2.5 bg-white hover:bg-gray-50 transition-colors">
            <img 
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23000' rx='4'/%3E%3Ctext x='16' y='21' text-anchor='middle' fill='%23fff' font-size='14' font-weight='bold' font-family='Arial'%3EWG%3C/text%3E%3C/svg%3E" 
              alt="Wear & Gear Logo" 
              className="w-8 h-8 object-contain"
            />
            <div className="flex flex-col -space-y-1">
              <span className="text-base font-black tracking-tighter text-black">WEAR & GEAR</span>
              <span className="text-[7px] uppercase font-bold tracking-tight text-gray-400">Perfect Fit, Every Trend</span>
            </div>
          </div>
        </Link>

        {/* Search Bar (Centered) */}
        <div className="hidden md:flex flex-1 max-w-2xl relative group">
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full bg-gray-50 border border-gray-200 rounded-full py-1.5 px-6 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all placeholder:text-gray-400"
          />
          <Search size={20} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" />
        </div>

        {/* Icons Section */}
        <div className="flex items-center space-x-4 md:space-x-6">
          {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="text-gray-700 hover:text-black transition-colors p-1"
              >
                <User size={22} strokeWidth={1.5} />
              </button>
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-100 shadow-xl z-50"
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium truncate">{user?.name}</p>
                      <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      {isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-700 hover:bg-gray-50"
                        >
                          <LayoutDashboard size={14} />
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => { logout(); navigate('/'); setIsUserMenuOpen(false); }}
                        className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-700 hover:bg-gray-50 w-full"
                      >
                        <LogOut size={14} />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden md:inline-block text-[10px] uppercase tracking-[0.2em] font-bold text-black hover:text-gray-600 transition-colors"
            >
              Sign In
            </Link>
          )}
          <Link to="/cart" className="text-gray-700 hover:text-black transition-colors relative group">
            <ShoppingCart size={24} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#e41e26] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-sm">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-black p-1 hover:bg-gray-100 rounded-full"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Search - Visible only on mobile */}
      <div className="md:hidden px-4 pb-4">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 px-5 text-sm focus:outline-none"
          />
          <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Bottom Tier: Navigation Links (Desktop Only) */}
      <nav className="hidden md:block border-t border-gray-100 bg-white">
        <div className="max-w-[1440px] mx-auto px-4">
          <ul className="flex items-center justify-center space-x-10 py-1.5">
            {[
              { 
                name: 'Winter Collection', 
                path: '/shop?category=hoodie',
                dropdown: [
                  { name: 'Hoodies', path: '/shop?category=hoodie' },
                  { name: 'Sweatshirts', path: '/shop?category=sweatshirt' },
                  { name: 'Winter Jackets', path: '/shop' },
                  { name: 'Full Sleeve T-Shirts', path: '/shop' }
                ]
              },
              { 
                name: 'Men', 
                path: '/shop',
                dropdown: [
                  { name: 'Panjabi', path: '/shop?category=panjabi' },
                  { name: 'Polo Shirts', path: '/shop?category=polo-shirt' },
                  { name: 'Half Shirts', path: '/shop?category=half-shirt' },
                  { name: 'Modern Fit', path: '/shop' }
                ]
              },
              { 
                name: 'Sweatshirt', 
                path: '/shop?category=sweatshirt',
                dropdown: [
                  { name: 'Basic Fleece', path: '/shop?category=sweatshirt' },
                  { name: 'Printed Sweatshirts', path: '/shop?category=sweatshirt' },
                  { name: 'Oversized Fit', path: '/shop?category=sweatshirt' },
                  { name: 'Heritage Collection', path: '/shop?category=sweatshirt' }
                ]
              },
              { 
                name: 'Hoodie', 
                path: '/shop?category=hoodie',
                dropdown: [
                  { name: 'Premium Arctic', path: '/shop?category=hoodie' },
                  { name: 'Street Hoodies', path: '/shop?category=hoodie' },
                  { name: 'Zip-up Style', path: '/shop?category=hoodie' },
                  { name: 'Light Weight', path: '/shop?category=hoodie' }
                ]
              },
              { 
                name: 'Trouser', 
                path: '/shop?category=trouser',
                dropdown: [
                  { name: 'Cargo Pants', path: '/shop?category=trouser' },
                  { name: 'Tailored Chinos', path: '/shop?category=trouser' },
                  { name: 'Denim Collection', path: '/shop?category=trouser' },
                  { name: 'Urban Utility', path: '/shop?category=trouser' }
                ]
              }
            ].map((link) => (
              <li key={link.name} className="relative group/nav py-2">
                <Link 
                  to={link.path}
                  className="text-[13px] font-bold text-black uppercase tracking-wide hover:text-[#e41e26] transition-colors relative"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#e41e26] transition-all group-hover/nav:w-full" />
                </Link>

                {/* Dropdown Menu */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 invisible group-hover/nav:visible opacity-0 group-hover/nav:opacity-100 transition-all duration-300 z-50">
                  <div className="bg-white border border-gray-100 shadow-xl min-w-[200px] py-4 rounded-sm">
                    <ul className="flex flex-col">
                      {link.dropdown.map((subItem) => (
                        <li key={subItem.name}>
                          <Link 
                            to={subItem.path}
                            className="block px-6 py-2.5 text-[11px] font-bold text-gray-600 uppercase tracking-[0.1em] hover:bg-gray-50 hover:text-[#e41e26] transition-all"
                          >
                            {subItem.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="md:hidden fixed inset-0 z-50 bg-white"
          >
            <div className="p-6 space-y-8 h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <div className="border border-gray-200 p-2 flex items-center space-x-2.5">
                  <img 
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23000' rx='4'/%3E%3Ctext x='16' y='21' text-anchor='middle' fill='%23fff' font-size='14' font-weight='bold' font-family='Arial'%3EWG%3C/text%3E%3C/svg%3E" 
                    alt="Wear & Gear Logo" 
                    className="w-8 h-8 object-contain"
                  />
                  <span className="text-base font-black tracking-tighter text-black">WEAR & GEAR</span>
                </div>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={24} />
                </button>
              </div>
              <div className="flex flex-col space-y-6 overflow-y-auto pb-10">
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold uppercase tracking-widest border-b pb-2">Home</Link>
                <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold uppercase tracking-widest border-b pb-2">Shop All</Link>
                <Link to="/shop?category=hoodie" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold uppercase tracking-widest border-b pb-2">Winter Collection</Link>
                <Link to="/shop?category=sweatshirt" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold uppercase tracking-widest border-b pb-2">Sweatshirts</Link>
                <Link to="/about" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold uppercase tracking-widest border-b pb-2">About Us</Link>
                {isAuthenticated ? (
                  <>
                    {isAdmin && (
                      <Link to="/admin/dashboard" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold uppercase tracking-widest border-b pb-2 text-[#e41e26]">Admin</Link>
                    )}
                    <button onClick={() => { logout(); navigate('/'); setIsMenuOpen(false); }} className="text-left text-xl font-bold uppercase tracking-widest border-b pb-2">Sign Out</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold uppercase tracking-widest border-b pb-2">Sign In</Link>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold uppercase tracking-widest border-b pb-2">Create Account</Link>
                  </>
                )}
              </div>
              <div className="mt-auto pt-6 border-t font-bold text-center text-gray-400 text-xs uppercase tracking-[0.2em]">
                Perfect Fit, Every Trend
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
