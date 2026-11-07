import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Order } from '../../types';
import { ordersApi, paymentsApi } from '../../services/api';
import { formatRupiah, formatDate, getFullImageUrl } from '../../utils/formatters';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Button } from '../../components/common/Button';
import {
  CreditCard,
  QrCode,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Truck,
  ArrowLeft,
  FileText,
} from 'lucide-react';

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const fetchOrder = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await ordersApi.getOrderDetail(id);
      setOrder(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memuat detail pesanan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUploadProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order || !selectedFile) return;

    setUploading(true);
    try {
      await paymentsApi.uploadProof(order.id, selectedFile);
      setUploadSuccess(true);
      setSelectedFile(null);
      setPreviewUrl(null);
      await fetchOrder();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal mengunggah bukti pembayaran');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Memuat faktur pesanan..." className="min-h-[70vh]" />;
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white border border-forme-border text-center rounded-sm">
        <h3 className="font-heading font-bold text-lg mb-2">Pesanan Tidak Ditemukan</h3>
        <p className="text-xs text-forme-text-secondary mb-6">{error || 'Data tidak tersedia.'}</p>
        <Link to="/orders" className="text-xs font-bold uppercase tracking-wider text-forme-primary underline">
          Kembali ke Riwayat Pesanan
        </Link>
      </div>
    );
  }

  const isAwaitingPayment =
    order.payment?.paymentStatus === 'PENDING' || order.payment?.paymentStatus === 'REJECTED';
  const isWaitingVerification = order.payment?.paymentStatus === 'WAITING_VERIFICATION';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-forme-border pb-4">
        <Link
          to="/orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-forme-text-secondary hover:text-forme-text-primary transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Kembali ke Pesanan Saya</span>
        </Link>
        <div className="flex items-center gap-2">
          <StatusBadge status={order.orderStatus} type="order" />
          <StatusBadge status={order.payment?.paymentStatus || 'PENDING'} type="payment" />
        </div>
      </div>

      {/* Invoice Header */}
      <div className="bg-white border border-forme-border p-6 rounded-sm shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-forme-text-secondary uppercase tracking-widest font-bold">
            Nomor Pesanan
          </span>
          <h1 className="font-heading font-black text-2xl text-forme-text-primary tracking-wide mt-0.5">
            {order.orderNumber}
          </h1>
          <p className="text-xs text-forme-text-secondary mt-1">
            Waktu Pemesanan: {formatDate(order.createdAt)}
          </p>
        </div>

        <div className="sm:text-right">
          <span className="text-[10px] text-forme-text-secondary uppercase tracking-widest font-bold">
            Total Tagihan
          </span>
          <p className="font-heading font-black text-2xl text-forme-text-primary mt-0.5">
            {formatRupiah(order.totalAmount)}
          </p>
          <span className="text-xs text-neutral-500">
            Metode: {order.payment?.paymentMethod === 'BANK_TRANSFER' ? 'Transfer BCA' : 'QRIS Instan'}
          </span>
        </div>
      </div>

      {/* REJECTION REASON ALERT (If previous proof rejected) */}
      {order.payment?.paymentStatus === 'REJECTED' && (
        <div className="p-4 bg-red-50 border border-red-200 text-forme-status-danger rounded-sm text-xs space-y-1 animate-fadeIn">
          <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[11px]">
            <AlertTriangle size={15} />
            <span>Bukti Pembayaran Sebelumnya Ditolak Admin:</span>
          </div>
          <p className="pl-6 text-neutral-800">
            "{order.payment.rejectionReason || 'Bukti tidak terbaca atau nominal tidak sesuai'}"
          </p>
          <p className="pl-6 text-neutral-500">
            Silakan periksa kembali nominal transfer Anda lalu unggah foto bukti transfer yang jelas di bawah ini.
          </p>
        </div>
      )}

      {/* PAYMENT INSTRUCTIONS & PROOF UPLOAD (If unpaid or rejected) */}
      {isAwaitingPayment && (
        <div className="bg-neutral-900 text-white p-6 sm:p-8 rounded-sm space-y-6">
          <div className="border-b border-neutral-800 pb-4">
            <h3 className="font-heading font-bold text-lg tracking-wide">
              Instruksi Pembayaran Manual
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Selesaikan pembayaran sebesar <strong className="text-white text-sm">{formatRupiah(order.totalAmount)}</strong> tepat sesuai nominal berikut:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Account / QRIS Details */}
            {order.payment?.paymentMethod === 'BANK_TRANSFER' ? (
              <div className="bg-neutral-800/80 p-5 rounded-sm border border-neutral-700 space-y-3">
                <div className="flex items-center gap-2 text-neutral-300 text-xs uppercase font-bold tracking-wider">
                  <CreditCard size={16} />
                  <span>Rekening Tujuan Transfer</span>
                </div>
                <div>
                  <span className="text-[11px] text-neutral-400 block">Bank</span>
                  <span className="font-bold text-white text-base">BCA (Bank Central Asia)</span>
                </div>
                <div>
                  <span className="text-[11px] text-neutral-400 block">Nomor Rekening</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-xl text-amber-400 tracking-wider">
                      8830-1928-00
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText('8830192800');
                        alert('Nomor rekening BCA disalin ke clipboard!');
                      }}
                      className="text-[10px] uppercase font-bold bg-neutral-700 hover:bg-neutral-600 px-2 py-1 rounded-sm text-white"
                    >
                      Salin
                    </button>
                  </div>
                </div>
                <div>
                  <span className="text-[11px] text-neutral-400 block">Atas Nama</span>
                  <span className="font-medium text-white text-xs">PT FORME APPAREL INDONESIA</span>
                </div>
              </div>
            ) : (
              <div className="bg-neutral-800/80 p-5 rounded-sm border border-neutral-700 space-y-3 text-center">
                <div className="flex items-center justify-center gap-2 text-neutral-300 text-xs uppercase font-bold tracking-wider">
                  <QrCode size={16} />
                  <span>Scan Kode QRIS Nasional</span>
                </div>
                <div className="w-40 h-40 bg-white p-2 mx-auto rounded-sm flex items-center justify-center">
                  {/* Simulated QR barcode */}
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=FORME_OFFICIAL_QRIS"
                    alt="QRIS Barcode"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-[11px] text-neutral-400">
                  NMID: ID1020039281729 • FORME FASHION OFFICIAL
                </p>
              </div>
            )}

            {/* Upload Proof Form */}
            <div className="bg-neutral-800/80 p-5 rounded-sm border border-neutral-700 space-y-4">
              <div className="flex items-center gap-2 text-neutral-300 text-xs uppercase font-bold tracking-wider">
                <Upload size={16} />
                <span>Unggah Bukti Transfer / Screenshot</span>
              </div>

              <form onSubmit={handleUploadProof} className="space-y-4">
                <div className="border-2 border-dashed border-neutral-600 rounded-sm p-4 text-center hover:border-neutral-400 transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    required
                  />
                  {previewUrl ? (
                    <div className="space-y-2">
                      <img
                        src={previewUrl}
                        alt="Preview Bukti"
                        className="max-h-32 mx-auto rounded-sm object-contain"
                      />
                      <p className="text-[11px] text-neutral-300 truncate">{selectedFile?.name}</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Upload size={24} className="mx-auto text-neutral-400" />
                      <p className="text-xs text-neutral-300 font-medium">
                        Klik untuk memilih foto bukti transfer
                      </p>
                      <p className="text-[10px] text-neutral-500">JPG, PNG, atau WEBP (Maksimal 3MB)</p>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full bg-white text-forme-primary hover:bg-neutral-200 text-xs uppercase tracking-wider font-bold"
                  disabled={!selectedFile || uploading}
                  isLoading={uploading}
                >
                  Kirim Bukti Pembayaran
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* WAITING VERIFICATION NOTICE */}
      {isWaitingVerification && (
        <div className="bg-blue-50 border border-blue-200 p-5 rounded-sm flex items-start gap-3 text-xs text-blue-900 leading-relaxed">
          <CheckCircle2 size={18} className="text-blue-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">Bukti Pembayaran Sedang Diverifikasi</h4>
            <p className="mt-1">
              Terima kasih! Bukti transfer Anda telah berhasil kami terima pada{' '}
              {formatDate(order.payment?.proofUploadedAt || '')}. Tim operasional FORME sedang
              memeriksa transaksi Anda. Status pesanan akan otomatis berganti ke{' '}
              <strong>DIPROSES</strong> setelah disetujui.
            </p>
            {order.payment?.proofImageUrl && (
              <div className="mt-3">
                <a
                  href={getFullImageUrl(order.payment.proofImageUrl)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-semibold underline text-blue-700"
                >
                  <FileText size={14} />
                  <span>Lihat Bukti yang Anda Unggah</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SHIPPING TRACKING NOTICE (If Shipped) */}
      {order.orderStatus === 'SHIPPED' && order.trackingNumber && (
        <div className="bg-purple-50 border border-purple-200 p-5 rounded-sm flex items-start gap-3 text-xs text-purple-900 leading-relaxed">
          <Truck size={20} className="text-purple-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">Pesanan Anda Sedang Dalam Pengiriman!</h4>
            <p className="mt-1">
              Paket telah diserahkan kepada kurir ekspedisi. Gunakan nomor resi berikut untuk melacak
              posisi paket:
            </p>
            <div className="mt-2 inline-block bg-white border border-purple-300 px-3 py-1.5 rounded-sm font-mono font-bold text-base text-purple-950 tracking-wider">
              {order.trackingNumber}
            </div>
          </div>
        </div>
      )}

      {/* ORDER ITEMS TABLE */}
      <div className="bg-white border border-forme-border rounded-sm overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-forme-border flex items-center justify-between">
          <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-forme-text-primary">
            Rincian Item yang Dipesan
          </h3>
          <span className="text-xs text-forme-text-secondary">{order.items.length} varian produk</span>
        </div>

        <div className="divide-y divide-forme-border">
          {order.items.map((item) => (
            <div key={item.id} className="p-5 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="font-heading font-semibold text-sm text-forme-text-primary">
                  {item.productNameSnapshot}
                </h4>
                <div className="flex items-center gap-2 text-xs text-forme-text-secondary">
                  <span>Warna: <strong>{item.colorSnapshot}</strong></span>
                  <span>•</span>
                  <span>Size: <strong>{item.sizeSnapshot}</strong></span>
                  <span>•</span>
                  <span>SKU: <strong className="font-mono">{item.variantSkuSnapshot}</strong></span>
                </div>
                <p className="text-xs text-neutral-500">
                  {formatRupiah(item.priceSnapshot)} × {item.quantity} pcs
                </p>
              </div>

              <span className="font-heading font-bold text-base text-forme-text-primary">
                {formatRupiah(item.subtotal)}
              </span>
            </div>
          ))}
        </div>

        {/* Financial Summary */}
        <div className="bg-neutral-50 p-6 border-t border-forme-border space-y-2.5 text-xs">
          <div className="flex justify-between text-forme-text-secondary">
            <span>Subtotal Produk</span>
            <span className="font-medium text-forme-text-primary">{formatRupiah(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-forme-text-secondary">
            <span>Biaya Pengiriman ({order.shippingZone?.name || 'Zona Tetap'})</span>
            <span className="font-medium text-forme-text-primary">{formatRupiah(order.shippingCost)}</span>
          </div>
          <div className="border-t border-forme-border pt-3 flex justify-between items-baseline">
            <span className="font-heading font-bold text-sm text-forme-text-primary">
              Total Pembayaran
            </span>
            <span className="font-heading font-black text-xl text-forme-text-primary">
              {formatRupiah(order.totalAmount)}
            </span>
          </div>
        </div>
      </div>

      {/* SHIPPING ADDRESS SNAPSHOT INFO */}
      <div className="bg-white border border-forme-border p-6 rounded-sm shadow-sm space-y-3">
        <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-forme-text-primary border-b border-forme-border pb-3">
          Alamat Tujuan Pengiriman (Snapshot Transaksi)
        </h3>

        {order.shippingAddress ? (
          <div className="text-xs space-y-1 text-forme-text-primary leading-relaxed">
            <p className="font-bold text-sm">
              {order.shippingAddress.recipientName} ({order.shippingAddress.phoneNumber})
            </p>
            <p className="text-forme-text-secondary">{order.shippingAddress.fullAddress}</p>
            <p className="text-forme-text-secondary">
              {order.shippingAddress.city}, {order.shippingAddress.province}{' '}
              {order.shippingAddress.postalCode}
            </p>
            <span className="inline-block mt-2 px-2 py-0.5 bg-neutral-100 rounded-sm font-semibold text-[11px] text-neutral-700">
              {order.shippingAddress.zoneName}
            </span>
          </div>
        ) : (
          <p className="text-xs text-forme-text-secondary">{order.shippingAddressSnapshot}</p>
        )}

        {order.notes && (
          <div className="mt-3 pt-3 border-t border-neutral-100 text-xs">
            <span className="font-bold block text-neutral-700">Catatan Pesanan:</span>
            <p className="italic text-neutral-600">"{order.notes}"</p>
          </div>
        )}
      </div>
    </div>
  );
};
