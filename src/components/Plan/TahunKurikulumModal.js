"use client";

import apiService from "@/app/services/apiServices";
import { useState } from "react";

export default function TahunKurikulumModal({ onSuccess, onClose }) {
  const [tahun, setTahun] = useState("");
  const [loading, setLoading] = useState(false); // <-- Tambah state loading

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tahunNumber = parseInt(tahun);
    if (isNaN(tahunNumber) || tahunNumber < 0 || tahun.length !== 4) {
      alert("Tahun harus berupa angka 4 digit dan tidak boleh negatif.");
      return;
    }

    setLoading(true); // <-- Mulai loading
    try {
      await apiService.post("/kurikulum/create", {
        tahun_kurikulum: tahun,
        selected: false,
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Gagal simpan:", error);
    } finally {
      setLoading(false); // <-- Hentikan loading
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 pointer-events-none">
      <div className="relative w-full max-w-md pointer-events-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-xl border border-gray-200"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Tambah Tahun Kurikulum
          </h2>

          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Tahun</label>
            <input
              type="number"
              min="0"
              max="9999"
              placeholder="Contoh: 2025"
              value={tahun}
              onChange={(e) => setTahun(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading} // <-- Nonaktifkan input saat loading
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              disabled={loading} // <-- Nonaktifkan tombol saat loading
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading} // <-- Nonaktifkan submit saat loading
              className={`px-4 py-2 rounded text-white transition ${
                loading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
