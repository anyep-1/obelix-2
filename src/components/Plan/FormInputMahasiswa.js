"use client";

import { useState } from "react";
import apiService from "@/app/services/apiServices";

const FormInputMahasiswa = ({ onSuccess }) => {
  const [form, setForm] = useState({
    nama: "",
    nim: "",
    kode_kelas: "",
    enroll_year: "",
  });

  const [loading, setLoading] = useState(false); // 👈 loading state

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validasi langsung: mencegah input tahun minus
    if (name === "enroll_year" && Number(value) < 0) return;

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return; // cegah double submit

    const { nama, nim, kode_kelas, enroll_year } = form;

    if (
      !nama ||
      !nim ||
      !kode_kelas ||
      !enroll_year ||
      Number(enroll_year) < 0
    ) {
      alert("Semua field wajib diisi dan tahun masuk tidak boleh minus.");
      return;
    }

    try {
      setLoading(true);
      await apiService.post("/input/mahasiswa", [form]);
      onSuccess();
    } catch (err) {
      console.error("Gagal menambahkan mahasiswa:", err);
      alert("Gagal menyimpan data mahasiswa.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1 font-medium">Nama</label>
        <input
          type="text"
          name="nama"
          value={form.nama}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
          placeholder="Masukkan Nama Mahasiswa"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">NIM</label>
        <input
          type="text"
          name="nim"
          value={form.nim}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
          placeholder="Masukkan NIM Mahasiswa"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Kode Kelas</label>
        <input
          type="text"
          name="kode_kelas"
          value={form.kode_kelas}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
          placeholder="Masukkan Kode Kelas"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Tahun Masuk</label>
        <input
          type="number"
          name="enroll_year"
          value={form.enroll_year}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
          placeholder="Contoh: 2022"
          min="0" // 👈 batasi input negatif di level UI
        />
      </div>
      <button
        type="submit"
        className={`px-4 py-2 rounded text-white ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600"
        }`}
        disabled={loading}
      >
        {loading ? "Menyimpan..." : "Simpan"}
      </button>
    </form>
  );
};

export default FormInputMahasiswa;
