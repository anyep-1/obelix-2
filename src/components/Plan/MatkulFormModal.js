"use client";

import { useState, useEffect } from "react";
import apiService from "@/app/services/apiServices";

export default function MatkulFormModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    nama_matkul: "",
    kode_matkul: "",
    jumlah_sks: "",
    tingkat: "",
    semester: "",
  });

  const [kurikulum, setKurikulum] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchKurikulum = async () => {
      const res = await apiService.get("/kurikulum/active");
      setKurikulum(res);
    };
    fetchKurikulum();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "jumlah_sks" && parseInt(value) < 0) return;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    if (
      !form.nama_matkul ||
      !form.kode_matkul ||
      !form.jumlah_sks ||
      !form.tingkat ||
      !form.semester
    ) {
      alert("Mohon lengkapi semua field.");
      return;
    }

    try {
      setLoading(true);
      await apiService.post("/matkul", {
        ...form,
        jumlah_sks: parseInt(form.jumlah_sks),
        kurikulum_id: kurikulum.kurikulum_id,
      });
      onSuccess?.();
      onClose?.();
    } catch (err) {
      console.error("Gagal menyimpan mata kuliah:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-xl w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Tambah Mata Kuliah</h2>

        <input
          name="nama_matkul"
          placeholder="Nama Mata Kuliah"
          className="w-full border px-3 py-2 rounded mb-2"
          onChange={handleChange}
          value={form.nama_matkul}
        />
        <input
          name="kode_matkul"
          placeholder="Kode Mata Kuliah"
          className="w-full border px-3 py-2 rounded mb-2"
          onChange={handleChange}
          value={form.kode_matkul}
        />
        <input
          name="jumlah_sks"
          type="number"
          min="0"
          placeholder="Jumlah SKS"
          className="w-full border px-3 py-2 rounded mb-2"
          onChange={handleChange}
          value={form.jumlah_sks}
        />

        <select
          name="tingkat"
          className="w-full border px-3 py-2 rounded mb-2"
          value={form.tingkat}
          onChange={handleChange}
        >
          <option value="">Pilih Tingkat</option>
          <option value="Tingkat 1">Tingkat 1</option>
          <option value="Tingkat 2">Tingkat 2</option>
          <option value="Tingkat 3">Tingkat 3</option>
          <option value="Tingkat 4">Tingkat 4</option>
        </select>

        <select
          name="semester"
          className="w-full border px-3 py-2 rounded mb-4"
          value={form.semester}
          onChange={handleChange}
        >
          <option value="">Pilih Semester</option>
          <option value="Ganjil">Ganjil</option>
          <option value="Genap">Genap</option>
        </select>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
            disabled={loading}
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 rounded text-white ${
              loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}
