import React from 'react';
import { ProductCatalogItem } from '../../types';
import { ProductCard } from './ProductCard';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface ProductGridProps {
  products: ProductCatalogItem[];
  isLoading: boolean;
  onResetFilter?: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading,
  onResetFilter,
}) => {
  if (isLoading) {
    return <LoadingSpinner message="Memuat katalog produk FORME..." className="py-24" />;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-24 bg-white border border-forme-border rounded-sm p-8">
        <h4 className="font-heading font-semibold text-base text-forme-text-primary tracking-wide">
          Tidak Ada Produk yang Ditemukan
        </h4>
        <p className="text-xs text-forme-text-secondary mt-1.5 max-w-sm mx-auto">
          Coba gunakan kata kunci pencarian lain atau pilih kategori yang berbeda.
        </p>
        {onResetFilter && (
          <button
            onClick={onResetFilter}
            className="mt-5 text-xs font-semibold uppercase tracking-wider bg-forme-primary text-white px-5 py-2.5 rounded-sm hover:bg-neutral-800 transition-colors"
          >
            Reset Semua Filter
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
