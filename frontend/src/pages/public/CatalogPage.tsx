import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { ProductCatalogItem, Category } from '../../types';
import { productsApi, categoriesApi } from '../../services/api';
import { ProductGrid } from '../../components/product/ProductGrid';

export const CatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState<ProductCatalogItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchInput, setSearchInput] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);

  // Sync state if URL query params change
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || '');
    setSearchInput(searchParams.get('search') || '');
    setPage(1);
  }, [searchParams]);

  const fetchCatalog = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productsApi.getCatalog({
        category: selectedCategory || undefined,
        search: searchInput.trim() || undefined,
        sort: sortBy,
        page,
        limit: 12,
      });

      setProducts(res.data.items);
      setTotalPages(res.data.pagination.totalPages);
      setTotalItems(res.data.pagination.totalItems);
    } catch (e) {
      console.error('Failed to load catalog', e);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchInput, sortBy, page]);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  useEffect(() => {
    categoriesApi.getAll().then((res) => setCategories(res.data)).catch(console.error);
  }, []);

  const handleCategoryClick = (slug: string) => {
    setSelectedCategory(slug);
    setPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (slug) {
      newParams.set('category', slug);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      newParams.set('search', searchInput.trim());
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const handleReset = () => {
    setSelectedCategory('');
    setSearchInput('');
    setSortBy('newest');
    setPage(1);
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-2 border-b border-forme-border pb-6">
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl tracking-tight text-forme-text-primary">
          Katalog Produk
        </h1>
        <p className="text-xs text-forme-text-secondary">
          Menampilkan {totalItems} koleksi busana esensial FORME
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          <button
            onClick={() => handleCategoryClick('')}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-sm whitespace-nowrap transition-colors ${
              selectedCategory === ''
                ? 'bg-forme-primary text-white shadow-sm'
                : 'bg-white text-forme-text-secondary border border-forme-border hover:text-forme-primary'
            }`}
          >
            Semua ({categories.reduce((acc, c) => acc + (c._count?.products || 0), 0)})
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.slug)}
                className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-sm whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-forme-primary text-white shadow-sm'
                    : 'bg-white text-forme-text-secondary border border-forme-border hover:text-forme-primary'
                }`}
              >
                {cat.name} ({cat._count?.products || 0})
              </button>
            );
          })}
        </div>

        {/* Search & Sort Dropdown */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-64">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Cari nama pakaian..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-forme-border rounded-sm focus:outline-none focus:border-forme-primary"
            />
            <Search size={14} className="absolute left-3 top-2.5 text-neutral-400" />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  const newParams = new URLSearchParams(searchParams);
                  newParams.delete('search');
                  setSearchParams(newParams);
                }}
                className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-neutral-600"
              >
                <X size={14} />
              </button>
            )}
          </form>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={14} className="text-forme-text-secondary shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="bg-white border border-forme-border text-xs px-3 py-2 rounded-sm focus:outline-none focus:border-forme-primary text-forme-text-primary"
            >
              <option value="newest">Terbaru</option>
              <option value="price_asc">Harga: Terendah</option>
              <option value="price_desc">Harga: Tertinggi</option>
              <option value="name_asc">Nama: A - Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <ProductGrid products={products} isLoading={loading} onResetFilter={handleReset} />

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 pt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-forme-border bg-white text-xs font-semibold uppercase tracking-wider rounded-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-50"
          >
            Sebelumnya
          </button>
          <span className="text-xs font-medium px-4 text-forme-text-secondary">
            Halaman {page} dari {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-forme-border bg-white text-xs font-semibold uppercase tracking-wider rounded-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-50"
          >
            Berikutnya
          </button>
        </div>
      )}
    </div>
  );
};
