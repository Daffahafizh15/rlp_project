import React from 'react';
import { OrderStatus, PaymentStatus } from '../../types';

interface StatusBadgeProps {
  status: OrderStatus | PaymentStatus | string;
  type?: 'order' | 'payment';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'order' }) => {
  const getBadgeConfig = () => {
    switch (status) {
      // Order Statuses
      case 'WAITING_PAYMENT':
        return { label: 'Menunggu Pembayaran', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'PAYMENT_REVIEW':
        return { label: 'Menunggu Verifikasi', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'PROCESSING':
        return { label: 'Diproses', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'SHIPPED':
        return { label: 'Dalam Pengiriman', bg: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'COMPLETED':
        return { label: 'Selesai', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'CANCELLED':
        return { label: 'Dibatalkan', bg: 'bg-red-50 text-red-700 border-red-200' };

      // Payment Statuses
      case 'PENDING':
        return { label: 'Belum Bayar', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'WAITING_VERIFICATION':
        return { label: 'Verifikasi Bukti', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'PAID':
        return { label: 'Terverifikasi (Lunas)', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'REJECTED':
        return { label: 'Bukti Ditolak', bg: 'bg-red-50 text-red-700 border-red-200' };

      default:
        return { label: status, bg: 'bg-neutral-100 text-neutral-700 border-neutral-300' };
    }
  };

  const config = getBadgeConfig();

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70" />
      {config.label}
    </span>
  );
};
