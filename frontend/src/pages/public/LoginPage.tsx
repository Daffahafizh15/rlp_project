import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { InputField } from '../../components/common/InputField';
import { Button } from '../../components/common/Button';
import { Lock, Info, Shield, User } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isFromProductDetail = redirectTarget.startsWith('/products/');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const loggedUser = await login(email, password);

      // If admin and no explicit customer target, navigate to admin dashboard
      if (loggedUser.role === 'ADMIN' && redirectTarget === '/') {
        navigate('/admin');
      } else {
        navigate(redirectTarget);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login gagal. Periksa kembali email dan password Anda.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 border border-forme-border rounded-sm shadow-sm">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block">
            <span className="font-heading font-black text-3xl tracking-[0.25em] text-forme-primary">
              FORME
            </span>
          </Link>
          <h2 className="font-heading font-bold text-xl text-forme-text-primary tracking-wide">
            Masuk ke Akun Anda
          </h2>
          <p className="text-xs text-forme-text-secondary">
            Akses detail varian produk, keranjang belanja, dan pesanan Anda.
          </p>
        </div>

        {/* Notice if redirected from Product Detail */}
        {isFromProductDetail && (
          <div className="p-3.5 bg-neutral-900 text-white rounded-sm flex items-start gap-3 text-xs leading-relaxed animate-fadeIn">
            <Lock size={16} className="shrink-0 mt-0.5 text-neutral-300" />
            <div>
              <span className="font-bold block uppercase tracking-wider text-[11px]">
                Akses Detail Produk Terproteksi
              </span>
              Silakan login atau daftar akun untuk melihat varian lengkap, ketersediaan stok, dan memesan produk ini.
            </div>
          </div>
        )}

        {/* Error message alert */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-forme-status-danger rounded-sm text-xs flex items-center gap-2">
            <Info size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            label="Alamat Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@email.com"
            required
          />

          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={loading}>
            Masuk Sekarang
          </Button>
        </form>

        {/* Quick Demo Credentials for Reviewers */}
        <div className="pt-4 border-t border-neutral-100 space-y-2.5">
          <p className="text-[11px] text-forme-text-secondary uppercase tracking-widest font-semibold text-center">
            Akses Cepat Demo:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('customer@forme.com', 'CustomerFORME2026!')}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-neutral-50 hover:bg-neutral-100 border border-forme-border rounded-sm text-[11px] font-medium text-forme-text-primary transition-colors"
            >
              <User size={13} />
              <span>Customer Demo</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin@forme.com', 'AdminFORME2026!')}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-neutral-50 hover:bg-neutral-100 border border-forme-border rounded-sm text-[11px] font-medium text-forme-text-primary transition-colors"
            >
              <Shield size={13} />
              <span>Admin Demo</span>
            </button>
          </div>
        </div>

        {/* Register Link */}
        <div className="text-center pt-2">
          <p className="text-xs text-forme-text-secondary">
            Belum memiliki akun FORME?{' '}
            <Link
              to={`/register?redirect=${encodeURIComponent(redirectTarget)}`}
              className="font-bold text-forme-primary hover:underline"
            >
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
