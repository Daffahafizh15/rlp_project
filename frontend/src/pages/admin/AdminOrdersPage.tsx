import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Order, OrderStatus } from '../../types';
import { ordersApi } from '../../services/api';
import { formatRupiah, formatDate } from '../../utils/formatters';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { InputField } from '../../components/common/InputField';
import { Search, SlidersHorizontal, Edit3, Truck, AlertTriangle } from 'lucide-react';

export const AdminOrdersPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || '';

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>(initialStatus);
  const [searchQuery, setSearchQuery] = useState('');

  // Status Update Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>('PROCESSING');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await ordersApi.getAdminOrders({
        status: statusFilter ? (statusFilter as OrderStatus) : undefined,
        search: searchQuery.trim() || undefined,
      });
      setOrders(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleOpenStatusModal = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus);
    setTrackingNumber(order.trackingNumber || '');
  };

  const handleSaveStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    if (newStatus === 'SHIPPED' && !trackingNumber.trim()) {
      alert('Nomor resi kurir wajib diisi saat status pesanan diubah ke Dikirim (SHIPPED)');
      return;
    }

    if (
      newStatus === 'CANCELLED' &&
      !window.confirm(
        'PERINGATAN: Membatalkan pesanan akan secara otomatis mengembalikan stok seluruh varian produk ke gudang. Lanjutkan pembatalan?',
      )
    ) {
      return;
    }

    setUpdating(true);
    try {
      await ordersApi.updateOrderStatus(selectedOrder.id, newStatus, trackingNumber.trim() || undefined);
      await fetchOrders();
      setSelectedOrder(null);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal mengubah status pesanan');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="bg-white p-6 border border-neutral-200 rounded-sm shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nomor pesanan, nama pembeli, atau email..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-forme-border rounded-sm focus:outline-none focus:border-forme-primary"
          />
          <Search size={14} className="absolute left-3 top-2.5 text-neutral-400" />
        </form>

        {/* Status Filter Dropdown */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-neutral-500 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-forme-border text-xs px-3 py-2 rounded-sm focus:outline-none focus:border-forme-primary text-forme-text-primary"
          >
            <option value="">Semua Status Pesanan</option>
            <option value="WAITING_PAYMENT">Menunggu Pembayaran</option>
            <option value="PAYMENT_REVIEW">Menunggu Verifikasi Bukti</option>
            <option value="PROCESSING">Sedang Diproses (Packing)</option>
            <option value="SHIPPED">Dalam Pengiriman</option>
            <option value="COMPLETED">Selesai</option>
            <option value="CANCELLED">Dibatalkan</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <LoadingSpinner message="Memuat daftar pesanan..." className="py-24" />
      ) : orders.length === 0 ? (
        <div className="bg-white border border-neutral-200 p-12 text-center rounded-sm text-xs text-neutral-500">
          Tidak ada pesanan yang sesuai dengan filter.
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-sm shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-6">No. Pesanan & Tanggal</th>
                  <th className="py-3.5 px-6">Customer</th>
                  <th className="py-3.5 px-6">Status Pesanan</th>
                  <th className="py-3.5 px-6">Status Bayar</th>
                  <th className="py-3.5 px-6">Total Tagihan</th>
                  <th className="py-3.5 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <Link
                        to={`/orders/${o.id}`}
                        className="font-mono font-bold text-forme-text-primary hover:underline text-sm block"
                      >
                        {o.orderNumber}
                      </Link>
                      <span className="text-[11px] text-neutral-400">{formatDate(o.createdAt)}</span>
                      {o.trackingNumber && (
                        <div className="mt-1 flex items-center gap-1 text-[11px] font-mono text-purple-700">
                          <Truck size={12} />
                          <span>Resi: {o.trackingNumber}</span>
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-semibold text-forme-text-primary block">
                        {o.user?.fullName}
                      </span>
                      <span className="text-[11px] text-neutral-400">{o.user?.email}</span>
                    </td>

                    <td className="py-4 px-6">
                      <StatusBadge status={o.orderStatus} type="order" />
                    </td>

                    <td className="py-4 px-6">
                      <StatusBadge status={o.payment?.paymentStatus || 'PENDING'} type="payment" />
                    </td>

                    <td className="py-4 px-6 font-bold text-forme-text-primary">
                      {formatRupiah(o.totalAmount)}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleOpenStatusModal(o)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-forme-text-primary font-semibold text-xs rounded-sm transition-colors"
                      >
                        <Edit3 size={13} />
                        <span>Ubah Status</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL UPDATE STATUS */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Ubah Status Pesanan: ${selectedOrder?.orderNumber || ''}`}
      >
        <form onSubmit={handleSaveStatus} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold tracking-wider text-forme-text-primary uppercase mb-1.5">
              Pilih Status Baru
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
              className="w-full p-2.5 bg-white border border-forme-border rounded-sm text-xs focus:outline-none focus:border-forme-primary font-medium"
            >
              <option value="WAITING_PAYMENT">Menunggu Pembayaran</option>
              <option value="PAYMENT_REVIEW">Menunggu Verifikasi Bukti</option>
              <option value="PROCESSING">Diproses (Sedang Packing)</option>
              <option value="SHIPPED">Dalam Pengiriman (Kurir)</option>
              <option value="COMPLETED">Selesai (Pesanan Diterima)</option>
              <option value="CANCELLED">Dibatalkan (Kembalikan Stok)</option>
            </select>
          </div>

          {newStatus === 'SHIPPED' && (
            <InputField
              label="Nomor Resi Pengiriman (Ekspedisi)"
              placeholder="e.g. JNE-REG-1092837465"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              required
            />
          )}

          {newStatus === 'CANCELLED' && (
            <div className="p-3 bg-red-50 border border-red-200 text-forme-status-danger rounded-sm text-xs flex items-start gap-2">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              <span>
                Status CANCELLED akan secara otomatis melakukan rollback kuantitas stok varian produk ke
                database toko.
              </span>
            </div>
          )}

          <div className="pt-2 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setSelectedOrder(null)}
            >
              Batal
            </Button>
            <Button type="submit" variant="primary" size="md" isLoading={updating}>
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
