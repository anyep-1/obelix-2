"use client";

import { useEffect, useState } from "react";
import apiService from "@/app/services/apiServices";

export default function PiFormModal({ onSuccess, onClose }) {
  const [deskripsi, setDeskripsi] = useState("");
  const [nomor, setNomor] = useState("");
  const [ploList, setPloList] = useState([]);
  const [selectedPloId, setSelectedPloId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPLO = async () => {
      try {
        const aktif = await apiService.get("/kurikulum/active");
        const res = await apiService.get(
          `/plo/by-kurikulum?id=${aktif.kurikulum_id}`
        );
        setPloList(res);
        if (res.length > 0) setSelectedPloId(res[0].plo_id);
      } catch (err) {
        console.error("Gagal ambil data PLO:", err);
      }
    };
    fetchPLO();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.post("/pi/create", {
        deskripsi_pi: deskripsi,
        nomor_pi: nomor,
        plo_id: selectedPloId,
      });
      onSuccess?.();
      onClose?.();
    } catch (err) {
      console.error("Gagal menambah PI:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-start z-50 overflow-y-auto p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg mt-20 border border-gray-200"
      >
        <h2 className="text-xl font-bold mb-4 text-gray-800">Tambah PI</h2>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Nomor PI</label>
          <input
            type="text"
            value={nomor}
            onChange={(e) => setNomor(e.target.value)}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Misal: 1.1"
            required
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Deskripsi PI</label>
          <textarea
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            className="w-full border px-3 py-2 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            required
            placeholder="Tuliskan deskripsi..."
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">PLO Terkait</label>
          <select
            value={selectedPloId ?? ""}
            onChange={(e) => setSelectedPloId(Number(e.target.value))}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              {ploList.length === 0 ? "Belum ada PLO" : "Pilih PLO"}
            </option>
            {ploList.map((p) => (
              <option key={p.plo_id} value={p.plo_id}>
                PLO {p.nomor_plo}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-400 text-gray-700 rounded hover:bg-gray-100"
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
