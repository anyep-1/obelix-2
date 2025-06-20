"use client";

import { useState, useEffect } from "react";
import apiService from "@/app/services/apiServices";

const FormInputKelasDosen = ({ onSuccess }) => {
  const [tahun, setTahun] = useState("");
  const [kelas, setKelas] = useState("");
  const [dosenId, setDosenId] = useState("");
  const [matkulId, setMatkulId] = useState("");
  const [dosenList, setDosenList] = useState([]);
  const [matkulList, setMatkulList] = useState([]);
  const [loading, setLoading] = useState(false); // 👈 loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const kurikulum = await apiService.get("/kurikulum/active");

        const dosenRes = await apiService.get("/dosen/all");
        const matkulRes = await apiService.get(
          `/matkul/by-kurikulum?id=${kurikulum.kurikulum_id}`
        );

        setDosenList(dosenRes.dosen || []);
        setMatkulList(matkulRes || []);
      } catch (err) {
        console.error("Gagal mengambil data dosen/matkul:", err);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return; // cegah submit ganda
    if (!tahun || !kelas || !dosenId || !matkulId) {
      alert("Semua field wajib diisi!");
      return;
    }

    const selectedDosen = dosenList.find(
      (d) => d.dosen_id === parseInt(dosenId)
    );
    const selectedMatkul = matkulList.find(
      (m) => m.matkul_id === parseInt(matkulId)
    );

    if (!selectedDosen || !selectedMatkul) {
      alert("Dosen atau matkul tidak valid.");
      return;
    }

    const payload = [
      {
        tahun_akademik: tahun,
        kelas,
        nama_dosen: selectedDosen.nama_dosen,
        nama_matkul: selectedMatkul.nama_matkul,
      },
    ];

    try {
      setLoading(true);
      await apiService.post("/input/kelasDosen", payload);
      onSuccess();
    } catch (error) {
      console.error("Gagal submit kelas dosen:", error);
      alert("Gagal menyimpan data kelas dosen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-semibold">Tahun Akademik</label>
        <input
          className="border rounded w-full px-3 py-2"
          value={tahun}
          onChange={(e) => setTahun(e.target.value)}
          required
          placeholder="Contoh: 2024/2025"
        />
      </div>
      <div>
        <label className="block font-semibold">Kelas</label>
        <input
          className="border rounded w-full px-3 py-2"
          value={kelas}
          onChange={(e) => setKelas(e.target.value)}
          required
          placeholder="Contoh: TK4501"
        />
      </div>
      <div>
        <label className="block font-semibold">Nama Dosen</label>
        <select
          className="border rounded w-full px-3 py-2"
          value={dosenId}
          onChange={(e) => setDosenId(e.target.value)}
          required
        >
          <option value="">Pilih Dosen</option>
          {dosenList.map((d) => (
            <option key={d.dosen_id} value={d.dosen_id}>
              {d.nama_dosen}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block font-semibold">Nama Mata Kuliah</label>
        <select
          className="border rounded w-full px-3 py-2"
          value={matkulId}
          onChange={(e) => setMatkulId(e.target.value)}
          required
        >
          <option value="">Pilih Mata Kuliah</option>
          {matkulList.map((m) => (
            <option key={m.matkul_id} value={m.matkul_id}>
              {m.nama_matkul}
            </option>
          ))}
        </select>
      </div>
      <button
        className={`px-4 py-2 rounded text-white ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600"
        }`}
        type="submit"
        disabled={loading}
      >
        {loading ? "Menyimpan..." : "Simpan"}
      </button>
    </form>
  );
};

export default FormInputKelasDosen;
