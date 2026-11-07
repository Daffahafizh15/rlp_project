import React, { useEffect, useState } from 'react';
import { ShippingZone } from '../../types';
import { shippingApi } from '../../services/api';
import { formatRupiah } from '../../utils/formatters';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { InputField } from '../../components/common/InputField';
import { Plus, Edit3, Truck, Trash2 } from 'lucide-react';

export const AdminShippingPage: React.FC = () => {
  const [zones, setZones] = useState<ShippingZone[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<ShippingZone | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [rate, setRate] = useState<number>(15000);
  const [saving, setSaving] = useState(false);

  const fetchZones = async () => {
    setLoading(true);
    try {
      const res = await shippingApi.getZones(true);
      setZones(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  const handleOpenAdd = () => {
    setEditingZone(null);
    setName('');
    setDescription('');
    setRate(20000);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (zone: ShippingZone) => {
    setEditingZone(zone);
    setName(zone.name);
    setDescription(zone.description || '');
    setRate(Number(zone.rate));
    setIsModalOpen(true);
  };

  const handleSaveZone = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingZone) {
        await shippingApi.updateZone(editingZone.id, {
          name: name.trim(),
          description: description.trim() || undefined,
          rate,
        });
      } else {
        await shippingApi.createZone({
          name: name.trim(),
          description: description.trim() || undefined,
          rate,
        });
      }
      await fetchZones();
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menyimpan zona');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (zone: ShippingZone) => {
    try {
      await shippingApi.updateZone(zone.id, { isActive: !zone.isActive });
      await fetchZones();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Memuat pengaturan zona pengiriman..." className="py-24" />;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 border border-neutral-200 rounded-sm shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-bold text-lg text-forme-text-primary">
            Pengaturan Tarif Flat Zona Pengiriman
          </h2>
          <p className="text-xs text-forme-text-secondary mt-0.5">
            Kelola wilayah cakupan dan tarif flat ongkos kirim toko FORME
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          className="gap-2 text-xs uppercase tracking-wider font-bold"
          onClick={handleOpenAdd}
        >
          <Plus size={16} />
          <span>Tambah Zona Baru</span>
        </Button>
      </div>

      <div className="bg-white border border-neutral-200 rounded-sm shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-6">Nama Zona</th>
              <th className="py-3.5 px-6">Cakupan Wilayah</th>
              <th className="py-3.5 px-6">Tarif Flat</th>
              <th className="py-3.5 px-6 text-center">Status</th>
              <th className="py-3.5 px-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {zones.map((zone) => (
              <tr key={zone.id} className="hover:bg-neutral-50 transition-colors">
                <td className="py-4 px-6 font-bold text-forme-text-primary text-sm">
                  {zone.name}
                </td>
                <td className="py-4 px-6 text-neutral-600 max-w-sm">
                  {zone.description || '-'}
                </td>
                <td className="py-4 px-6 font-heading font-bold text-base text-forme-text-primary">
                  {formatRupiah(zone.rate)}
                </td>
                <td className="py-4 px-6 text-center">
                  <button
                    onClick={() => handleToggleStatus(zone)}
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      zone.isActive
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-neutral-100 text-neutral-500'
                    }`}
                  >
                    {zone.isActive ? 'Aktif' : 'Nonaktif'}
                  </button>
                </td>
                <td className="py-4 px-6 text-right">
                  <button
                    onClick={() => handleOpenEdit(zone)}
                    className="p-1.5 text-neutral-600 hover:text-forme-primary hover:bg-neutral-100 rounded-sm transition-colors"
                    title="Ubah Tarif / Informasi"
                  >
                    <Edit3 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL EDIT / CREATE ZONE */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingZone ? `Ubah Tarif: ${editingZone.name}` : 'Tambah Zona Pengiriman Baru'}
      >
        <form onSubmit={handleSaveZone} className="space-y-4 text-xs">
          <InputField
            label="Nama Zona"
            placeholder="e.g. Zona 1 - Jabodetabek"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <InputField
            label="Tarif Pengiriman Flat (Rp)"
            type="number"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            required
          />

          <div>
            <label className="block text-xs font-semibold tracking-wider text-forme-text-primary uppercase mb-1.5">
              Cakupan Wilayah / Estimasi Waktu
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Area Jakarta, Bogor, Depok, Tangerang, Bekasi (1-2 hari kerja)..."
              className="w-full p-2.5 text-xs border border-forme-border rounded-sm focus:outline-none focus:border-forme-primary"
            />
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
              Simpan Zona
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
