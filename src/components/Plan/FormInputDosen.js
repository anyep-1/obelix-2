"use client";

import { useState } from "react";
import apiService from "@/app/services/apiServices";

const FormInputDosen = ({ onSuccess }) => {
  const [nama, setNama] = useState("");
  const [kode, setKode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return; // cegah double submit
    setLoading(true);

    try {
      await apiService.post("/input/dosen", [
        { nama_dosen: nama, kode_dosen: kode },
      ]);
      onSuccess();
    } catch (error) {
      console.error("Gagal simpan dosen:", error);
      alert("Terjadi kesalahan saat menyimpan data dosen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-semibold">Nama Dosen</label>
        <input
          className="border rounded w-full px-3 py-2"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          required
          placeholder="Nama Dosen"
        />
      </div>
      <div>
        <label className="block font-semibold">Kode Dosen</label>
        <input
          className="border rounded w-full px-3 py-2"
          value={kode}
          onChange={(e) => setKode(e.target.value)}
          required
          placeholder="Kode Dosen"
        />
      </div>
      <button
        className={`px-4 py-2 rounded text-white ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600"
        }`}
        type="submit"
        disabled={loading}
      >
        {loading ? "Menyimpan..." : "Simpan"}
      </button>
    </form>
  );
};

export default FormInputDosen;
