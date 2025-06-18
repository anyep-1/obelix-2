"use client";

import { useEffect, useState } from "react";

export default function EditModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  defaultData,
}) {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData(defaultData || {});
  }, [defaultData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validasi input untuk nomor CLO, PLO (hanya angka integer positif)
    if (["nomor_clo", "nomor_plo"].includes(name)) {
      if (!/^\d*$/.test(value)) return;
    }

    // Validasi input untuk nomor PI (format angka titik, misal 1.1, 2.3)
    if (name === "nomor_pi") {
      if (!/^\d*\.?\d*$/.test(value)) return;
    }

    // Validasi angka positif untuk jumlah_sks dan tahun_kurikulum
    if (["jumlah_sks", "tahun_kurikulum"].includes(name)) {
      const numeric = parseInt(value);
      if (numeric < 0 || isNaN(numeric)) return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      "tahun_kurikulum" in formData &&
      (!/^\d{4}$/.test(formData.tahun_kurikulum) ||
        parseInt(formData.tahun_kurikulum) < 0)
    ) {
      alert("Tahun harus berupa angka positif 4 digit.");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      setLoading(false);
    } catch (err) {
      console.error("Gagal menyimpan:", err);
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/10">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.entries(formData).map(([key, value]) => {
            if (key === "tingkat") {
              return (
                <div key={key}>
                  <label className="block text-sm mb-1 capitalize">
                    Tingkat
                  </label>
                  <select
                    name="tingkat"
                    value={value}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    disabled={loading}
                  >
                    <option value="">Pilih Tingkat</option>
                    <option value="Tingkat 1">Tingkat 1</option>
                    <option value="Tingkat 2">Tingkat 2</option>
                    <option value="Tingkat 3">Tingkat 3</option>
                    <option value="Tingkat 4">Tingkat 4</option>
                  </select>
                </div>
              );
            }

            if (key === "semester") {
              return (
                <div key={key}>
                  <label className="block text-sm mb-1 capitalize">
                    Semester
                  </label>
                  <select
                    name="semester"
                    value={value}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    disabled={loading}
                  >
                    <option value="">Pilih Semester</option>
                    <option value="Ganjil">Ganjil</option>
                    <option value="Genap">Genap</option>
                  </select>
                </div>
              );
            }

            return (
              <div key={key}>
                <label className="block text-sm mb-1 capitalize">{key}</label>
                <input
                  name={key}
                  value={value}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  type="text"
                  disabled={loading}
                />
              </div>
            );
          })}

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
