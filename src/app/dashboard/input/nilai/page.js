"use client";

import React, { useState, useRef } from "react";
import Alert from "@/components/all/Alert";
import apiService from "@/app/services/apiServices";
import FileUploader from "@/components/all/FIleUploader";

const InputNilaiMahasiswa = () => {
  const [nilaiData, setNilaiData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [skippedItems, setSkippedItems] = useState([]);
  const [loading, setLoading] = useState(false); // ✅ Tambah loading state
  const fileInputRef = useRef(null);

  const expectedHeaders = [
    "nim",
    "nama",
    "kode_matkul",
    "nilai",
    "clo",
    "question",
    "tahun_akademik",
  ];

  const handleSubmit = async () => {
    if (!nilaiData.length) {
      setError("Data kosong. Upload file terlebih dahulu.");
      setSuccess("");
      setSkippedItems([]);
      return;
    }

    setLoading(true); // ✅ Mulai loading
    try {
      const res = await apiService.post("/input/nilai", nilaiData);
      const { inserted, skipped, skippedItems, error } = res;

      if (error) {
        setError(error || "Gagal mengirim data.");
        setSuccess("");
        setSkippedItems([]);
        return;
      }

      let message = `✅ ${inserted} nilai berhasil disimpan.`;
      if (skipped > 0) {
        message += `\n❌ ${skipped} nilai dilewati.`;
      }

      setSuccess(message);
      setError("");
      setSkippedItems(skippedItems || []);
      setNilaiData([]);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = null;
    } catch (err) {
      console.error("ERR:", err?.response?.data || err.message);
      setError("Terjadi kesalahan saat mengirim data.");
      setSuccess("");
      setSkippedItems([]);
    } finally {
      setLoading(false); // ✅ Selesai loading
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 mt-10 bg-white shadow-lg rounded-xl border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Upload Nilai Mahasiswa
      </h2>

      <div className="mb-8 border p-4 rounded-lg shadow-sm hover:shadow-md transition">
        <h3 className="text-lg font-semibold mb-3">Data Nilai</h3>

        <FileUploader
          ref={fileInputRef}
          label="Pilih file Excel (.xlsx)"
          expectedHeaders={expectedHeaders}
          setData={(data) => {
            setNilaiData(data);
            setSelectedFile(fileInputRef.current?.files?.[0] || null);
          }}
          onError={setError}
          borderColor="border-indigo-400"
          textColor="text-indigo-700"
          iconColor="text-indigo-500"
          bgHoverColor="hover:bg-indigo-50"
          acceptedTypes=".xlsx"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`mt-4 w-full py-2 rounded transition ${
            loading
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          {loading ? "Menyimpan..." : "Submit Nilai"}
        </button>
      </div>

      {error && (
        <Alert.ErrorAlert message={error} onClose={() => setError("")} />
      )}
      {success && (
        <Alert.SuccessAlert message={success} onClose={() => setSuccess("")} />
      )}

      {skippedItems.length > 0 && (
        <div className="mt-6 bg-yellow-50 border border-yellow-300 text-yellow-800 p-4 rounded-lg text-sm max-h-60 overflow-y-auto">
          <p className="font-semibold mb-2">Data yang tidak masuk:</p>
          <ul className="list-disc pl-5 space-y-1">
            {skippedItems.map((item, index) => (
              <li key={index}>
                <span className="font-medium">NIM:</span> {item.item?.nim} -{" "}
                <span className="italic">{item.reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default InputNilaiMahasiswa;
