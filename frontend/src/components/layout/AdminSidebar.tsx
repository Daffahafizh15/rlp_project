import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  CreditCard,
  Truck,
  LogOut,
  Store,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminSidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Produk & Stok', path: '/admin/products', icon: Package },
    { name: 'Daftar Pesanan', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Verifikasi Pembayaran', path: '/admin/payments', icon: CreditCard },
    { name: 'Zona Pengiriman', path: '/admin/shipping', icon: Truck },
  ];

  return (
    <aside className="w-64 bg-forme-primary text-white flex flex-col justify-between shrink-0 min-h-screen border-r border-neutral-800">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-neutral-800">
          <span className="font-heading font-black text-xl tracking-[0.2em] text-white">
            FORME
          </span>
          <span className="ml-2 text-[10px] uppercase tracking-widest font-bold bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded-sm">
            Admin
          </span>
        </div>

        {/* User Info */}
        <div className="px-6 py-4 border-b border-neutral-800/60">
          <p className="text-xs font-semibold text-white truncate">{user?.fullName}</p>
          <p className="text-[11px] text-neutral-400 truncate">{user?.email}</p>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-sm text-xs font-medium tracking-wide transition-colors ${
                  isActive
                    ? 'bg-white text-forme-primary font-bold shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/80'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <item.icon size={16} />
                <span>{item.name}</span>
              </div>
              <ChevronRight size={14} className="opacity-40" />
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-neutral-800 space-y-2">
        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-neutral-400 hover:text-white hover:bg-neutral-800/60 rounded-sm transition-colors"
        >
          <Store size={15} />
          <span>Lihat Website Toko</span>
        </button>

        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-sm transition-colors"
        >
          <LogOut size={15} />
          <span>Keluar Akun</span>
        </button>
      </div>
    </aside>
  );
};
