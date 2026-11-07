import React, { useEffect, useState } from 'react';
import { paymentsApi } from '../../services/api';
import { formatRupiah, formatDate, getFullImageUrl } from '../../utils/formatters';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Check, X, Eye, CheckCircle2, AlertCircle } from 'lucide-react';

export const AdminPaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Preview Image Modal
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Reject Modal
  const [rejectOrder, setRejectOrder] = useState<any | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Bukti transfer tidak terbaca / nominal tidak sesuai.');
  const [processing, setProcessing] = useState(false);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await paymentsApi.getPendingVerifications();
      setPayments(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (orderId: string, orderNumber: string) => {
    if (!window.confirm(`Setujui pembayaran untuk pesanan ${orderNumber}? Status pesanan akan berubah menjadi DIPROSES.`)) {
      return;
    }

    setProcessing(true);
    try {
      await paymentsApi.verifyPayment(orderId, 'PAID');
      await fetchPending();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menyetujui pembayaran');
    } finally {
      setProcessing(false);
    }
  };

  const handleConfirmReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectOrder || !rejectionReason.trim()) return;

    setProcessing(true);
    try {
      await paymentsApi.verifyPayment(rejectOrder.orderId, 'REJECTED', rejectionReason.trim());
      await fetchPending();
      setRejectOrder(null);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menolak pembayaran');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Memuat daftar verifikasi pembayaran..." className="py-24" />;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 border border-neutral-200 rounded-sm shadow-sm">
        <h2 className="font-heading font-bold text-lg text-forme-text-primary">
          Verifikasi Bukti Pembayaran Manual
        </h2>
        <p className="text-xs text-forme-text-secondary mt-0.5">
          Periksa kecocokan mutasi transfer bank atau tangkapan layar QRIS pelanggan
        </p>
      </div>

      {payments.length === 0 ? (
        <div className="bg-white border border-neutral-200 p-16 text-center rounded-sm space-y-3">
          <CheckCircle2 size={32} className="mx-auto text-emerald-500" />
          <h3 className="font-heading font-bold text-base text-forme-text-primary">
            Semua Pembayaran Telah Selesai Diverifikasi
          </h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Tidak ada bukti transfer yang sedang menunggu persetujuan saat ini.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-sm shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-6">Pesanan</th>
                  <th className="py-3.5 px-6">Customer</th>
                  <th className="py-3.5 px-6">Metode & Nominal</th>
                  <th className="py-3.5 px-6">Waktu Upload</th>
                  <th className="py-3.5 px-6">Bukti Foto</th>
                  <th className="py-3.5 px-6 text-right">Verifikasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-mono font-bold text-sm block">
                        {p.order?.orderNumber}
                      </span>
                      <span className="text-[11px] text-neutral-400">
                        {p.order?.items?.length} jenis barang
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-semibold text-forme-text-primary block">
                        {p.order?.user?.fullName}
                      </span>
                      <span className="text-[11px] text-neutral-400">{p.order?.user?.phone}</span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-bold text-forme-text-primary text-sm block">
                        {formatRupiah(p.amount)}
                      </span>
                      <span className="text-[11px] text-neutral-500 font-semibold uppercase">
                        {p.paymentMethod === 'BANK_TRANSFER' ? 'Transfer BCA' : 'QRIS'}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-neutral-600">
                      {formatDate(p.proofUploadedAt)}
                    </td>

                    <td className="py-4 px-6">
                      {p.proofImageUrl ? (
                        <button
                          type="button"
                          onClick={() => setPreviewImage(getFullImageUrl(p.proofImageUrl))}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold rounded-sm transition-colors"
                        >
                          <Eye size={13} />
                          <span>Lihat Bukti</span>
                        </button>
                      ) : (
                        <span className="text-neutral-400 italic">Tidak ada foto</span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="gap-1 bg-emerald-600 text-white hover:bg-emerald-700 border-none"
                          onClick={() => handleApprove(p.orderId, p.order?.orderNumber)}
                          disabled={processing}
                        >
                          <Check size={14} />
                          <span>Setujui</span>
                        </Button>

                        <Button
                          variant="secondary"
                          size="sm"
                          className="gap-1 bg-red-600 text-white hover:bg-red-700 border-none"
                          onClick={() => setRejectOrder({ orderId: p.orderId, orderNumber: p.order?.orderNumber })}
                          disabled={processing}
                        >
                          <X size={14} />
                          <span>Tolak</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL PREVIEW IMAGE */}
      <Modal
        isOpen={!!previewImage}
        onClose={() => setPreviewImage(null)}
        title="Foto Bukti Pembayaran Pelanggan"
        maxWidth="max-w-xl"
      >
        <div className="space-y-4">
          <div className="max-h-[70vh] overflow-auto bg-neutral-100 rounded-sm p-2 flex items-center justify-center">
            {previewImage && (
              <img
                src={previewImage}
                alt="Bukti Transfer"
                className="max-h-[60vh] object-contain rounded-sm"
              />
            )}
          </div>
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={() => setPreviewImage(null)}>
              Tutup Preview
            </Button>
          </div>
        </div>
      </Modal>

      {/* MODAL REJECT REASON */}
      <Modal
        isOpen={!!rejectOrder}
        onClose={() => setRejectOrder(null)}
        title={`Tolak Bukti Pembayaran: ${rejectOrder?.orderNumber || ''}`}
      >
        <form onSubmit={handleConfirmReject} className="space-y-4 text-xs">
          <div className="p-3 bg-red-50 border border-red-200 text-forme-status-danger rounded-sm flex items-start gap-2">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>
              Menolak pembayaran akan mengembalikan status ke MENUNGGU PEMBAYARAN dan memberikan pesan
              ini kepada customer agar dapat mengunggah bukti baru.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-wider text-forme-text-primary uppercase mb-1.5">
              Alasan Penolakan Bukti
            </label>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Contoh: Bukti transfer terpotong atau nominal transfer Rp 150.000 tidak sesuai tagihan Rp 204.000..."
              className="w-full p-2.5 text-xs border border-forme-border rounded-sm focus:outline-none focus:border-forme-primary"
              required
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setRejectOrder(null)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="danger"
              size="md"
              isLoading={processing}
            >
              Konfirmasi Tolak Bukti
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
