"use client";

import { useState, useRef } from "react";
import apiService from "@/app/services/apiServices";
import FileUploader from "@/components/all/FIleUploader";
import Alert from "@/components/all/Alert";

const InputTools = () => {
  const [toolsData, setToolsData] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef(null);

  const expectedHeaders = ["nama_tools"];

  const handleSubmit = async () => {
    if (!toolsData.length) {
      setErrorMsg("File kosong atau belum diunggah.");
      setSuccessMsg("");
      return;
    }

    try {
      const res = await apiService.post("/input/toolsAssesment", toolsData);
      if (res.success || res.status === 201) {
        setSuccessMsg("Data tools berhasil disimpan.");
        setErrorMsg("");
        setToolsData([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        setErrorMsg(res.message || "Gagal menyimpan data.");
        setSuccessMsg("");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Terjadi kesalahan saat mengirim data.");
      setSuccessMsg("");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow mt-10">
      <h1 className="text-xl font-semibold text-center text-gray-800 mb-6">
        Upload Tools Assessment
      </h1>

      <div className="mb-6">
        <h2 className="font-semibold text-lg mb-2 text-blue-700">Data Tools</h2>
        <FileUploader
          ref={fileInputRef}
          label="Pilih File Tools (.csv atau .xlsx)"
          expectedHeaders={expectedHeaders}
          setData={setToolsData}
          onError={setErrorMsg}
          borderColor="border-blue-400"
          textColor="text-blue-700"
          iconColor="text-blue-500"
          bgHoverColor="hover:bg-blue-50"
        />
        <button
          onClick={handleSubmit}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Submit Tools
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
    </div>
  );
};

export default InputTools;
