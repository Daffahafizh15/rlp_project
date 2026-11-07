import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Order, OrderStatus } from '../../types';
import { ordersApi } from '../../services/api';
import { formatRupiah, formatDate } from '../../utils/formatters';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await ordersApi.getMyOrders();
        setOrders(res.data);
      } catch (e) {
        console.error('Failed to load my orders', e);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((o) => {
    if (selectedStatus === 'ALL') return true;
    return o.orderStatus === selectedStatus;
  });

  const statusFilters = [
    { label: 'Semua Pesanan', value: 'ALL' },
    { label: 'Menunggu Bayar', value: 'WAITING_PAYMENT' },
    { label: 'Review Bukti', value: 'PAYMENT_REVIEW' },
    { label: 'Diproses', value: 'PROCESSING' },
    { label: 'Dikirim', value: 'SHIPPED' },
    { label: 'Selesai', value: 'COMPLETED' },
  ];

  if (loading) {
    return <LoadingSpinner message="Memuat riwayat pesanan..." className="py-20" />;
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-forme-border pb-6">
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-forme-text-primary tracking-tight">
          Pesanan Saya
        </h1>
        <p className="text-xs text-forme-text-secondary mt-1">
          Pantau progres pengiriman dan riwayat belanja busana FORME Anda
        </p>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {statusFilters.map((tab) => {
          const isSelected = selectedStatus === tab.value;
          const count =
            tab.value === 'ALL'
              ? orders.length
              : orders.filter((o) => o.orderStatus === tab.value).length;

          return (
            <button
              key={tab.value}
              onClick={() => setSelectedStatus(tab.value)}
              className={`px-3.5 py-1.5 rounded-sm text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors ${
                isSelected
                  ? 'bg-forme-primary text-white shadow-sm'
                  : 'bg-white border border-forme-border text-forme-text-secondary hover:text-forme-text-primary'
              }`}
            >
              {tab.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white border border-forme-border p-12 text-center rounded-sm space-y-4">
          <div className="w-14 h-14 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-400">
            <ShoppingBag size={24} />
          </div>
          <h3 className="font-heading font-bold text-base text-forme-text-primary">
            Belum Ada Pesanan Pada Kategori Ini
          </h3>
          <p className="text-xs text-forme-text-secondary max-w-sm mx-auto">
            Seluruh transaksi pesanan baru Anda akan otomatis muncul di halaman ini.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate('/catalog')}
              className="px-6 py-2.5 bg-forme-primary text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-neutral-800 transition-colors"
            >
              Mulai Berbelanja
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-forme-border p-5 rounded-sm shadow-sm hover:border-neutral-400 transition-all space-y-4"
            >
              {/* Order Card Top Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-forme-border pb-3.5 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-forme-text-primary text-sm">
                    {order.orderNumber}
                  </span>
                  <span className="text-neutral-400">•</span>
                  <span className="text-forme-text-secondary">{formatDate(order.createdAt)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge status={order.orderStatus} type="order" />
                  <StatusBadge status={order.payment?.paymentStatus || 'PENDING'} type="payment" />
                </div>
              </div>

              {/* Items preview list */}
              <div className="divide-y divide-neutral-100 text-xs">
                {order.items.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-forme-text-primary">
                        {item.productNameSnapshot}
                      </p>
                      <p className="text-[11px] text-forme-text-secondary">
                        {item.colorSnapshot} • {item.sizeSnapshot} • {item.quantity} pcs
                      </p>
                    </div>
                    <span className="font-semibold text-forme-text-primary">
                      {formatRupiah(item.subtotal)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Card Bottom Action */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-forme-border">
                <div>
                  <span className="text-[11px] text-forme-text-secondary block">
                    Total Pembayaran ({order.items.reduce((s, i) => s + i.quantity, 0)} pcs)
                  </span>
                  <span className="font-heading font-black text-base text-forme-text-primary">
                    {formatRupiah(order.totalAmount)}
                  </span>
                </div>

                <Link
                  to={`/orders/${order.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-forme-primary text-white text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-neutral-800 transition-colors"
                >
                  <span>
                    {order.orderStatus === 'WAITING_PAYMENT' ? 'Bayar / Upload Bukti' : 'Lihat Detail Faktur'}
                  </span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
