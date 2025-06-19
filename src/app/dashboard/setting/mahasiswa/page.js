"use client";

import { useState, useRef } from "react";
import apiService from "@/app/services/apiServices";
import FileUploader from "@/components/all/FIleUploader";
import Alert from "@/components/all/Alert";

const InputMahasiswaKelas = () => {
  const [mahasiswaData, setMahasiswaData] = useState([]);
  const [kelasMahasiswaData, setKelasMahasiswaData] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [loadingMahasiswa, setLoadingMahasiswa] = useState(false);
  const [loadingKelasMahasiswa, setLoadingKelasMahasiswa] = useState(false);

  const mahasiswaInputRef = useRef(null);
  const kelasInputRef = useRef(null);

  const expectedMahasiswaHeaders = ["nama", "nim", "kode_kelas", "enroll_year"];
  const expectedKelasMahasiswaHeaders = ["kode_kelas"];

  const handleSubmit = async (
    data,
    endpoint,
    successMessage,
    clearFn,
    fileRef,
    setLoading
  ) => {
    if (!data.length) {
      setErrorMsg("File kosong atau belum diunggah.");
      setSuccessMsg("");
      return;
    }

    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow mt-10">
      <h1 className="text-xl font-semibold text-center text-gray-800 mb-6">
        Upload Data Mahasiswa & Kelas Mahasiswa
      </h1>

      {/* Upload Kelas Mahasiswa */}
      <div className="mb-6">
        <h2 className="font-semibold text-lg mb-2 text-green-700">
          Data Kelas Mahasiswa
        </h2>
        <FileUploader
          ref={kelasInputRef}
          label="Pilih File Kelas Mahasiswa (.csv atau .xlsx)"
          expectedHeaders={expectedKelasMahasiswaHeaders}
          setData={setKelasMahasiswaData}
          onError={setErrorMsg}
          borderColor="border-green-400"
          textColor="text-green-700"
          iconColor="text-green-500"
          bgHoverColor="hover:bg-green-50"
        />
        <button
          onClick={() =>
            handleSubmit(
              kelasMahasiswaData,
              "/input/kelasMahasiswa",
              "Data kelas mahasiswa berhasil disimpan.",
              setKelasMahasiswaData,
              kelasInputRef,
              setLoadingKelasMahasiswa
            )
          }
          disabled={loadingKelasMahasiswa}
          className={`mt-4 w-full py-2 rounded text-white ${
            loadingKelasMahasiswa
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loadingKelasMahasiswa ? "Menyimpan..." : "Submit Kelas Mahasiswa"}
        </button>
      </div>

      {/* Upload Mahasiswa */}
      <div className="mb-6">
        <h2 className="font-semibold text-lg mb-2 text-blue-700">
          Data Mahasiswa
        </h2>
        <FileUploader
          ref={mahasiswaInputRef}
          label="Pilih File Mahasiswa (.csv atau .xlsx)"
          expectedHeaders={expectedMahasiswaHeaders}
          setData={setMahasiswaData}
          onError={setErrorMsg}
          borderColor="border-blue-400"
          textColor="text-blue-700"
          iconColor="text-blue-500"
          bgHoverColor="hover:bg-blue-50"
        />
        <button
          onClick={() =>
            handleSubmit(
              mahasiswaData,
              "/input/mahasiswa",
              "Data mahasiswa berhasil disimpan.",
              setMahasiswaData,
              mahasiswaInputRef,
              setLoadingMahasiswa
            )
          }
          disabled={loadingMahasiswa}
          className={`mt-4 w-full py-2 rounded text-white ${
            loadingMahasiswa
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loadingMahasiswa ? "Menyimpan..." : "Submit Mahasiswa"}
        </button>
      </div>

      {/* Alert Section */}
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

export default InputMahasiswaKelas;
