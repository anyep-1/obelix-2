"use client";

import { useEffect, useState } from "react";
import apiService from "@/app/services/apiServices";
import ButtonAdd from "../all/ButtonAdd";
import Modal from "../all/Modal";
import FormInputMahasiswa from "./FormInputMahasiswa";
import FormInputKelasMahasiswa from "./FormInputKelasMahasiswa";

const DataMahasiswaKelas = ({ role }) => {
  const [activeTab, setActiveTab] = useState("mahasiswa");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mahasiswaList, setMahasiswaList] = useState([]);
  const [kelasList, setKelasList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [kurikulumAktif, setKurikulumAktif] = useState(null);
  const itemsPerPage = 10;

  const fetchKurikulumAktif = async () => {
    try {
      const res = await apiService.get("/kurikulum/active");
      setKurikulumAktif(res);
    } catch (error) {
      console.error("Gagal ambil kurikulum aktif:", error);
    }
  };

  const fetchMahasiswa = () => {
    if (!kurikulumAktif) return;
    apiService
      .get("/mahasiswa/by-kurikulum", {
        kurikulum_id: kurikulumAktif.kurikulum_id,
      })
      .then((res) => setMahasiswaList(res?.mahasiswa || []))
      .catch((err) => console.error("Gagal fetch mahasiswa:", err));
  };

  const fetchKelas = () => {
    if (!kurikulumAktif) return;
    apiService
      .get("/kelasMahasiswa/by-kurikulum", {
        kurikulum_id: kurikulumAktif.kurikulum_id,
      })
      .then((res) => setKelasList(res?.kelas || []))
      .catch((err) => console.error("Gagal fetch kelas:", err));
  };

  useEffect(() => {
    fetchKurikulumAktif();
  }, []);

  useEffect(() => {
    if (!kurikulumAktif) return;
    if (activeTab === "mahasiswa") fetchMahasiswa();
    else fetchKelas();
    setCurrentPage(1);
  }, [activeTab, kurikulumAktif]);

  const getPaginatedData = (list) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return list.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = (list) => Math.ceil(list.length / itemsPerPage);

  const renderPagination = (list) => {
    const total = totalPages(list);
    if (total <= 1) return null;

    return (
      <div className="flex justify-center mt-4 gap-4 text-sm text-black">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="underline disabled:opacity-50"
        >
          Previous
        </button>

        {Array.from({ length: total }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`underline ${
              currentPage === index + 1 ? "font-bold" : ""
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, total))}
          disabled={currentPage === total}
          className="underline disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="max-w-6xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-xl border border-gray-200">
      <div className="flex gap-4 mb-6 justify-center">
        <button
          className={`px-4 py-2 rounded font-semibold border transition ${
            activeTab === "mahasiswa"
              ? "bg-blue-600 text-white"
              : "bg-white text-blue-600 border-blue-600"
          }`}
          onClick={() => setActiveTab("mahasiswa")}
        >
          Data Mahasiswa
        </button>
        <button
          className={`px-4 py-2 rounded font-semibold border transition ${
            activeTab === "kelas"
              ? "bg-green-600 text-white"
              : "bg-white text-green-600 border-green-600"
          }`}
          onClick={() => setActiveTab("kelas")}
        >
          Data Kelas
        </button>
      </div>

      {activeTab === "mahasiswa" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Daftar Mahasiswa</h2>
            {role === "DosenKoor" && <ButtonAdd onClick={openModal} />}
          </div>
          <table className="w-full table-auto border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">No</th>
                <th className="border px-4 py-2">Nama</th>
                <th className="border px-4 py-2">NIM</th>
                <th className="border px-4 py-2">Kelas</th>
              </tr>
            </thead>
            <tbody>
              {getPaginatedData(mahasiswaList).map((mhs, index) => (
                <tr key={mhs.mahasiswa_id}>
                  <td className="border px-4 py-2 text-center">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="border px-4 py-2">{mhs.nama_mahasiswa}</td>
                  <td className="border px-4 py-2">{mhs.nim_mahasiswa}</td>
                  <td className="border px-4 py-2">
                    {mhs.tb_kelas?.kode_kelas || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {renderPagination(mahasiswaList)}
        </div>
      )}

      {activeTab === "kelas" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Daftar Kelas</h2>
            {role === "DosenKoor" && <ButtonAdd onClick={openModal} />}
          </div>
          <table className="w-full table-auto border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">No</th>
                <th className="border px-4 py-2">Kode Kelas</th>
              </tr>
            </thead>
            <tbody>
              {getPaginatedData(kelasList).map((kelas, index) => (
                <tr key={kelas.kode_kelas}>
                  <td className="border px-4 py-2 text-center">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="border px-4 py-2">{kelas.kode_kelas}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {renderPagination(kelasList)}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {activeTab === "mahasiswa" ? (
          <FormInputMahasiswa
            onSuccess={() => {
              fetchMahasiswa();
              closeModal();
            }}
          />
        ) : (
          <FormInputKelasMahasiswa
            onSuccess={() => {
              fetchKelas();
              closeModal();
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default DataMahasiswaKelas;
