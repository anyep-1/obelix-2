"use client";

import apiService from "@/app/services/apiServices";
import { useState, useEffect } from "react";

const HitungSkor = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [templateData, setTemplateData] = useState(null);
  const [hasilSkor, setHasilSkor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await apiService.get("/templateRubrik/getTemplate");
        setTemplates(response.templates || []);
      } catch (error) {
        console.error("Error fetching templates:", error);
      }
    };
    fetchTemplates();
  }, []);

  const handleTemplateChange = async (event) => {
    const templateId = event.target.value;
    setSelectedTemplate(templateId);
    setHasilSkor(null);
    setErrorMsg("");

    if (!templateId) {
      setTemplateData(null);
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.get("/templateRubrik/getTemplate", {
        id: templateId,
      });
      setTemplateData(response);
    } catch (error) {
      console.error("Error fetching template data:", error);
      setTemplateData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSkor = async () => {
    if (!selectedTemplate) return;

    setGenerating(true);
    setErrorMsg("");
    try {
      const response = await apiService.post("/skor/mk", {
        template_id: selectedTemplate,
      });
      const data = response.data;
      setHasilSkor(Array.isArray(data) ? data[0] : data);
    } catch (error) {
      console.error("Error generating skor:", error);
      setHasilSkor(null);
      setErrorMsg(
        error.response?.data?.message || "Terjadi kesalahan saat generate skor."
      );
    } finally {
      setGenerating(false);
    }
  };

  const safeFixed = (num) => (typeof num === "number" ? num.toFixed(2) : "-");

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Generate Skor Mata Kuliah
      </h2>

      {errorMsg && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          <span>{errorMsg}</span>
          <button
            className="ml-2 text-sm underline"
            onClick={() => setErrorMsg("")}
          >
            Tutup
          </button>
        </div>
      )}

      <div className="mb-6">
        <label htmlFor="template-select" className="block mb-2 font-medium">
          Pilih Mata Kuliah
        </label>
        <select
          id="template-select"
          value={selectedTemplate}
          onChange={handleTemplateChange}
          disabled={loading}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">-- Pilih Mata Kuliah --</option>
          {templates.map((template) => {
            const cloText = template?.clo?.length
              ? ` | CLO: ${template.clo.join(", ")}`
              : "";
            return (
              <option key={template.template_id} value={template.template_id}>
                {template.matkul} - {template.kurikulum}
                {cloText}
              </option>
            );
          })}
        </select>
      </div>

      <div className="flex justify-center mb-6">
        <button
          onClick={handleGenerateSkor}
          disabled={generating || !selectedTemplate}
          className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {generating ? "Menghitung..." : "Generate Skor"}
        </button>
      </div>

      {hasilSkor?.counts && (
        <div>
          <h3 className="text-xl font-semibold mb-4 text-center">
            Hasil ({hasilSkor.total ?? 0} sampel)
          </h3>

          <table className="w-full text-center border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">Exemplary (4)</th>
                <th className="border px-2 py-1">Satisfactory (3)</th>
                <th className="border px-2 py-1">Developing (2)</th>
                <th className="border px-2 py-1">Unsatisfactory (1)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-2 py-1">
                  {hasilSkor.counts.exc ?? 0}
                </td>
                <td className="border px-2 py-1">
                  {hasilSkor.counts.sat ?? 0}
                </td>
                <td className="border px-2 py-1">
                  {hasilSkor.counts.dev ?? 0}
                </td>
                <td className="border px-2 py-1">
                  {hasilSkor.counts.uns ?? 0}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-4 text-center text-sm space-y-2">
            <p>
              <strong>Skor:</strong> ({hasilSkor.counts.exc ?? 0}×4 +{" "}
              {hasilSkor.counts.sat ?? 0}×3 + {hasilSkor.counts.dev ?? 0}×2 +{" "}
              {hasilSkor.counts.uns ?? 0}×1) / {hasilSkor.total ?? 0} ={" "}
              {safeFixed(hasilSkor.skor)}
            </p>
            <p>
              <strong>Persen kelulusan:</strong> (({hasilSkor.counts.exc ?? 0} +{" "}
              {hasilSkor.counts.sat ?? 0}) / {hasilSkor.total ?? 0} × 100%) ={" "}
              {safeFixed(hasilSkor.persen_kelulusan)}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HitungSkor;
