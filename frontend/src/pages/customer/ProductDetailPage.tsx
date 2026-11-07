import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProductDetail, ProductVariant } from '../../types';
import { productsApi } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { formatRupiah, getFullImageUrl } from '../../utils/formatters';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Button } from '../../components/common/Button';
import {
  ShoppingBag,
  Check,
  Truck,
  ShieldCheck,
  RotateCcw,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Selected State
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [addingToCart, setAddingToCart] = useState<boolean>(false);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!slug) return;
      setLoading(true);
      setError(null);
      try {
        const res = await productsApi.getDetail(slug);
        const data = res.data;
        setProduct(data);

        // Set default gallery image
        if (data.images && data.images.length > 0) {
          const primary = data.images.find((img) => img.isPrimary) || data.images[0];
          setSelectedImage(primary.imageUrl);
        }

        // Set initial color and size if variants exist
        if (data.variants && data.variants.length > 0) {
          setSelectedColor(data.variants[0].color);
          setSelectedSize(data.variants[0].size);
        }
      } catch (err: any) {
        if (err.response?.status === 401) {
          navigate(`/login?redirect=/products/${slug}`);
        } else {
          setError(err.response?.data?.message || 'Gagal memuat detail produk');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [slug, navigate]);

  if (loading) {
    return <LoadingSpinner message="Memuat detail produk FORME..." className="min-h-[70vh]" />;
  }

  if (error || !product) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white border border-forme-border text-center rounded-sm">
        <AlertCircle size={32} className="mx-auto text-forme-status-danger mb-3" />
        <h3 className="font-heading font-bold text-lg text-forme-text-primary mb-1">
          Produk Tidak Ditemukan
        </h3>
        <p className="text-xs text-forme-text-secondary mb-6">{error || 'Data produk tidak tersedia.'}</p>
        <Button variant="primary" onClick={() => navigate('/catalog')}>
          Kembali ke Katalog
        </Button>
      </div>
    );
  }

  // Derive unique colors and sizes from active variants
  const availableColors = Array.from(new Set(product.variants.map((v) => v.color)));
  const availableSizesForColor = Array.from(
    new Set(product.variants.filter((v) => v.color === selectedColor).map((v) => v.size)),
  );

  // Find exact matching variant
  const currentVariant: ProductVariant | undefined = product.variants.find(
    (v) => v.color === selectedColor && v.size === selectedSize,
  );

  const currentStock = currentVariant ? currentVariant.stock : 0;
  const isOutOfStock = currentStock <= 0;
  const currentPrice = currentVariant ? currentVariant.price : product.basePrice;

  const handleAddToCart = async () => {
    if (!currentVariant || isOutOfStock) return;
    setAddingToCart(true);
    try {
      await addItem(currentVariant.id, quantity);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 3000);
    } catch (e: any) {
      alert(e.response?.data?.message || 'Gagal menambahkan ke keranjang');
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-forme-text-secondary hover:text-forme-text-primary transition-colors"
      >
        <ArrowLeft size={14} />
        <span>Kembali</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* LEFT: PHOTO GALLERY */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible shrink-0 pb-2 sm:pb-0">
            {product.images.map((img) => (
              <button
                key={img.id}
                onClick={() => setSelectedImage(img.imageUrl)}
                className={`w-16 h-20 sm:w-20 sm:h-24 overflow-hidden rounded-sm border transition-all ${
                  selectedImage === img.imageUrl
                    ? 'border-forme-primary ring-1 ring-forme-primary'
                    : 'border-forme-border hover:border-neutral-400 opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={getFullImageUrl(img.imageUrl)}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
              </button>
            ))}
          </div>

          {/* Main Large Image */}
          <div className="flex-1 aspect-[3/4] bg-neutral-100 rounded-sm overflow-hidden border border-forme-border">
            <img
              src={getFullImageUrl(selectedImage)}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>

        {/* RIGHT: PRODUCT INFO & VARIANT SELECTOR */}
        <div className="lg:col-span-5 space-y-6">
          {/* Category & Title */}
          <div className="space-y-2 border-b border-forme-border pb-5">
            <span className="text-[11px] font-bold uppercase tracking-widest text-forme-text-secondary">
              {product.category.name}
            </span>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-forme-text-primary tracking-tight">
              {product.name}
            </h1>
            <p className="font-heading font-black text-2xl text-forme-text-primary pt-1">
              {formatRupiah(currentPrice)}
            </p>
          </div>

          {/* 1. COLOR SELECTOR */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="uppercase tracking-wider font-semibold text-forme-text-primary">
                Pilih Warna: <span className="font-bold">{selectedColor}</span>
              </span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {availableColors.map((color) => {
                const isSelected = selectedColor === color;
                return (
                  <button
                    key={color}
                    onClick={() => {
                      setSelectedColor(color);
                      // Auto-select first available size for this color if current size not available
                      const sizesForColor = product.variants
                        .filter((v) => v.color === color)
                        .map((v) => v.size);
                      if (!sizesForColor.includes(selectedSize) && sizesForColor.length > 0) {
                        setSelectedSize(sizesForColor[0]);
                      }
                    }}
                    className={`px-4 py-2 text-xs uppercase tracking-wider font-medium rounded-sm border transition-all ${
                      isSelected
                        ? 'border-forme-primary bg-forme-primary text-white shadow-sm'
                        : 'border-forme-border bg-white text-forme-text-primary hover:border-neutral-400'
                    }`}
                  >
                    {color}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. SIZE SELECTOR */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="uppercase tracking-wider font-semibold text-forme-text-primary">
                Pilih Ukuran: <span className="font-bold">{selectedSize}</span>
              </span>
              <span className="text-neutral-500 text-[11px]">S • M • L • XL • XXL</span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {['S', 'M', 'L', 'XL', 'XXL'].map((size) => {
                const isAvailable = availableSizesForColor.includes(size);
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    disabled={!isAvailable}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-11 text-xs font-semibold uppercase tracking-wider rounded-sm border transition-all flex items-center justify-center ${
                      isSelected
                        ? 'border-forme-primary bg-forme-primary text-white shadow-sm'
                        : isAvailable
                          ? 'border-forme-border bg-white text-forme-text-primary hover:border-neutral-400'
                          : 'border-neutral-200 bg-neutral-100 text-neutral-400 cursor-not-allowed line-through'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. STOCK INDICATOR */}
          <div className="p-3 bg-neutral-50 border border-forme-border rounded-sm flex items-center justify-between text-xs">
            <div>
              <span className="text-forme-text-secondary">Status Ketersediaan:</span>
              <span
                className={`ml-2 font-bold ${
                  isOutOfStock ? 'text-forme-status-danger' : 'text-forme-status-success'
                }`}
              >
                {isOutOfStock ? 'Stok Habis' : `Tersedia (${currentStock} item)`}
              </span>
            </div>
            {currentVariant && (
              <span className="text-[10px] text-neutral-400 font-mono tracking-wider">
                SKU: {currentVariant.sku}
              </span>
            )}
          </div>

          {/* 4. QUANTITY & ADD TO CART */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Quantity Modifier */}
              <div className="inline-flex items-center border border-forme-border bg-white rounded-sm h-12">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="px-3.5 h-full text-forme-text-primary hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-sm text-forme-text-primary">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
                  disabled={quantity >= currentStock || isOutOfStock}
                  className="px-3.5 h-full text-forme-text-primary hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <Button
                variant="primary"
                size="lg"
                className="flex-1 h-12 gap-2 text-xs uppercase tracking-widest font-bold"
                onClick={handleAddToCart}
                disabled={isOutOfStock || !currentVariant}
                isLoading={addingToCart}
              >
                {addedSuccess ? (
                  <>
                    <Check size={16} className="text-emerald-400" />
                    <span>Berhasil Ditambahkan!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    <span>{isOutOfStock ? 'Stok Habis' : 'Tambah ke Keranjang'}</span>
                  </>
                )}
              </Button>
            </div>

            {addedSuccess && (
              <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-sm text-xs animate-fadeIn">
                <span>Produk telah masuk ke keranjang belanja Anda.</span>
                <button
                  onClick={() => navigate('/cart')}
                  className="font-bold underline uppercase tracking-wider text-[11px]"
                >
                  Buka Keranjang
                </button>
              </div>
            )}
          </div>

          {/* 5. DESCRIPTION & FABRIC DETAILS */}
          <div className="border-t border-forme-border pt-6 space-y-4">
            <h4 className="font-heading font-semibold text-xs uppercase tracking-widest text-forme-text-primary">
              Deskripsi & Spesifikasi
            </h4>
            <div className="text-xs text-forme-text-secondary leading-relaxed space-y-2 whitespace-pre-line">
              {product.description}
            </div>
          </div>

          {/* Guarantees */}
          <div className="border-t border-forme-border pt-6 grid grid-cols-2 gap-4 text-xs text-forme-text-secondary">
            <div className="flex items-center gap-2">
              <Truck size={16} className="text-forme-primary shrink-0" />
              <span>Flat Shipping Se-Indonesia</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-forme-primary shrink-0" />
              <span>100% Produk Original FORME</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw size={16} className="text-forme-primary shrink-0" />
              <span>Jaminan Retur Cacat Produk</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
