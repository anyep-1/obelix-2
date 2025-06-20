"use client";

import { useState, useEffect } from "react";
import Select from "react-select";
import apiService from "@/app/services/apiServices";

const FormInputKelasDosen = ({ onSuccess }) => {
  const [tahun, setTahun] = useState("");
  const [kelas, setKelas] = useState("");
  const [dosenId, setDosenId] = useState(null); // pakai object react-select
  const [matkulId, setMatkulId] = useState(null);
  const [dosenList, setDosenList] = useState([]);
  const [matkulList, setMatkulList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const kurikulum = await apiService.get("/kurikulum/active");

        const dosenRes = await apiService.get("/dosen/by-kurikulum");
        const matkulRes = await apiService.get(
          `/matkul/by-kurikulum?id=${kurikulum.kurikulum_id}`
        );

        setDosenList(
          (dosenRes.dosen || []).map((d) => ({
            value: d.dosen_id,
            label: d.nama_dosen,
          }))
        );
        setMatkulList(
          (matkulRes || []).map((m) => ({
            value: m.matkul_id,
            label: m.nama_matkul,
          }))
        );
      } catch (err) {
        console.error("Gagal mengambil data dosen/matkul:", err);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;
    if (!tahun || !kelas || !dosenId || !matkulId) {
      alert("Semua field wajib diisi!");
      return;
    }

    const payload = [
      {
        tahun_akademik: tahun,
        kelas,
        nama_dosen: dosenId.label,
        nama_matkul: matkulId.label,
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
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-h-[80vh] overflow-y-auto pr-2"
    >
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
        <label className="block font-semibold mb-1">Nama Dosen</label>
        <Select
          options={dosenList}
          value={dosenId}
          onChange={setDosenId}
          isSearchable
          placeholder="Pilih Dosen"
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">Nama Mata Kuliah</label>
        <Select
          options={matkulList}
          value={matkulId}
          onChange={setMatkulId}
          isSearchable
          placeholder="Pilih Mata Kuliah"
        />
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
