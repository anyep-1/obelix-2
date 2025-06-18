"use client";

import apiService from "@/app/services/apiServices";
import { useState } from "react";

const FormToolsAssessment = ({ onSuccess }) => {
  const [namaTools, setNamaTools] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddTool = async (e) => {
    e.preventDefault();

    if (loading || !namaTools.trim()) return;

    setLoading(true);
    try {
      await apiService.post("/input/toolsAssesment", [
        { nama_tools: namaTools.trim() },
      ]);
      setNamaTools("");
      onSuccess?.(); // panggil callback jika ada
    } catch (err) {
      console.error("❌ Gagal menambahkan tools:", err);
      alert("Gagal menyimpan data tools.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleAddTool} className="mb-4 flex gap-2">
      <input
        type="text"
        value={namaTools}
        onChange={(e) => setNamaTools(e.target.value)}
        placeholder="Nama Tools"
        className="border p-2 rounded w-full"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className={`px-4 py-2 rounded text-white ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600"
        }`}
      >
        {loading ? "Menambahkan..." : "Add"}
      </button>
    </form>
  );
};

export default FormToolsAssessment;
