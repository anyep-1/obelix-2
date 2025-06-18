"use client";

import { useEffect, useState } from "react";
import apiService from "@/app/services/apiServices";

export default function PloFormModal({ onSuccess, onClose }) {
  const [kode, setKode] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [profilList, setProfilList] = useState([]);
  const [selectedProfilIds, setSelectedProfilIds] = useState([]);
  const [loading, setLoading] = useState(false); // <-- Tambahkan state loading

  useEffect(() => {
    const fetchProfil = async () => {
      try {
        const aktif = await apiService.get("/kurikulum/active");
        const res = await apiService.get(
          `/profillulusan/by-kurikulum/${aktif.kurikulum_id}`
        );
        setProfilList(res);
      } catch (err) {
        console.error("Gagal mengambil data profil lulusan:", err);
      }
    };
    fetchProfil();
  }, []);

  const handleCheckbox = (id) => {
    const numericId = Number(id);
    setSelectedProfilIds((prev) =>
      prev.includes(numericId)
        ? prev.filter((i) => i !== numericId)
        : [...prev, numericId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Mulai loading
    try {
      await apiService.post("/plo/create", {
        kode_plo: kode,
        deskripsi_plo: deskripsi,
        profilLulusanIds: selectedProfilIds,
      });
      onSuccess?.();
      onClose?.();
    } catch (err) {
      console.error(
        "❌ Gagal mengirim data:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false); // Selesai loading
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-lg p-6 rounded-xl shadow-xl border border-gray-200"
      >
        <h2 className="text-xl font-bold mb-4">Tambah PLO</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Kode PLO</label>
          <input
            type="text"
            value={kode}
            onChange={(e) => setKode(e.target.value)}
            placeholder="Misal: PLO1"
            required
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Deskripsi PLO
          </label>
          <textarea
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            placeholder="Tuliskan deskripsi..."
            required
            rows={3}
            className="w-full border px-3 py-2 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">
            Pemetaan ke Profil Lulusan
          </h3>
          {profilList.length === 0 ? (
            <p className="text-sm text-gray-500">Belum ada profil lulusan.</p>
          ) : (
            <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
              {profilList.map((p) => {
                const id = Number(p.profil_id);
                return (
                  <label
                    key={id}
                    className="flex items-start space-x-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      value={id}
                      checked={selectedProfilIds.includes(id)}
                      onChange={() => handleCheckbox(id)}
                      className="mt-1"
                    />
                    <span>{p.deskripsi_profil}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-400 text-gray-700 rounded hover:bg-gray-100"
            disabled={loading}
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded text-white ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}
