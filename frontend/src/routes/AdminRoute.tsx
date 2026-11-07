import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-900">
        <LoadingSpinner message="Memverifikasi hak akses admin..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    const redirectUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirectUrl}`} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-forme-bg p-4 text-center">
        <div className="max-w-md bg-white p-8 border border-forme-border rounded-sm shadow-sm">
          <h2 className="font-heading font-bold text-xl text-forme-status-danger mb-2">
            Akses Ditolak (403 Forbidden)
          </h2>
          <p className="text-xs text-forme-text-secondary mb-6">
            Halaman ini khusus diperuntukkan bagi Administrator toko FORME. Akun Anda tidak memiliki
            izin untuk mengakses area ini.
          </p>
          <a
            href="/"
            className="inline-block bg-forme-primary text-white text-xs font-semibold px-5 py-2.5 uppercase tracking-wider rounded-sm hover:bg-neutral-800 transition-colors"
          >
            Kembali ke Beranda
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
