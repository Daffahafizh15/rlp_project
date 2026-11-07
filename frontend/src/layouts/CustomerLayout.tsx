import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ShoppingBag, User, MapPin } from 'lucide-react';

export const CustomerLayout: React.FC = () => {
  const location = useLocation();

  const customerTabs = [
    { name: 'Pesanan Saya', path: '/orders', icon: ShoppingBag },
    { name: 'Profil & Alamat', path: '/profile', icon: User },
    { name: 'Keranjang', path: '/cart', icon: MapPin },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-forme-bg text-forme-text-primary selection:bg-forme-primary selection:text-white">
      <Navbar />

      {/* Customer Sub-Navigation Header */}
      <div className="bg-white border-b border-forme-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {customerTabs.map((tab) => {
              const isActive = location.pathname === tab.path;
              return (
                <Link
                  key={tab.path}
                  to={tab.path}
                  className={`py-3.5 px-1 border-b-2 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2 ${
                    isActive
                      ? 'border-forme-primary text-forme-primary'
                      : 'border-transparent text-forme-text-secondary hover:text-forme-text-primary'
                  }`}
                >
                  <tab.icon size={15} />
                  <span>{tab.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};
