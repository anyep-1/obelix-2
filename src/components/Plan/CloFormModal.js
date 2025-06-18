"use client";

import { useEffect, useState } from "react";
import apiService from "@/app/services/apiServices";

export default function CloFormModal({ onClose, onSuccess, kurikulumId }) {
  const [form, setForm] = useState({
    nama_clo: "",
    nomor_clo: "",
    matkul_id: "", // bebas pilih di modal
    pi_id: "",
    plo_id: "",
  });

  const [matkulList, setMatkulList] = useState([]);
  const [ploList, setPloList] = useState([]);
  const [piList, setPiList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!kurikulumId) return;

    async function load() {
      try {
        const [matkul, plo] = await Promise.all([
          apiService.get(`/matkul/by-kurikulum?id=${kurikulumId}`),
          apiService.get(`/plo/by-kurikulum?id=${kurikulumId}`),
        ]);
        setMatkulList(matkul);
        setPloList(plo);
      } catch (error) {
        console.error("Gagal load matkul/plo", error);
      }
    }

    load();
  }, [kurikulumId]);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "plo_id") {
      setForm((prev) => ({ ...prev, pi_id: "" }));
      if (value) {
        try {
          const pi = await apiService.get(`/pi/by-plo?id=${value}`);
          setPiList(pi);
        } catch {
          setPiList([]);
        }
      } else {
        setPiList([]);
      }
    }
  };

  const handleSubmit = async () => {
    if (
      !form.nomor_clo ||
      !form.nama_clo ||
      !form.matkul_id ||
      !form.plo_id ||
      !form.pi_id
    ) {
      alert("Semua field harus diisi");
      return;
    }

    setLoading(true);
    try {
      await apiService.post("/clo/create", {
        nomor_clo: form.nomor_clo,
        nama_clo: form.nama_clo,
        matkul_id: parseInt(form.matkul_id),
        plo_id: parseInt(form.plo_id),
        pi_id: parseInt(form.pi_id),
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Gagal simpan CLO:", error);
      alert("Gagal menyimpan CLO");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full flex justify-center items-start mt-20 z-50">
      <div className="bg-white border border-gray-200 rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Tambah CLO</h2>

        <div className="space-y-3">
          {/* Dropdown matkul bebas pilih */}
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

          {/* Dropdown PLO */}
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

          {/* Dropdown PI */}
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

          {/* Input nomor CLO */}
          <input
            name="nomor_clo"
            placeholder="Nomor CLO"
            className="w-full border border-gray-300 px-3 py-2 rounded"
            value={form.nomor_clo}
            onChange={handleChange}
          />

          {/* Input nama CLO */}
          <input
            name="nama_clo"
            placeholder="Nama CLO"
            className="w-full border border-gray-300 px-3 py-2 rounded"
            value={form.nama_clo}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
            disabled={loading}
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
