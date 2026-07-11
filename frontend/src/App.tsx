import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminOrders from './pages/admin/Orders';
import AdminProducts from './pages/admin/Products';
import AdminCategories from './pages/admin/Categories';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
            <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
              <Route path="categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
              <Route path="users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
              <Route path="orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
            </Route>
            <Route path="*" element={
              <MainLayout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<ProtectedRoute redirectAdminTo="/admin/dashboard"><Checkout /></ProtectedRoute>} />
                  <Route path="/dashboard" element={<ProtectedRoute redirectAdminTo="/admin/dashboard"><Dashboard /></ProtectedRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </MainLayout>
            } />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
