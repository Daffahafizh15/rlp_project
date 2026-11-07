import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { reportsApi } from '../../services/api';
import { formatRupiah } from '../../utils/formatters';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  Package,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        const res = await reportsApi.getDashboardMetrics();
        setData(res.data);
      } catch (e) {
        console.error('Failed to load dashboard metrics', e);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Menghitung analitik dari database..." className="py-24" />;
  }

  const summary = data?.summary || {};
  const ordersByStatus = summary?.ordersByStatus || {};
  const salesChart = data?.salesChart || [];
  const lowStockAlerts = data?.lowStockAlerts || [];
  const topSelling = data?.topSellingProducts || [];

  return (
    <div className="space-y-8">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="bg-white p-5 border border-neutral-200 rounded-sm shadow-sm space-y-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Pendapatan</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-sm">
              <DollarSign size={18} />
            </div>
          </div>
          <p className="font-heading font-black text-2xl text-forme-text-primary">
            {formatRupiah(summary.totalRevenue || 0)}
          </p>
          <p className="text-[11px] text-neutral-400">Dari seluruh pesanan lunas</p>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 border border-neutral-200 rounded-sm shadow-sm space-y-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Pesanan</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-sm">
              <ShoppingBag size={18} />
            </div>
          </div>
          <p className="font-heading font-black text-2xl text-forme-text-primary">
            {summary.totalOrders || 0}
          </p>
          <p className="text-[11px] text-neutral-400">
            {summary.totalSalesCount || 0} transaksi berhasil diverifikasi
          </p>
        </div>

        {/* Needs Verification */}
        <div className="bg-white p-5 border border-neutral-200 rounded-sm shadow-sm space-y-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Menunggu Verifikasi</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-sm">
              <Clock size={18} />
            </div>
          </div>
          <p className="font-heading font-black text-2xl text-amber-600">
            {ordersByStatus.paymentReview || 0}
          </p>
          <Link
            to="/admin/payments"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:underline"
          >
            <span>Periksa bukti pembayaran</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        {/* Orders In Processing */}
        <div className="bg-white p-5 border border-neutral-200 rounded-sm shadow-sm space-y-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Pesanan Diproses</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-sm">
              <CheckCircle size={18} />
            </div>
          </div>
          <p className="font-heading font-black text-2xl text-indigo-600">
            {ordersByStatus.processing || 0}
          </p>
          <Link
            to="/admin/orders?status=PROCESSING"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 hover:underline"
          >
            <span>Input resi pengiriman</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* Chart & Top Sellers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sales Chart (7 Days) */}
        <div className="lg:col-span-8 bg-white p-6 border border-neutral-200 rounded-sm shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-forme-primary" />
              <h3 className="font-heading font-bold text-sm tracking-wide text-forme-text-primary">
                Tren Penjualan 7 Hari Terakhir
              </h3>
            </div>
            <span className="text-xs text-neutral-400">Database Real-time</span>
          </div>

          <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2">
            {salesChart.map((day: any, idx: number) => {
              const maxRev = Math.max(...salesChart.map((d: any) => d.revenue), 100000);
              const heightPct = Math.max(8, Math.round((day.revenue / maxRev) * 100));

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="text-[10px] text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                    {formatRupiah(day.revenue)}
                   </div>
                  <div
                    style={{ height: `${heightPct}%` }}
                    className="w-full bg-forme-primary hover:bg-neutral-700 transition-all rounded-t-sm"
                  />
                  <span className="text-[10px] text-neutral-500 font-medium">
                    {day.date.slice(5)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="lg:col-span-4 bg-white p-6 border border-neutral-200 rounded-sm shadow-sm space-y-4">
          <h3 className="font-heading font-bold text-sm tracking-wide text-forme-text-primary border-b border-neutral-100 pb-3">
            Produk Terlaris
          </h3>

          {topSelling.length === 0 ? (
            <p className="text-xs text-neutral-400 py-8 text-center">
              Belum ada data penjualan tercatat.
            </p>
          ) : (
            <div className="space-y-3.5">
              {topSelling.map((prod: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between text-xs pb-3 border-b border-neutral-100 last:border-b-0">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-neutral-100 text-neutral-700 font-bold flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-forme-text-primary">{prod.productName}</p>
                      <p className="text-[11px] text-neutral-400">{prod.totalSold} terjual</p>
                    </div>
                  </div>
                  <span className="font-bold text-forme-text-primary">
                    {formatRupiah(prod.totalRevenue)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Low Stock Alerts */}
      <div className="bg-white p-6 border border-neutral-200 rounded-sm shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-500" />
            <h3 className="font-heading font-bold text-sm tracking-wide text-forme-text-primary">
              Peringatan Stok Menipis (Stok ≤ 5)
            </h3>
          </div>
          <Link
            to="/admin/products"
            className="text-xs font-bold text-forme-primary hover:underline flex items-center gap-1"
          >
            <span>Kelola Seluruh Stok</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {lowStockAlerts.length === 0 ? (
          <p className="text-xs text-emerald-600 py-4 flex items-center gap-2 font-medium">
            <CheckCircle size={16} />
            <span>Seluruh stok varian produk berada dalam batas aman.</span>
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-500 uppercase tracking-wider text-[11px]">
                  <th className="py-2.5">Produk</th>
                  <th className="py-2.5">SKU Varian</th>
                  <th className="py-2.5">Ukuran</th>
                  <th className="py-2.5">Warna</th>
                  <th className="py-2.5 text-right">Sisa Stok</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {lowStockAlerts.map((alert: any) => (
                  <tr key={alert.variantId} className="hover:bg-neutral-50">
                    <td className="py-2.5 font-semibold text-forme-text-primary">
                      {alert.productName}
                    </td>
                    <td className="py-2.5 font-mono text-neutral-600">{alert.sku}</td>
                    <td className="py-2.5">{alert.size}</td>
                    <td className="py-2.5">{alert.color}</td>
                    <td className="py-2.5 text-right">
                      <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-sm">
                        {alert.currentStock} item
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};