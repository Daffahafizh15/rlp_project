import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AdminSidebar } from '../components/layout/AdminSidebar';

export const AdminLayout: React.FC = () => {
  const location = useLocation();

  const getPageTitle = () => {
    if (location.pathname === '/admin') return 'Overview Dashboard';
    if (location.pathname.startsWith('/admin/products')) return 'Manajemen Produk & Stok Varian';
    if (location.pathname.startsWith('/admin/orders')) return 'Daftar Pesanan & Status Pengiriman';
    if (location.pathname.startsWith('/admin/payments')) return 'Verifikasi Bukti Pembayaran';
    if (location.pathname.startsWith('/admin/shipping')) return 'Pengaturan Tarif Zona Pengiriman';
    return 'Admin Portal';
  };

  return (
    <div className="min-h-screen flex bg-neutral-100 text-forme-text-primary">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-neutral-200 px-8 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h1 className="font-heading font-bold text-lg text-forme-text-primary tracking-wide">
              {getPageTitle()}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-forme-text-secondary">
              FORME Official Store Management
            </span>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </header>

        {/* Admin Content Body */}
        <main className="p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
