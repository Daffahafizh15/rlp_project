import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-forme-primary text-white pt-16 pb-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <span className="font-heading font-extrabold text-2xl tracking-[0.25em] text-white">
              FORME
            </span>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              Define Your Own Style. Menghadirkan esensi fashion modern dengan potongan presisi,
              kain berkelas, dan kesederhanaan abadi.
            </p>
            <div className="pt-2">
              <span className="text-[11px] text-neutral-500 uppercase tracking-widest">
                Jakarta, Indonesia
              </span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-heading font-semibold text-xs uppercase tracking-widest text-neutral-200 mb-4">
              Koleksi
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link to="/catalog?category=streetwear" className="hover:text-white transition-colors">
                  Streetwear
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=casual" className="hover:text-white transition-colors">
                  Casual
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=formal" className="hover:text-white transition-colors">
                  Formal
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="hover:text-white transition-colors">
                  Semua Produk
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-heading font-semibold text-xs uppercase tracking-widest text-neutral-200 mb-4">
              Layanan Pelanggan
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link to="/orders" className="hover:text-white transition-colors">
                  Lacak Pesanan
                </Link>
              </li>
              <li>
                <span className="text-neutral-400">Metode Pembayaran (BCA & QRIS)</span>
              </li>
              <li>
                <span className="text-neutral-400">Zona Tarif Pengiriman Tetap</span>
              </li>
              <li>
                <span className="text-neutral-400">Panduan Ukuran (S - XXL)</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / Brand Note */}
          <div>
            <h4 className="font-heading font-semibold text-xs uppercase tracking-widest text-neutral-200 mb-4">
              Komitmen Kualitas
            </h4>
            <p className="text-xs text-neutral-400 font-light leading-relaxed mb-4">
              Seluruh garmen FORME diproduksi dengan standar jahitan ganda (*double-needle stitching*)
              dan material pilihan berkepadatan tinggi.
            </p>
            <div className="inline-block border border-neutral-700 px-3 py-1.5 rounded-sm text-[11px] text-neutral-300">
              Bebas Repot • 100% Produk Asli
            </div>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} FORME Fashion. Hak Cipta Dilindungi.</p>
          <p className="tracking-widest uppercase">Clean • Minimal • Sophisticated</p>
        </div>
      </div>
    </footer>
  );
};
