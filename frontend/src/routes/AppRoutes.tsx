import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { CustomerLayout } from '../layouts/CustomerLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';

// Public Pages
import { LandingPage } from '../pages/public/LandingPage';
import { CatalogPage } from '../pages/public/CatalogPage';
import { LoginPage } from '../pages/public/LoginPage';
import { RegisterPage } from '../pages/public/RegisterPage';

// Customer Pages
import { ProductDetailPage } from '../pages/customer/ProductDetailPage';
import { CartPage } from '../pages/customer/CartPage';
import { CheckoutPage } from '../pages/customer/CheckoutPage';
import { OrdersPage } from '../pages/customer/OrdersPage';
import { OrderDetailPage } from '../pages/customer/OrderDetailPage';
import { ProfilePage } from '../pages/customer/ProfilePage';

// Admin Pages
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminProductsPage } from '../pages/admin/AdminProductsPage';
import { AdminOrdersPage } from '../pages/admin/AdminOrdersPage';
import { AdminPaymentsPage } from '../pages/admin/AdminPaymentsPage';
import { AdminShippingPage } from '../pages/admin/AdminShippingPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 1. PUBLIC ROUTES (Guest & Customer) */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 
          IMPORTANT RULE: Detail Produk wajib terproteksi!
          Guest yang menekan link detail produk diarahkan ke login
        */}
        <Route
          path="/products/:slug"
          element={
            <ProtectedRoute>
              <ProductDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* 2. CUSTOMER ACCOUNT ROUTES (Customer Layout) */}
      <Route
        element={
          <ProtectedRoute>
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* 3. ADMIN PORTAL ROUTES (Admin Layout) */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="payments" element={<AdminPaymentsPage />} />
        <Route path="shipping" element={<AdminShippingPage />} />
      </Route>

      {/* Fallback 404 */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center bg-white p-4 text-center">
            <div className="space-y-4">
              <h1 className="font-heading font-black text-6xl text-forme-primary">404</h1>
              <p className="text-sm text-forme-text-secondary">Halaman tidak ditemukan.</p>
              <a
                href="/"
                className="inline-block px-6 py-2.5 bg-forme-primary text-white text-xs font-semibold uppercase tracking-wider rounded-sm"
              >
                Kembali ke Beranda
              </a>
            </div>
          </div>
        }
      />
    </Routes>
  );
};
