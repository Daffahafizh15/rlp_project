import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Sparkles } from 'lucide-react';
import { ProductCatalogItem, Category } from '../../types';
import { productsApi, categoriesApi } from '../../services/api';
import { ProductGrid } from '../../components/product/ProductGrid';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState<ProductCatalogItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          productsApi.getCatalog({ limit: 4 }),
          categoriesApi.getAll(),
        ]);
        setFeaturedProducts(prodRes.data.items);
        setCategories(catRes.data);
      } catch (e) {
        console.error('Failed to load landing data', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative bg-forme-primary text-white overflow-hidden min-h-[580px] sm:min-h-[640px] flex items-center">
        {/* Subtle Background Image Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop')",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10 w-full">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold tracking-widest uppercase text-neutral-300">
              <Sparkles size={14} className="text-amber-400" />
              Koleksi Terbaru 2026
            </div>

            <h1 className="font-heading font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-none">
              DEFINE YOUR OWN STYLE.
            </h1>

            <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed max-w-xl">
              Gaya bukan tentang mengikuti keramaian, melainkan keberanian mengekspresikan diri
              lewat potongan bersih, proporsi modern, dan kualitas bahan tanpa kompromi.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate('/catalog')}
                className="inline-flex items-center gap-2 bg-white text-forme-primary px-8 py-3.5 text-xs uppercase tracking-widest font-bold rounded-sm hover:bg-neutral-200 transition-all shadow-lg"
              >
                <span>Belanja Sekarang</span>
                <ArrowRight size={15} />
              </button>

              <button
                onClick={() => navigate('/catalog?category=streetwear')}
                className="inline-flex items-center gap-2 border border-white/50 text-white px-7 py-3.5 text-xs uppercase tracking-widest font-semibold rounded-sm hover:bg-white/10 transition-colors"
              >
                Eksplor Streetwear
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-6 border-y border-forme-border">
          <div className="flex items-start gap-4 p-2">
            <div className="p-3 bg-white border border-forme-border rounded-sm text-forme-primary">
              <Truck size={22} />
            </div>
            <div>
              <h4 className="font-heading font-semibold text-sm tracking-wide">
                Tarif Pengiriman Flat Tetap
              </h4>
              <p className="text-xs text-forme-text-secondary mt-1 leading-relaxed">
                Ongkir transparan mulai Rp15.000 se-Jabodetabek tanpa lonjakan tarif dinamis.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-2">
            <div className="p-3 bg-white border border-forme-border rounded-sm text-forme-primary">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h4 className="font-heading font-semibold text-sm tracking-wide">
                100% Garansi Material Pilihan
              </h4>
              <p className="text-xs text-forme-text-secondary mt-1 leading-relaxed">
                Supima cotton, french linen, dan heavy fleece dengan ketahanan warna jangka panjang.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-2">
            <div className="p-3 bg-white border border-forme-border rounded-sm text-forme-primary">
              <RefreshCw size={22} />
            </div>
            <div>
              <h4 className="font-heading font-semibold text-sm tracking-wide">
                Kemudahan Pembayaran Manual
              </h4>
              <p className="text-xs text-forme-text-secondary mt-1 leading-relaxed">
                Transfer langsung ke rekening resmi BCA atau scan QRIS instan dari aplikasi e-wallet apa saja.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORY SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-forme-text-secondary">
            Katalog Berdasarkan Kebutuhan
          </span>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl tracking-tight text-forme-text-primary">
            Tiga Dimensi FORME
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Streetwear */}
          <div
            onClick={() => navigate('/catalog?category=streetwear')}
            className="group relative h-96 overflow-hidden rounded-sm cursor-pointer border border-forme-border"
          >
            <img
              src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1000&auto=format&fit=crop"
              alt="Streetwear"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/90 via-neutral-900/30 to-transparent flex flex-col justify-end p-6 text-white">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-300">
                Urban Fit
              </span>
              <h3 className="font-heading font-bold text-xl tracking-wide mt-1">Streetwear</h3>
              <p className="text-xs text-neutral-300 mt-1 line-clamp-2">
                Oversized T-Shirt, Boxy Hoodie, dan Acid Wash Graphic Tee.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white group-hover:translate-x-1 transition-transform">
                <span>Lihat Koleksi</span>
                <ArrowRight size={14} />
              </div>
            </div>
          </div>

          {/* Casual */}
          <div
            onClick={() => navigate('/catalog?category=casual')}
            className="group relative h-96 overflow-hidden rounded-sm cursor-pointer border border-forme-border"
          >
            <img
              src="https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=1000&auto=format&fit=crop"
              alt="Casual"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/90 via-neutral-900/30 to-transparent flex flex-col justify-end p-6 text-white">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-300">
                Daily Essentials
              </span>
              <h3 className="font-heading font-bold text-xl tracking-wide mt-1">Casual</h3>
              <p className="text-xs text-neutral-300 mt-1 line-clamp-2">
                Kaos Supima, Kemeja Linen Camp Collar, dan Celana Chino Pleated.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white group-hover:translate-x-1 transition-transform">
                <span>Lihat Koleksi</span>
                <ArrowRight size={14} />
              </div>
            </div>
          </div>

          {/* Formal */}
          <div
            onClick={() => navigate('/catalog?category=formal')}
            className="group relative h-96 overflow-hidden rounded-sm cursor-pointer border border-forme-border"
          >
            <img
              src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1000&auto=format&fit=crop"
              alt="Formal"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/90 via-neutral-900/30 to-transparent flex flex-col justify-end p-6 text-white">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-300">
                Elevated Tailoring
              </span>
              <h3 className="font-heading font-bold text-xl tracking-wide mt-1">Formal</h3>
              <p className="text-xs text-neutral-300 mt-1 line-clamp-2">
                Tailored Blazer, Kemeja Oxford Slim, dan Celana Bahan Tapered.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white group-hover:translate-x-1 transition-transform">
                <span>Lihat Koleksi</span>
                <ArrowRight size={14} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-forme-text-secondary">
              Pilihan Teratas
            </span>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl tracking-tight text-forme-text-primary mt-1">
              Produk Unggulan FORME
            </h2>
          </div>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-forme-primary hover:text-neutral-600 transition-colors"
          >
            <span>Lihat Semua ({featuredProducts.length}+)</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <ProductGrid products={featuredProducts} isLoading={loading} />
      </section>

      {/* 5. BRAND PHILOSOPHY SECTION */}
      <section className="bg-white border-y border-forme-border py-20">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-forme-text-secondary">
            Filosofi Desain
          </span>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-forme-text-primary tracking-tight">
            "Kesederhanaan adalah bentuk tertinggi dari keanggunan."
          </h2>
          <p className="text-sm text-forme-text-secondary leading-relaxed font-light">
            FORME lahir dari penolakan terhadap fashion yang berlebihan dan tren musiman yang cepat usang.
            Setiap busana dirancang dengan potongan arsitektural yang abadi, jahitan presisi, dan pemilihan
            material yang nyaman dikenakan dari pagi hingga malam hari.
          </p>
          <div className="pt-2">
            <Link
              to="/catalog"
              className="inline-block bg-forme-primary text-white text-xs uppercase tracking-widest font-semibold px-8 py-3 rounded-sm hover:bg-neutral-800 transition-colors"
            >
              Jelajahi Koleksi Lengkap
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
