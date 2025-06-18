"use client";

import apiService from "@/app/services/apiServices";
import { useState } from "react";

export default function ProfilLulusanForm({ onSuccess, onClose }) {
  const [deskripsi, setDeskripsi] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.post("/profillulusan/create", { deskripsi });
      setDeskripsi("");
      onSuccess?.();
    } catch (error) {
      console.error("Gagal simpan:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Deskripsi Profil Lulusan
        </label>
        <textarea
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          placeholder="Masukkan deskripsi profil lulusan..."
          className="w-full border rounded p-3 text-sm"
          rows={4}
          required
        />
      </div>

      <div className="flex justify-end gap-2">
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
          className={`px-4 py-2 rounded text-white ${
            loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={loading}
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );
}
