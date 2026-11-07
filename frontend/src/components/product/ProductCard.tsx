import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductCatalogItem } from '../../types';
import { formatRupiah, getFullImageUrl } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight, Lock } from 'lucide-react';

interface ProductCardProps {
  product: ProductCatalogItem;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleViewDetail = () => {
    if (!isAuthenticated) {
      // Direct guest to login while preserving target product detail URL
      navigate(`/login?redirect=/products/${product.slug}`);
    } else {
      navigate(`/products/${product.slug}`);
    }
  };

  return (
    <div className="group bg-white border border-forme-border rounded-sm overflow-hidden flex flex-col transition-all duration-300 hover:shadow-md hover:border-neutral-400">
      {/* Product Image Container */}
      <div
        className="relative aspect-[3/4] w-full bg-neutral-100 overflow-hidden cursor-pointer"
        onClick={handleViewDetail}
      >
        <img
          src={getFullImageUrl(product.primaryImage)}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Category Pill */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-forme-text-primary text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-sm shadow-sm">
          {product.category.name}
        </span>

        {/* Stock Status Badge */}
        {!product.inStock && (
          <span className="absolute top-3 right-3 bg-neutral-900/90 backdrop-blur-sm text-white text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded-sm">
            Habis
          </span>
        )}

        {/* Guest Lock Indicator on Hover */}
        {!isAuthenticated && (
          <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-4 text-center">
            <Lock size={20} className="mb-2" />
            <p className="text-xs font-semibold uppercase tracking-wider">Login untuk Melihat Detail</p>
            <span className="text-[10px] text-neutral-300 mt-0.5">Varian, stok & spesifikasi bahan</span>
          </div>
        )}
      </div>

      {/* Product Details Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3
            onClick={handleViewDetail}
            className="font-heading font-medium text-sm text-forme-text-primary hover:text-neutral-600 transition-colors cursor-pointer line-clamp-1 tracking-wide"
            title={product.name}
          >
            {product.name}
          </h3>

          <p className="font-heading font-bold text-base text-forme-text-primary mt-1 tracking-tight">
            {formatRupiah(product.basePrice)}
          </p>

          {/* Available Sizes Pills */}
          <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-forme-text-secondary uppercase tracking-wider font-semibold mr-1">
              Size:
            </span>
            {product.availableSizes.slice(0, 5).map((size) => (
              <span
                key={size}
                className="text-[10px] font-medium border border-neutral-200 px-1.5 py-0.5 text-neutral-600 rounded-sm bg-neutral-50"
              >
                {size}
              </span>
            ))}
          </div>
        </div>

        {/* View Detail Action Button */}
        <div className="mt-4 pt-3 border-t border-neutral-100">
          <button
            onClick={handleViewDetail}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs uppercase tracking-wider font-semibold transition-all rounded-sm border border-forme-primary text-forme-primary group-hover:bg-forme-primary group-hover:text-white"
          >
            {!isAuthenticated ? (
              <>
                <Lock size={13} />
                <span>Login untuk Detail</span>
              </>
            ) : (
              <>
                <span>Lihat Detail</span>
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
