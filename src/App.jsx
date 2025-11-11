import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import PublicOnlyRoute from './routes/PublicOnlyRoute';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Toaster } from 'react-hot-toast';
import Loading from './components/Loading';
import ScrollToTop from './components/CommonSetUp/ScrollToTop';
import AdminDashboard from './admin/AdminDashboard';
import AdminUsers from './admin/AdminUsers';
import AdminProducts from './admin/AdminProducts';
import AdminOrders from './admin/AdminOrders';
import AdminLayout from './admin/AdminLayout';
import UserDetails from './admin/components/UserDetails';
import ProductForm from './admin/components/ProductForm';
import ProtectedRoute from './routes/ProtectedRoute';

// Lazy-loaded pages
const Home = lazy(() => import("./pages/Home"));
const Cart = lazy(() => import("./pages/Cart"));
const Wishlist = lazy(() => import("./pages/WishList"));
const Products = lazy(() => import("./pages/Products"));
const Register = lazy(() => import("./pages/auth/Register"));
const Login = lazy(() => import("./pages/auth/Login"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Profile = lazy(() => import("./pages/Profile"));
const Orders = lazy(() => import("./pages/Orders"));
const OrderDetails = lazy(() => import("./pages/OrderDetails"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));
const ErrorPage = lazy(() => import('./components/ErrorResponse'));

const HomeRouteHandler = () => {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;

  // Redirect admins to admin dashboard
  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  // Blocked users should be logged out automatically
  if (user?.status === 'blocked') {
    return <Navigate to="/login" replace state={{ blocked: true }} />;
  }

  // Show home page for everyone else
  return <Home />;
};

function Layout() {
  const location = useLocation();

  // Hide Navbar and Footer for admin pages
  const isAdminPage = location.pathname.startsWith("/admin");

  // Navbar hidden on login & register
  const hideNavbarPaths = ['/login', '/register'];
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname) && !isAdminPage;

  // Footer visible only on these pages (and not admin)
  const footerPaths = ['/', '/products', '/cart', '/wishlist'];
  const shouldShowFooter = footerPaths.includes(location.pathname) && !isAdminPage;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Toaster
        position="top-center"
        toastOptions={{
          style: { background: '#fff', color: '#333' },
          success: { style: { background: '#4BB543', color: '#fff' } },
          error: { style: { background: '#FF3333', color: '#fff' } },
        }}
      />

      {/* Navbar */}
      {shouldShowNavbar && <Navbar />}

      {/* Main content */}
      <div className="flex-grow">
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="*" element={<ErrorPage />} />

            {/* Public routes */}
            <Route path="/" element={<HomeRouteHandler />} />
            <Route path="/login" element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            } />
            <Route path="/register" element={
              <PublicOnlyRoute>
                <Register />
              </PublicOnlyRoute>
            } />

            {/* Protected user routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/products" element={<Products />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/:orderId" element={<OrderDetails />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/wishlist" element={<Wishlist />} />
            </Route>

            {/* Admin-only routes */}
            <Route path="/admin" element={<ProtectedRoute role="admin" />}>
              <Route element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="users/:userId" element={<UserDetails />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="products/new" element={<ProductForm />} />
                <Route path="products/:id/edit" element={<ProductForm />} />
                <Route path="orders" element={<AdminOrders />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </div>

      {/* Footer */}
      {shouldShowFooter && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <ScrollToTop />
            <Layout />
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}