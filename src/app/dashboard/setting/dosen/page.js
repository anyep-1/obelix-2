"use client";

import { useRef, useState } from "react";
import apiService from "@/app/services/apiServices";
import FileUploader from "@/components/all/FIleUploader";
import Alert from "@/components/all/Alert";

const InputDosenKelas = () => {
  const [dosenData, setDosenData] = useState([]);
  const [kelasData, setKelasData] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const dosenInputRef = useRef(null);
  const kelasInputRef = useRef(null);

  const expectedDosenHeaders = ["nama_dosen", "kode_dosen"];
  const expectedKelasHeaders = [
    "tahun_akademik",
    "kelas",
    "nama_dosen",
    "nama_matkul",
  ];

  const handleSubmit = async (
    data,
    endpoint,
    successMessage,
    clearFn,
    fileRef
  ) => {
    if (!data.length) {
      setErrorMsg("File kosong atau belum diunggah.");
      setSuccessMsg("");
      return;
    }

    try {
      const res = await apiService.post(endpoint, data);
      if (res.success || res.status === 201) {
        setSuccessMsg(successMessage);
        setErrorMsg("");
        clearFn([]);
        if (fileRef.current) fileRef.current.value = "";
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
        Upload Data Dosen & Kelas Dosen
      </h1>

      <div className="mb-6">
        <h2 className="font-semibold text-lg mb-2 text-blue-700">Data Dosen</h2>
        <FileUploader
          ref={dosenInputRef}
          label="Pilih File Dosen (.csv atau .xlsx)"
          expectedHeaders={expectedDosenHeaders}
          setData={setDosenData}
          onError={setErrorMsg}
          borderColor="border-blue-400"
          textColor="text-blue-700"
          iconColor="text-blue-500"
          bgHoverColor="hover:bg-blue-50"
        />
        <button
          onClick={() =>
            handleSubmit(
              dosenData,
              "/input/dosen",
              "Data dosen berhasil disimpan.",
              setDosenData,
              dosenInputRef
            )
          }
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Submit Dosen
        </button>
      </div>

      <div className="mb-6">
        <h2 className="font-semibold text-lg mb-2 text-green-700">
          Data Kelas Dosen
        </h2>
        <FileUploader
          ref={kelasInputRef}
          label="Pilih File Kelas Dosen (.csv atau .xlsx)"
          expectedHeaders={expectedKelasHeaders}
          setData={setKelasData}
          onError={setErrorMsg}
          borderColor="border-green-400"
          textColor="text-green-700"
          iconColor="text-green-500"
          bgHoverColor="hover:bg-green-50"
        />
        <button
          onClick={() =>
            handleSubmit(
              kelasData,
              "/input/kelasDosen",
              "Data kelas dosen berhasil disimpan.",
              setKelasData,
              kelasInputRef
            )
          }
          className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
        >
          Submit Kelas Dosen
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

export default InputDosenKelas;
