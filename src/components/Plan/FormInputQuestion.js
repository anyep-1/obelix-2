"use client";

import { useEffect, useState } from "react";
import apiService from "@/app/services/apiServices";

const FormInputQuestion = ({ onSuccess }) => {
  const [form, setForm] = useState({
    nama_question: "",
    clo_id: "",
    tool_id: "",
  });

  const [cloOptions, setCloOptions] = useState([]);
  const [toolOptions, setToolOptions] = useState([]);
  const [loading, setLoading] = useState(false); // ✅ state loading

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cloRes = await apiService.get("/clo/from-active-kurikulum");
        const toolRes = await apiService.get("/input/toolsAssesment");

        setCloOptions(cloRes.cloList || []);
        setToolOptions(toolRes.tools || []);
      } catch (err) {
        console.error("❌ Gagal ambil data CLO/Tools:", err);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const { nama_question, clo_id, tool_id } = form;

    if (!nama_question || !clo_id || !tool_id) {
      alert("Semua field wajib diisi!");
      return;
    }

    try {
      setLoading(true);
      await apiService.post("/input/question", [
        {
          nama_question,
          clo_id: parseInt(clo_id),
          tool_id: parseInt(tool_id),
        },
      ]);
      onSuccess?.();
    } catch (err) {
      console.error("❌ Gagal menyimpan question:", err);
      alert("Gagal menyimpan data question.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1 font-medium">Nama Question</label>
        <input
          type="text"
          name="nama_question"
          value={form.nama_question}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Pilih CLO</label>
        <select
          name="clo_id"
          value={form.clo_id}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        >
          <option value="">-- Pilih CLO --</option>
          {cloOptions.map((clo) => (
            <option key={clo.clo_id} value={clo.clo_id}>
              {clo.tb_matkul?.nama_matkul} - {clo.nama_clo}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Pilih Tools</label>
        <select
          name="tool_id"
          value={form.tool_id}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        >
          <option value="">-- Pilih Tools --</option>
          {toolOptions.map((tool) => (
            <option key={tool.tool_id} value={tool.tool_id}>
              {tool.nama_tools}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`px-4 py-2 rounded text-white ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600"
        }`}
      >
        {loading ? "Menyimpan..." : "Simpan"}
      </button>
    </form>
  );
};

export default FormInputQuestion;
