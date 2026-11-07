import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatRupiah, getFullImageUrl } from '../../utils/formatters';
import { Button } from '../../components/common/Button';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';

export const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeItem, clearCart, isLoading } = useCart();
  const navigate = useNavigate();

  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const hasOutOfStockItems = items.some((i) => i.isOutOfStock || i.isQuantityExceeded);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto my-16 bg-white border border-forme-border p-12 text-center rounded-sm space-y-4">
        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-forme-text-secondary">
          <ShoppingBag size={28} />
        </div>
        <h2 className="font-heading font-bold text-xl text-forme-text-primary tracking-wide">
          Keranjang Belanja Kosong
        </h2>
        <p className="text-xs text-forme-text-secondary max-w-sm mx-auto leading-relaxed">
          Belum ada produk yang ditambahkan. Jelajahi katalog streetwear, casual, dan formal FORME
          untuk mulai berbelanja.
        </p>
        <div className="pt-2">
          <Button variant="primary" size="lg" onClick={() => navigate('/catalog')}>
            Jelajahi Katalog Produk
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-forme-border pb-6">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-forme-text-primary tracking-tight">
            Keranjang Belanja
          </h1>
          <p className="text-xs text-forme-text-secondary mt-1">
            {items.length} jenis item ({cart?.totalItems} produk)
          </p>
        </div>
        <button
          onClick={() => {
            if (window.confirm('Kosongkan seluruh keranjang belanja?')) {
              clearCart();
            }
          }}
          className="text-xs text-forme-status-danger hover:underline font-semibold"
        >
          Kosongkan Keranjang
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* LEFT: CART ITEMS LIST */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-forme-border p-4 sm:p-5 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-neutral-400"
            >
              {/* Product Info */}
              <div className="flex items-center gap-4 flex-1">
                <Link
                  to={`/products/${item.productSlug}`}
                  className="w-20 h-24 bg-neutral-100 rounded-sm overflow-hidden shrink-0 border border-forme-border"
                >
                  <img
                    src={getFullImageUrl(item.primaryImage)}
                    alt={item.productName}
                    className="w-full h-full object-cover object-center"
                  />
                </Link>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-forme-text-secondary">
                    {item.category}
                  </span>
                  <Link
                    to={`/products/${item.productSlug}`}
                    className="font-heading font-semibold text-sm text-forme-text-primary hover:underline block line-clamp-1"
                  >
                    {item.productName}
                  </Link>

                  <div className="flex items-center gap-2 text-xs text-forme-text-secondary">
                    <span>Warna: <strong className="text-forme-text-primary">{item.color}</strong></span>
                    <span>•</span>
                    <span>Size: <strong className="text-forme-text-primary">{item.size}</strong></span>
                  </div>

                  <p className="font-mono text-[11px] text-neutral-400">SKU: {item.sku}</p>

                  <p className="font-heading font-bold text-sm text-forme-text-primary pt-1">
                    {formatRupiah(item.price)}
                  </p>

                  {item.isOutOfStock && (
                    <p className="text-[11px] font-bold text-forme-status-danger">
                      Stok varian ini telah habis!
                    </p>
                  )}
                  {item.isQuantityExceeded && (
                    <p className="text-[11px] font-bold text-amber-600">
                      Stok tersisa hanya {item.stock} item.
                    </p>
                  )}
                </div>
              </div>

              {/* Quantity Controls & Subtotal */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                {/* Quantity Buttons */}
                <div className="inline-flex items-center border border-forme-border rounded-sm bg-neutral-50 h-9">
                  <button
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    disabled={item.quantity <= 1 || isLoading}
                    className="px-2.5 h-full text-forme-text-primary hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-forme-text-primary">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock || isLoading}
                    className="px-2.5 h-full text-forme-text-primary hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-forme-text-secondary uppercase tracking-wider block">
                    Subtotal
                  </span>
                  <span className="font-heading font-bold text-sm text-forme-text-primary">
                    {formatRupiah(item.subtotal)}
                  </span>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-neutral-400 hover:text-forme-status-danger transition-colors p-1"
                  title="Hapus Item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          <div className="pt-2">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-forme-text-secondary hover:text-forme-text-primary transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Tambah Produk Lainnya</span>
            </Link>
          </div>
        </div>

        {/* RIGHT: ORDER SUMMARY */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-forme-border p-6 rounded-sm shadow-sm space-y-6 sticky top-24">
            <h3 className="font-heading font-bold text-base text-forme-text-primary tracking-wide border-b border-forme-border pb-3">
              Ringkasan Belanja
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-forme-text-secondary">
                <span>Total Item Produk</span>
                <span className="font-semibold text-forme-text-primary">{cart?.totalItems} pcs</span>
              </div>
              <div className="flex justify-between text-forme-text-secondary">
                <span>Subtotal Produk</span>
                <span className="font-bold text-forme-text-primary text-sm">
                  {formatRupiah(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-forme-text-secondary">
                <span>Ongkos Kirim</span>
                <span className="text-neutral-500 italic">Dihitung di langkah checkout</span>
              </div>
            </div>

            <div className="border-t border-forme-border pt-4">
              <div className="flex justify-between items-baseline">
                <span className="font-heading font-bold text-sm text-forme-text-primary">
                  Perkiraan Total
                </span>
                <span className="font-heading font-black text-xl text-forme-text-primary">
                  {formatRupiah(subtotal)}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 mt-1">
                Belum termasuk tarif flat pengiriman zona alamat.
              </p>
            </div>

            {hasOutOfStockItems ? (
              <div className="p-3 bg-red-50 border border-red-200 text-forme-status-danger rounded-sm text-xs leading-relaxed">
                Terdapat produk yang stoknya habis atau kuantitas melebihi stok. Sesuaikan kuantitas
                terlebih dahulu untuk melanjutkan.
              </div>
            ) : (
              <Button
                variant="primary"
                size="lg"
                className="w-full gap-2 text-xs uppercase tracking-widest font-bold"
                onClick={() => navigate('/checkout')}
              >
                <span>Lanjut ke Checkout</span>
                <ArrowRight size={15} />
              </Button>
            )}

            <div className="text-[11px] text-forme-text-secondary space-y-1.5 pt-2 border-t border-neutral-100">
              <p>✓ Garansi pembayaran manual aman</p>
              <p>✓ Verifikasi langsung oleh admin FORME</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
