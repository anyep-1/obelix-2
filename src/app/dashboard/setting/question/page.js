"use client";

import { useState, useRef } from "react";
import apiService from "@/app/services/apiServices";
import FileUploader from "@/components/all/FIleUploader";
import Alert from "@/components/all/Alert";

const InputQuestion = () => {
  const [questionData, setQuestionData] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [skippedItems, setSkippedItems] = useState([]);
  const [loading, setLoading] = useState(false); // ✅ loading state

  const fileInputRef = useRef(null);
  const expectedHeaders = ["nama_question", "clo", "tools", "nama_matkul"];

  const handleSubmit = async () => {
    if (!questionData.length) {
      setErrorMsg("File kosong atau belum diunggah.");
      setSuccessMsg("");
      setSkippedItems([]);
      return;
    }

    setLoading(true); // ✅ mulai loading
    try {
      const res = await apiService.post("/input/question", questionData);

      if (res.status === 201 || res.success) {
        const { inserted, skipped, skippedItems } = res;

        let message = `✅ ${inserted} pertanyaan berhasil ditambahkan.`;
        if (skipped > 0) {
          message += `\n❌ ${skipped} pertanyaan dilewati.`;
        }

        setSuccessMsg(message);
        setErrorMsg("");
        setSkippedItems(skippedItems || []);
        setQuestionData([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        setErrorMsg(res.message || "Gagal mengirim data.");
        setSuccessMsg("");
        setSkippedItems([]);
      }
    } catch (err) {
      console.error("ERR:", err);
      setErrorMsg("Terjadi kesalahan saat mengirim data.");
      setSuccessMsg("");
      setSkippedItems([]);
    } finally {
      setLoading(false); // ✅ selesai loading
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow mt-10">
      <h1 className="text-xl font-semibold text-center text-gray-800 mb-6">
        Upload Data Question
      </h1>

      <div className="mb-6">
        <h2 className="font-semibold text-lg mb-2 text-purple-700">
          Data Question
        </h2>
        <FileUploader
          ref={fileInputRef}
          label="Pilih File Pertanyaan (.csv atau .xlsx)"
          expectedHeaders={expectedHeaders}
          setData={setQuestionData}
          onError={setErrorMsg}
          borderColor="border-purple-400"
          textColor="text-purple-700"
          iconColor="text-purple-500"
          bgHoverColor="hover:bg-purple-50"
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`mt-4 w-full py-2 rounded text-white ${
            loading
              ? "bg-purple-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {loading ? "Menyimpan..." : "Submit Pertanyaan"}
        </button>
      </div>

      {errorMsg && (
        <Alert.ErrorAlert message={errorMsg} onClose={() => setErrorMsg("")} />
      )}
      {successMsg && (
        <Alert.SuccessAlert
          message={successMsg}
          onClose={() => setSuccessMsg("")}
        />
      )}

      {skippedItems.length > 0 && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-300 rounded-md text-sm text-yellow-800">
          <h4 className="font-semibold mb-2">Data yang dilewati:</h4>
          <ul className="list-disc list-inside space-y-1">
            {skippedItems.map((item, i) => (
              <li key={i}>
                <span className="font-medium text-gray-800">
                  {item?.item?.nama_question || "Pertanyaan tidak diketahui"}
                </span>{" "}
                — {item.reason}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default InputQuestion;
