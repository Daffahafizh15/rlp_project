import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, User as UserIcon, Search, Menu, X, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Katalog', path: '/catalog' },
    { name: 'Streetwear', path: '/catalog?category=streetwear' },
    { name: 'Casual', path: '/catalog?category=casual' },
    { name: 'Formal', path: '/catalog?category=formal' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-forme-border">
      {/* Top Brand Notification */}
      <div className="bg-forme-primary text-white text-[11px] font-medium tracking-widest text-center py-1.5 uppercase">
        DEFINE YOUR OWN STYLE — FREE SHIPPING SE-JABODETABEK FOR ALL ORDERS
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Mobile Menu & Nav Links */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-forme-text-primary p-1 focus:outline-none"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div className="hidden md:flex items-center space-x-7">
            {navLinks.map((link) => {
              const isActive = location.pathname + location.search === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-xs uppercase tracking-widest font-medium transition-colors hover:text-forme-primary ${
                    isActive ? 'text-forme-primary font-bold border-b border-forme-primary pb-0.5' : 'text-forme-text-secondary'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Center: Brand Logo */}
        <div className="flex flex-col items-center">
          <Link to="/" className="text-center group">
            <span className="font-heading font-extrabold text-2xl tracking-[0.25em] text-forme-primary group-hover:opacity-85 transition-opacity">
              FORME
            </span>
          </Link>
        </div>

        {/* Right: Actions (Search, Cart, Auth) */}
        <div className="flex items-center space-x-4 sm:space-x-5">
          {/* Search Trigger */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-forme-text-primary hover:text-neutral-600 transition-colors p-1.5"
            title="Cari Produk"
          >
            <Search size={19} />
          </button>

          {/* Cart Icon (Customer & Guest) */}
          <Link
            to="/cart"
            className="relative text-forme-text-primary hover:text-neutral-600 transition-colors p-1.5"
            title="Keranjang Belanja"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-forme-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>

          {/* Admin shortcut badge if logged in as Admin */}
          {isAdmin && (
            <Link
              to="/admin"
              className="hidden sm:inline-flex items-center gap-1.5 bg-neutral-900 text-white text-[11px] font-medium tracking-wider uppercase px-2.5 py-1 rounded-sm hover:bg-neutral-800 transition-colors"
            >
              <Shield size={13} />
              Admin
            </Link>
          )}

          {/* User Auth Menu */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-1.5 text-xs font-medium text-forme-text-primary hover:text-neutral-600 p-1.5 focus:outline-none"
              >
                <UserIcon size={19} />
                <span className="hidden lg:inline-block max-w-[120px] truncate">
                  {user?.fullName.split(' ')[0]}
                </span>
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white border border-forme-border shadow-lg py-1.5 z-50 rounded-sm"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-forme-border">
                    <p className="text-xs font-bold text-forme-text-primary truncate">{user?.fullName}</p>
                    <p className="text-[11px] text-forme-text-secondary truncate">{user?.email}</p>
                  </div>

                  {isAdmin ? (
                    <Link
                      to="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 text-xs text-forme-text-primary hover:bg-neutral-50 transition-colors"
                    >
                      Dashboard Admin
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 text-xs text-forme-text-primary hover:bg-neutral-50 transition-colors"
                      >
                        Pesanan Saya
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 text-xs text-forme-text-primary hover:bg-neutral-50 transition-colors"
                      >
                        Profil & Alamat
                      </Link>
                    </>
                  )}

                  <div className="border-t border-forme-border my-1"></div>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                      navigate('/login');
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-forme-status-danger hover:bg-red-50 transition-colors"
                  >
                    Keluar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="text-xs font-semibold tracking-wider uppercase text-forme-text-primary hover:text-neutral-500 px-2 py-1 transition-colors"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                className="hidden sm:inline-block bg-forme-primary text-white text-xs font-semibold tracking-wider uppercase px-3.5 py-1.5 rounded-sm hover:bg-neutral-800 transition-colors"
              >
                Daftar
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Expandable Search Bar */}
      {searchOpen && (
        <div className="border-t border-forme-border bg-white px-4 py-3 animate-fadeIn">
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex items-center gap-2">
            <Search size={18} className="text-forme-text-secondary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari produk oversized tee, hoodie, kemeja, blazer..."
              className="w-full text-sm bg-transparent border-none focus:outline-none text-forme-text-primary placeholder:text-forme-text-muted"
              autoFocus
            />
            <button
              type="submit"
              className="text-xs uppercase tracking-wider font-semibold bg-forme-primary text-white px-4 py-1.5 rounded-sm hover:bg-neutral-800"
            >
              Cari
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="text-forme-text-secondary hover:text-forme-text-primary p-1"
            >
              <X size={18} />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-forme-border bg-white px-4 pt-3 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm uppercase tracking-wider font-medium text-forme-text-primary py-2 border-b border-neutral-100"
            >
              {link.name}
            </Link>
          ))}
          {!isAuthenticated && (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center w-full py-2.5 text-xs font-bold uppercase tracking-wider border border-forme-border"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center w-full py-2.5 text-xs font-bold uppercase tracking-wider bg-forme-primary text-white"
              >
                Daftar Akun Baru
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
