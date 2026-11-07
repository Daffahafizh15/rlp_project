import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Address, ShippingZone } from '../../types';
import { addressesApi, shippingApi } from '../../services/api';
import { formatRupiah } from '../../utils/formatters';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { InputField } from '../../components/common/InputField';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { User, MapPin, Plus, Trash2, Check, Star } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLabel, setNewLabel] = useState('Rumah');
  const [newRecipient, setNewRecipient] = useState(user?.fullName || '');
  const [newPhone, setNewPhone] = useState(user?.phone || '');
  const [newAddress, setNewAddress] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newProvince, setNewProvince] = useState('');
  const [newPostal, setNewPostal] = useState('');
  const [newZoneId, setNewZoneId] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const [addrRes, zoneRes] = await Promise.all([
        addressesApi.getAll(),
        shippingApi.getZones(),
      ]);
      setAddresses(addrRes.data);
      setShippingZones(zoneRes.data);
      if (zoneRes.data.length > 0) {
        setNewZoneId(zoneRes.data[0].id);
      }
    } catch (e) {
      console.error('Failed to load profile addresses', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addressesApi.create({
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

      await fetchAddresses();
      setIsModalOpen(false);
      setNewAddress('');
      setNewCity('');
      setNewProvince('');
      setNewPostal('');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menyimpan alamat');
    } finally {
      setSaving(false);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await addressesApi.setDefault(id);
      await fetchAddresses();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!window.confirm('Hapus alamat pengiriman ini?')) return;
    try {
      await addressesApi.delete(id);
      await fetchAddresses();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Memuat profil dan alamat..." className="py-20" />;
  }

  return (
    <div className="space-y-10">
      {/* Page Title */}
      <div className="border-b border-forme-border pb-6">
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-forme-text-primary tracking-tight">
          Profil Akun & Buku Alamat
        </h1>
        <p className="text-xs text-forme-text-secondary mt-1">
          Kelola informasi kontak dan tujuan pengiriman pesanan Anda
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white border border-forme-border p-6 rounded-sm shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-forme-border pb-3">
          <User size={18} className="text-forme-primary" />
          <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-forme-text-primary">
            Informasi Pengguna
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
          <div>
            <span className="text-forme-text-secondary block">Nama Lengkap</span>
            <span className="font-bold text-forme-text-primary text-sm mt-0.5 block">
              {user?.fullName}
            </span>
          </div>

          <div>
            <span className="text-forme-text-secondary block">Alamat Email</span>
            <span className="font-medium text-forme-text-primary mt-0.5 block">{user?.email}</span>
          </div>

          <div>
            <span className="text-forme-text-secondary block">Nomor WhatsApp / HP</span>
            <span className="font-medium text-forme-text-primary mt-0.5 block">
              {user?.phone || 'Belum diatur'}
            </span>
          </div>
        </div>
      </div>

      {/* Address Book Card */}
      <div className="bg-white border border-forme-border p-6 rounded-sm shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-forme-border pb-3">
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-forme-primary" />
            <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-forme-text-primary">
              Buku Alamat Pengiriman
            </h3>
          </div>
          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)} className="gap-1.5">
            <Plus size={14} />
            <span>Tambah Alamat</span>
          </Button>
        </div>

        {addresses.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-forme-border rounded-sm">
            <p className="text-xs text-forme-text-secondary">Belum ada alamat pengiriman terdaftar.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`p-5 rounded-sm border transition-all relative flex flex-col justify-between ${
                  addr.isDefault
                    ? 'border-forme-primary bg-neutral-50/70 shadow-sm'
                    : 'border-forme-border bg-white hover:border-neutral-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-xs uppercase tracking-wider text-forme-text-primary">
                      {addr.label}
                    </span>
                    {addr.isDefault && (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-forme-primary text-white font-bold px-2 py-0.5 rounded-sm">
                        <Star size={10} fill="currentColor" />
                        Alamat Utama
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-bold text-forme-text-primary mt-2">
                    {addr.recipientName} ({addr.phoneNumber})
                  </p>
                  <p className="text-xs text-forme-text-secondary mt-1 leading-relaxed">
                    {addr.fullAddress}, {addr.city}, {addr.province} {addr.postalCode}
                  </p>

                  <div className="mt-3 pt-2 border-t border-neutral-200 text-[11px] flex justify-between items-center text-neutral-600">
                    <span>Zona: {addr.shippingZone?.name}</span>
                    <span className="font-bold text-forme-text-primary">
                      {formatRupiah(Number(addr.shippingZone?.rate || 0))}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                  {!addr.isDefault ? (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      className="text-[11px] font-semibold text-forme-primary hover:underline flex items-center gap-1"
                    >
                      <Check size={13} />
                      <span>Jadikan Alamat Utama</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-neutral-400 font-medium">Alamat Default Saat Checkout</span>
                  )}

                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="text-neutral-400 hover:text-forme-status-danger p-1"
                    title="Hapus Alamat"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Add Address */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
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
            label="Nomor WhatsApp"
            placeholder="081234567890"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-semibold tracking-wider text-forme-text-primary uppercase mb-1.5">
              Alamat Lengkap Jalan / Gedung
            </label>
            <textarea
              rows={2}
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              placeholder="Jl. Senopati Raya No. 45..."
              className="w-full p-2.5 text-xs border border-forme-border rounded-sm focus:outline-none focus:border-forme-primary"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <InputField
              label="Kota"
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
              Zona Tarif Flat Pengiriman
            </label>
            <select
              value={newZoneId}
              onChange={(e) => setNewZoneId(e.target.value)}
              className="w-full p-2.5 text-xs bg-white border border-forme-border rounded-sm focus:outline-none focus:border-forme-primary"
            >
              {shippingZones.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name} — {formatRupiah(Number(z.rate))}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setIsModalOpen(false)}
            >
              Batal
            </Button>
            <Button type="submit" variant="primary" size="md" isLoading={saving}>
              Simpan Alamat
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
