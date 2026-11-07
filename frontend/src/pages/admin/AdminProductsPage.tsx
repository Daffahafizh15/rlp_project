import React, { useEffect, useState } from 'react';
import { ProductCatalogItem, Category } from '../../types';
import { productsApi, categoriesApi } from '../../services/api';
import { formatRupiah, getFullImageUrl } from '../../utils/formatters';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { InputField } from '../../components/common/InputField';
import { Plus, Trash2, Edit3, Package, Check, RefreshCw } from 'lucide-react';

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<ProductCatalogItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Product Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [basePrice, setBasePrice] = useState<number>(189000);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [colorInput, setColorInput] = useState('Black');
  const [sizesInput, setSizesInput] = useState('S,M,L,XL');
  const [initialStock, setInitialStock] = useState<number>(20);
  const [savingProduct, setSavingProduct] = useState(false);

  // Quick Stock Edit Modal
  const [stockModalProduct, setStockModalProduct] = useState<any | null>(null);
  const [updatingStock, setUpdatingStock] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        productsApi.getCatalog({ limit: 50 }),
        categoriesApi.getAll(),
      ]);
      setProducts(prodRes.data.items);
      setCategories(catRes.data);
      if (catRes.data.length > 0) {
        setCategoryId(catRes.data[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProduct(true);
    try {
      // Build variants based on color and sizes
      const sizes = sizesInput.split(',').map((s) => s.trim().toUpperCase()).filter(Boolean);
      const prefix = name.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, 'PRD');
      const colorCode = colorInput.slice(0, 3).toUpperCase();

      const variants = sizes.map((s) => ({
        sku: `${prefix}-${colorCode}-${s}-${Date.now().toString().slice(-4)}`,
        size: s,
        color: colorInput.trim(),
        price: basePrice,
        stock: initialStock,
      }));

      await productsApi.createProduct({
        categoryId,
        name: name.trim(),
        description: description.trim(),
        basePrice,
        images: imageUrl ? [{ imageUrl: imageUrl.trim(), isPrimary: true, sortOrder: 0 }] : [],
        variants,
      });

      await fetchData();
      setIsAddModalOpen(false);
      setName('');
      setDescription('');
      setImageUrl('');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menambahkan produk');
    } finally {
      setSavingProduct(false);
    }
  };

  const handleOpenStockModal = async (productId: string) => {
    try {
      const res = await productsApi.getDetail(productId);
      setStockModalProduct(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateVariantStock = async (variantId: string, currentStock: number) => {
    const input = prompt('Masukkan jumlah stok baru:', currentStock.toString());
    if (input === null) return;
    const newStock = parseInt(input, 10);
    if (isNaN(newStock) || newStock < 0) {
      alert('Stok harus berupa angka positif');
      return;
    }

    setUpdatingStock(true);
    try {
      await productsApi.updateVariantStock(variantId, newStock);
      // Refresh modal
      if (stockModalProduct) {
        const res = await productsApi.getDetail(stockModalProduct.id);
        setStockModalProduct(res.data);
      }
      await fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal mengubah stok');
    } finally {
      setUpdatingStock(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Hapus atau nonaktifkan produk "${name}"?`)) return;
    try {
      await productsApi.deleteProduct(id);
      await fetchData();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Gagal menghapus produk');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Memuat daftar inventaris produk..." className="py-24" />;
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 border border-neutral-200 rounded-sm shadow-sm">
        <div>
          <h2 className="font-heading font-bold text-lg text-forme-text-primary">
            Daftar Produk & Inventaris Stok
          </h2>
          <p className="text-xs text-forme-text-secondary mt-0.5">
            Kelola produk, varian ukuran, warna, dan stok aktif toko FORME
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          className="gap-2 text-xs uppercase tracking-wider font-bold"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={16} />
          <span>Tambah Produk Baru</span>
        </Button>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-neutral-200 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-6">Produk</th>
                <th className="py-3.5 px-6">Kategori</th>
                <th className="py-3.5 px-6">Harga Dasar</th>
                <th className="py-3.5 px-6">Varian Ukuran</th>
                <th className="py-3.5 px-6 text-center">Total Stok</th>
                <th className="py-3.5 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-50/80 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={getFullImageUrl(p.primaryImage)}
                        alt={p.name}
                        className="w-10 h-12 object-cover rounded-sm border shrink-0"
                      />
                      <div>
                        <span className="font-semibold text-forme-text-primary block text-sm">
                          {p.name}
                        </span>
                        <span className="text-[11px] text-neutral-400 font-mono">/{p.slug}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <span className="px-2 py-0.5 bg-neutral-100 text-neutral-800 rounded-sm font-semibold uppercase text-[10px]">
                      {p.category.name}
                    </span>
                  </td>

                  <td className="py-4 px-6 font-bold text-forme-text-primary">
                    {formatRupiah(p.basePrice)}
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1">
                      {p.availableSizes.map((s) => (
                        <span
                          key={s}
                          className="px-1.5 py-0.5 bg-neutral-100 text-neutral-600 rounded-sm text-[10px]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="py-4 px-6 text-center">
                    <span
                      className={`inline-block font-bold px-2.5 py-0.5 rounded-full text-xs ${
                        p.totalStock <= 5
                          ? 'bg-red-50 text-red-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {p.totalStock} pcs
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenStockModal(p.id)}
                        className="p-1.5 text-neutral-600 hover:text-forme-primary hover:bg-neutral-100 rounded-sm transition-colors"
                        title="Kelola Stok Varian"
                      >
                        <Package size={15} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id, p.name)}
                        className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors"
                        title="Hapus / Nonaktifkan"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: ADD PRODUCT */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Tambah Produk Baru FORME"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold tracking-wider text-forme-text-primary uppercase mb-1.5">
                Kategori
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full p-2.5 bg-white border border-forme-border rounded-sm text-xs focus:outline-none focus:border-forme-primary"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <InputField
              label="Harga Dasar (Rp)"
              type="number"
              value={basePrice}
              onChange={(e) => setBasePrice(Number(e.target.value))}
              required
            />
          </div>

          <InputField
            label="Nama Produk"
            placeholder="e.g. Heavyweight Boxy T-Shirt"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-semibold tracking-wider text-forme-text-primary uppercase mb-1.5">
              Deskripsi Produk & Fitting
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan bahan, gramasi kain (GSM), dan instruksi pencucian..."
              className="w-full p-2.5 bg-white border border-forme-border rounded-sm text-xs focus:outline-none focus:border-forme-primary"
              required
            />
          </div>

          <InputField
            label="URL Foto Utama Produk"
            placeholder="https://images.unsplash.com/..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />

          <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-sm space-y-3">
            <span className="font-heading font-bold text-xs uppercase tracking-wider text-forme-text-primary block">
              Konfigurasi Varian Awal
            </span>
            <div className="grid grid-cols-3 gap-3">
              <InputField
                label="Warna Varian"
                placeholder="Black"
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
                required
              />
              <InputField
                label="Daftar Ukuran (Pisahkan Koma)"
                placeholder="S,M,L,XL,XXL"
                value={sizesInput}
                onChange={(e) => setSizesInput(e.target.value)}
                required
              />
              <InputField
                label="Stok Awal Per Varian"
                type="number"
                value={initialStock}
                onChange={(e) => setInitialStock(Number(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setIsAddModalOpen(false)}
            >
              Batal
            </Button>
            <Button type="submit" variant="primary" size="md" isLoading={savingProduct}>
              Simpan & Terbitkan Produk
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: MANAGE VARIANT STOCKS */}
      <Modal
        isOpen={!!stockModalProduct}
        onClose={() => setStockModalProduct(null)}
        title={`Kelola Stok Varian: ${stockModalProduct?.name || ''}`}
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4">
          <p className="text-xs text-forme-text-secondary">
            Klik tombol "Ubah Stok" untuk memperbarui jumlah fisik stok varian di gudang FORME.
          </p>

          <div className="border border-neutral-200 rounded-sm overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-4">SKU</th>
                  <th className="py-2.5 px-4">Warna</th>
                  <th className="py-2.5 px-4">Ukuran</th>
                  <th className="py-2.5 px-4">Harga</th>
                  <th className="py-2.5 px-4 text-center">Stok</th>
                  <th className="py-2.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {stockModalProduct?.variants?.map((v: any) => (
                  <tr key={v.id} className="hover:bg-neutral-50">
                    <td className="py-2.5 px-4 font-mono font-medium">{v.sku}</td>
                    <td className="py-2.5 px-4">{v.color}</td>
                    <td className="py-2.5 px-4 font-bold">{v.size}</td>
                    <td className="py-2.5 px-4">{formatRupiah(v.price)}</td>
                    <td className="py-2.5 px-4 text-center font-bold">
                      <span
                        className={`px-2 py-0.5 rounded-full ${
                          v.stock <= 5 ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {v.stock}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <button
                        onClick={() => handleUpdateVariantStock(v.id, v.stock)}
                        className="text-[11px] font-semibold text-forme-primary hover:underline"
                        disabled={updatingStock}
                      >
                        Ubah Stok
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>
    </div>
  );
};
