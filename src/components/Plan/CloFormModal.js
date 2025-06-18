"use client";

import { useEffect, useState } from "react";
import apiService from "@/app/services/apiServices";

export default function CloFormModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    nama_clo: "",
    nomor_clo: "",
    matkul_id: "",
    pi_id: "",
    plo_id: "",
  });

  const [matkulList, setMatkulList] = useState([]);
  const [piList, setPiList] = useState([]);
  const [ploList, setPloList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const aktif = await apiService.get("/kurikulum/active");

      const [matkul, plo] = await Promise.all([
        apiService.get(`/matkul/by-kurikulum?id=${aktif.kurikulum_id}`),
        apiService.get(`/plo/by-kurikulum?id=${aktif.kurikulum_id}`),
      ]);

      setMatkulList(matkul);
      setPloList(plo);
    };

    fetchData();
  }, []);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "plo_id") {
      setForm((prev) => ({ ...prev, pi_id: "" }));
      if (value) {
        const pi = await apiService.get(`/pi/by-plo?id=${value}`);
        setPiList(pi);
      } else {
        setPiList([]);
      }
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await apiService.post("/clo/create", {
        ...form,
        matkul_id: parseInt(form.matkul_id),
        pi_id: parseInt(form.pi_id),
        plo_id: parseInt(form.plo_id),
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Gagal simpan CLO:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full flex justify-center items-start mt-20 z-50">
      <div className="bg-white border border-gray-200 rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Tambah CLO</h2>

        <div className="space-y-3">
          {/* Mata Kuliah */}
          <select
            name="matkul_id"
            className="w-full border border-gray-300 px-3 py-2 rounded"
            value={form.matkul_id}
            onChange={handleChange}
          >
            <option value="">Pilih Mata Kuliah</option>
            {matkulList.map((m) => (
              <option key={m.matkul_id} value={m.matkul_id}>
                {m.nama_matkul}
              </option>
            ))}
          </select>

          {/* PLO */}
          <select
            name="plo_id"
            className="w-full border border-gray-300 px-3 py-2 rounded"
            value={form.plo_id}
            onChange={handleChange}
          >
            <option value="">Pilih PLO</option>
            {ploList.map((p) => (
              <option key={p.plo_id} value={p.plo_id}>
                PLO {p.nomor_plo}
              </option>
            ))}
          </select>

          {/* PI */}
          <select
            name="pi_id"
            className="w-full border border-gray-300 px-3 py-2 rounded"
            value={form.pi_id}
            onChange={handleChange}
          >
            <option value="">Pilih PI</option>
            {piList.map((pi) => (
              <option key={pi.pi_id} value={pi.pi_id}>
                PI {pi.nomor_pi}
              </option>
            ))}
          </select>

          {/* Nomor CLO */}
          <input
            name="nomor_clo"
            placeholder="Nomor CLO"
            className="w-full border border-gray-300 px-3 py-2 rounded"
            onChange={handleChange}
            value={form.nomor_clo}
          />

          {/* Nama CLO */}
          <input
            name="nama_clo"
            placeholder="Nama CLO"
            className="w-full border border-gray-300 px-3 py-2 rounded"
            onChange={handleChange}
            value={form.nama_clo}
          />
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}
