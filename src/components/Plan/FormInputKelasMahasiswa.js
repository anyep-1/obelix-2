"use client";

import { useState } from "react";
import apiService from "@/app/services/apiServices";

const FormInputKelasMahasiswa = ({ onSuccess }) => {
  const [kodeKelas, setKodeKelas] = useState("");
  const [loading, setLoading] = useState(false); // 👈 Tambahkan state loading

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading || !kodeKelas) return;

    try {
      setLoading(true);
      await apiService.post("/input/kelasMahasiswa", [
        { kode_kelas: kodeKelas },
      ]);
      onSuccess();
    } catch (err) {
      console.error("Gagal menambahkan kelas:", err);
      alert("Gagal menyimpan data kelas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1 font-medium">Kode Kelas</label>
        <input
          type="text"
          value={kodeKelas}
          onChange={(e) => setKodeKelas(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
          placeholder="Masukkan Kode Kelas"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className={`px-4 py-2 rounded text-white ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600"
        }`}
      >
        {loading ? "Menyimpan..." : "Simpan"}
      </button>
    </form>
  );
};

export default FormInputKelasMahasiswa;
