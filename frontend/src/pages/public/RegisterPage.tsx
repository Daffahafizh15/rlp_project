import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { InputField } from '../../components/common/InputField';
import { Button } from '../../components/common/Button';
import { Info } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak cocok');
      return;
    }

    if (password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    setLoading(true);
    try {
      await register(fullName, email, password, phone);
      navigate(redirectTarget);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Registrasi gagal. Silakan coba kembali.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 border border-forme-border rounded-sm shadow-sm">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block">
            <span className="font-heading font-black text-3xl tracking-[0.25em] text-forme-primary">
              FORME
            </span>
          </Link>
          <h2 className="font-heading font-bold text-xl text-forme-text-primary tracking-wide">
            Buat Akun Customer
          </h2>
          <p className="text-xs text-forme-text-secondary">
            Bergabunglah untuk memesan koleksi eksklusif streetwear, casual, dan formal.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-forme-status-danger rounded-sm text-xs flex items-center gap-2">
            <Info size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Nama Lengkap"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Ahmad Pratama"
            required
          />

          <InputField
            label="Alamat Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@email.com"
            required
          />

          <InputField
            label="Nomor WhatsApp / HP"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="081234567890"
          />

          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimal 6 karakter"
            required
          />

          <InputField
            label="Konfirmasi Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Ketik ulang password"
            required
          />

          <Button type="submit" variant="primary" size="lg" className="w-full mt-2" isLoading={loading}>
            Daftar Sekarang
          </Button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-forme-text-secondary">
            Sudah memiliki akun?{' '}
            <Link
              to={`/login?redirect=${encodeURIComponent(redirectTarget)}`}
              className="font-bold text-forme-primary hover:underline"
            >
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
