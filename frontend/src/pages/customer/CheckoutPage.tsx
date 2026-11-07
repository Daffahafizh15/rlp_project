import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Address, ShippingZone, PaymentMethod } from '../../types';
import { addressesApi, shippingApi, ordersApi } from '../../services/api';
import { formatRupiah, getFullImageUrl } from '../../utils/formatters';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { InputField } from '../../components/common/InputField';
import {
  MapPin,
  Plus,
  CreditCard,
  QrCode,
  ShieldCheck,
  Truck,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { cart, refreshCart } = useCart();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('BANK_TRANSFER');
  const [orderNotes, setOrderNotes] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Add Address Modal state
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [newLabel, setNewLabel] = useState('Rumah');
  const [newRecipient, setNewRecipient] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newProvince, setNewProvince] = useState('');
  const [newPostal, setNewPostal] = useState('');
  const [newZoneId, setNewZoneId] = useState('');
  const [creatingAddress, setCreatingAddress] = useState(false);

  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [addrRes, zoneRes] = await Promise.all([
          addressesApi.getAll(),
          shippingApi.getZones(),
        ]);

        const addrList = addrRes.data;
        const zoneList = zoneRes.data;
        setAddresses(addrList);
        setShippingZones(zoneList);

        // Select default address if exists, or first address
        if (addrList.length > 0) {
          const defaultAddr = addrList.find((a) => a.isDefault) || addrList[0];
          setSelectedAddressId(defaultAddr.id);
        }

        if (zoneList.length > 0) {
          setNewZoneId(zoneList[0].id);
        }
      } catch (e) {
        console.error('Failed to load checkout initial data', e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);
  const shippingCost = selectedAddress?.shippingZone?.rate
    ? Number(selectedAddress.shippingZone.rate)
    : 0;
  const grandTotal = subtotal + shippingCost;

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingAddress(true);
    try {
      const res = await addressesApi.create({
        label: newLabel,
        recipientName: newRecipient,
        phoneNumber: newPhone,
        fullAddress: newAddress,
        city: newCity,
        province: newProvince,
        postalCode: newPostal,
        shippingZoneId: newZoneId,
        isDefault: addresses.length === 0,
      });

      const updatedAddrs = await addressesApi.getAll();
      setAddresses(updatedAddrs.data);
      setSelectedAddressId(res.data.id);
      setIsAddressModalOpen(false);

      // Reset form
      setNewRecipient('');
      setNewPhone('');
      setNewAddress('');
      setNewCity('');
      setNewProvince('');
      setNewPostal('');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menyimpan alamat baru');
    } finally {
      setCreatingAddress(false);
    }
  };

  const handleConfirmOrder = async () => {
    if (!selectedAddressId) {
      setError('Silakan pilih atau tambahkan alamat pengiriman terlebih dahulu');
      return;
    }

    if (items.length === 0) {
      setError('Keranjang belanja kosong');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await ordersApi.checkout({
        addressId: selectedAddressId,
        paymentMethod,
        notes: orderNotes.trim() || undefined,
      });

      await refreshCart();
      const createdOrder = res.data.order;
      // Navigate to order detail page with payment instructions
      navigate(`/orders/${createdOrder.id}`);
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Gagal memproses pesanan. Periksa ketersediaan stok produk.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!loading && items.length === 0) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white border border-forme-border text-center rounded-sm">
        <h3 className="font-heading font-bold text-lg mb-2">Keranjang Belanja Anda Kosong</h3>
        <p className="text-xs text-forme-text-secondary mb-6">
          Tambahkan produk terlebih dahulu sebelum melanjutkan ke proses checkout.
        </p>
        <Button variant="primary" onClick={() => navigate('/catalog')}>
          Belanja Sekarang
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title */}
      <div className="space-y-1 border-b border-forme-border pb-6">
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-forme-text-primary tracking-tight">
          Checkout & Pembayaran
        </h1>
        <p className="text-xs text-forme-text-secondary">
          Selesaikan data alamat dan metode pembayaran pesanan Anda
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-forme-status-danger rounded-sm text-xs flex items-center gap-3">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* LEFT COLUMN: FORM SECTIONS */}
        <div className="lg:col-span-8 space-y-8">
          {/* STEP 1: SHIPPING ADDRESS */}
          <section className="bg-white border border-forme-border p-6 rounded-sm space-y-4">
            <div className="flex items-center justify-between border-b border-forme-border pb-3">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-forme-primary" />
                <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-forme-text-primary">
                  1. Alamat Pengiriman
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddressModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-forme-primary hover:underline"
              >
                <Plus size={14} />
                <span>Tambah Alamat Baru</span>
              </button>
            </div>

            {addresses.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-forme-border rounded-sm space-y-3">
                <p className="text-xs text-forme-text-secondary">
                  Anda belum memiliki alamat pengiriman terdaftar.
                </p>
                <Button variant="outline" size="sm" onClick={() => setIsAddressModalOpen(true)}>
                  + Tambah Alamat Sekarang
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {addresses.map((addr) => {
                  const isSelected = selectedAddressId === addr.id;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`p-4 rounded-sm border cursor-pointer transition-all relative ${
                        isSelected
                          ? 'border-forme-primary bg-neutral-50/60 ring-1 ring-forme-primary'
                          : 'border-forme-border bg-white hover:border-neutral-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-heading font-bold text-xs uppercase tracking-wider text-forme-text-primary">
                          {addr.label}
                        </span>
                        {addr.isDefault && (
                          <span className="text-[10px] bg-neutral-200 text-neutral-800 font-semibold px-2 py-0.5 rounded-sm">
                            Utama
                          </span>
                        )}
                      </div>

                      <p className="text-xs font-semibold text-forme-text-primary mt-2">
                        {addr.recipientName} ({addr.phoneNumber})
                      </p>
                      <p className="text-xs text-forme-text-secondary mt-1 leading-relaxed">
                        {addr.fullAddress}, {addr.city}, {addr.province} {addr.postalCode}
                      </p>

                      <div className="mt-3 pt-2.5 border-t border-neutral-200/80 flex items-center justify-between text-[11px]">
                        <span className="text-neutral-500">{addr.shippingZone?.name}</span>
                        <span className="font-bold text-forme-text-primary">
                          {formatRupiah(Number(addr.shippingZone?.rate || 0))}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* STEP 2: PAYMENT METHOD */}
          <section className="bg-white border border-forme-border p-6 rounded-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-forme-border pb-3">
              <CreditCard size={18} className="text-forme-primary" />
              <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-forme-text-primary">
                2. Metode Pembayaran Manual
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Option 1: Bank Transfer */}
              <div
                onClick={() => setPaymentMethod('BANK_TRANSFER')}
                className={`p-5 rounded-sm border cursor-pointer transition-all ${
                  paymentMethod === 'BANK_TRANSFER'
                    ? 'border-forme-primary bg-neutral-50/60 ring-1 ring-forme-primary'
                    : 'border-forme-border bg-white hover:border-neutral-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-neutral-900 text-white rounded-sm">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-sm text-forme-text-primary">
                      Transfer Bank Manual
                    </h4>
                    <p className="text-[11px] text-forme-text-secondary mt-0.5">
                      BCA (Bank Central Asia)
                    </p>
                  </div>
                </div>
                <p className="text-xs text-forme-text-secondary mt-3 leading-relaxed">
                  Transfer ke rekening resmi PT FORME APPAREL INDONESIA lalu unggah bukti transfer.
                </p>
              </div>

              {/* Option 2: QRIS */}
              <div
                onClick={() => setPaymentMethod('QRIS')}
                className={`p-5 rounded-sm border cursor-pointer transition-all ${
                  paymentMethod === 'QRIS'
                    ? 'border-forme-primary bg-neutral-50/60 ring-1 ring-forme-primary'
                    : 'border-forme-border bg-white hover:border-neutral-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-neutral-900 text-white rounded-sm">
                    <QrCode size={20} />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-sm text-forme-text-primary">
                      QRIS Instan
                    </h4>
                    <p className="text-[11px] text-forme-text-secondary mt-0.5">
                      GoPay, OVO, Dana, ShopeePay, BCA
                    </p>
                  </div>
                </div>
                <p className="text-xs text-forme-text-secondary mt-3 leading-relaxed">
                  Scan barcode QRIS standar nasional dari smartphone Anda lalu upload tangkapan layar bukti.
                </p>
              </div>
            </div>
          </section>

          {/* STEP 3: ORDER NOTES */}
          <section className="bg-white border border-forme-border p-6 rounded-sm space-y-3">
            <label className="block font-heading font-bold text-xs uppercase tracking-wider text-forme-text-primary">
              Catatan Khusus untuk Tim FORME (Opsional)
            </label>
            <textarea
              rows={2}
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              placeholder="Contoh: Titipkan paket di pos satpam atau gunakan packing double kardus..."
              className="w-full text-xs p-3 bg-neutral-50 border border-forme-border rounded-sm focus:outline-none focus:border-forme-primary focus:bg-white"
            />
          </section>
        </div>

        {/* RIGHT COLUMN: ORDER SUMMARY SNAPSHOT */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-forme-border p-6 rounded-sm shadow-sm space-y-5 sticky top-24">
            <h3 className="font-heading font-bold text-base text-forme-text-primary tracking-wide border-b border-forme-border pb-3">
              Ringkasan Pembayaran
            </h3>

            {/* Item list mini */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 text-xs">
                  <img
                    src={getFullImageUrl(item.primaryImage)}
                    alt={item.productName}
                    className="w-12 h-14 object-cover rounded-sm border shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-forme-text-primary truncate">{item.productName}</p>
                    <p className="text-[11px] text-forme-text-secondary">
                      {item.color} • {item.size} • {item.quantity}x
                    </p>
                  </div>
                  <span className="font-semibold text-forme-text-primary shrink-0">
                    {formatRupiah(item.subtotal)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="border-t border-forme-border pt-4 space-y-2.5 text-xs">
              <div className="flex justify-between text-forme-text-secondary">
                <span>Subtotal ({cart?.totalItems} pcs)</span>
                <span className="font-semibold text-forme-text-primary">
                  {formatRupiah(subtotal)}
                </span>
              </div>

              <div className="flex justify-between text-forme-text-secondary">
                <span>Tarif Pengiriman ({selectedAddress?.shippingZone?.name || 'Belum dipilih'})</span>
                <span className="font-semibold text-forme-text-primary">
                  {formatRupiah(shippingCost)}
                </span>
              </div>

              <div className="border-t border-forme-border pt-3 flex justify-between items-baseline">
                <span className="font-heading font-bold text-sm text-forme-text-primary">
                  Total Pembayaran
                </span>
                <span className="font-heading font-black text-xl text-forme-text-primary">
                  {formatRupiah(grandTotal)}
                </span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full text-xs uppercase tracking-widest font-bold py-3.5"
              onClick={handleConfirmOrder}
              disabled={submitting || !selectedAddressId}
              isLoading={submitting}
            >
              Konfirmasi & Buat Pesanan
            </Button>

            <div className="text-[11px] text-forme-text-secondary space-y-1.5 pt-2 border-t border-neutral-100">
              <p>✓ Stok produk dipotong otomatis saat pesanan dibuat</p>
              <p>✓ Disediakan waktu pembayaran 24 jam</p>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: ADD NEW ADDRESS */}
      <Modal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        title="Tambah Alamat Pengiriman Baru"
      >
        <form onSubmit={handleCreateAddress} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="Label Alamat"
              placeholder="e.g. Rumah, Kantor"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              required
            />
            <InputField
              label="Nama Penerima"
              placeholder="Ahmad Pratama"
              value={newRecipient}
              onChange={(e) => setNewRecipient(e.target.value)}
              required
            />
          </div>

          <InputField
            label="Nomor Telepon / WhatsApp"
            placeholder="081234567890"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-semibold tracking-wider text-forme-text-primary uppercase mb-1.5">
              Alamat Lengkap Jalan / Nomor Bangunan
            </label>
            <textarea
              rows={2}
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              placeholder="Jl. Senopati Raya No. 45, RT 01/RW 03..."
              className="w-full p-2.5 text-xs border border-forme-border rounded-sm focus:outline-none focus:border-forme-primary"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <InputField
              label="Kota/Kab"
              placeholder="Jakarta Selatan"
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
              required
            />
            <InputField
              label="Provinsi"
              placeholder="DKI Jakarta"
              value={newProvince}
              onChange={(e) => setNewProvince(e.target.value)}
              required
            />
            <InputField
              label="Kode Pos"
              placeholder="12190"
              value={newPostal}
              onChange={(e) => setNewPostal(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-wider text-forme-text-primary uppercase mb-1.5">
              Pilih Zona Pengiriman Sesuai Wilayah
            </label>
            <select
              value={newZoneId}
              onChange={(e) => setNewZoneId(e.target.value)}
              className="w-full p-2.5 text-xs bg-white border border-forme-border rounded-sm focus:outline-none focus:border-forme-primary"
            >
              {shippingZones.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name} — {formatRupiah(Number(z.rate))} ({z.description || ''})
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setIsAddressModalOpen(false)}
            >
              Batal
            </Button>
            <Button type="submit" variant="primary" size="md" isLoading={creatingAddress}>
              Simpan & Gunakan Alamat
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
