"use client";

import { useEffect, useState } from "react";
import apiService from "@/app/services/apiServices";
import ButtonAdd from "../all/ButtonAdd";
import Modal from "../all/Modal";
import FormInputDosen from "./FormInputDosen";
import FormInputKelasDosen from "./FormInputKelasDosen";

const DataDosenKelas = ({ role }) => {
  const [activeTab, setActiveTab] = useState("dosen");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dosenList, setDosenList] = useState([]);
  const [kelasDosenList, setKelasDosenList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchDosen = () =>
    apiService.get("/dosen/by-kurikulum").then(setDosenList);
  const fetchKelasDosen = () =>
    apiService.get("/kelasDosen/by-kurikulum").then(setKelasDosenList);

  useEffect(() => {
    if (activeTab === "dosen") fetchDosen();
    else fetchKelasDosen();
    setCurrentPage(1);
  }, [activeTab]);

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
            activeTab === "dosen"
              ? "bg-blue-600 text-white"
              : "bg-white text-blue-600 border-blue-600"
          }`}
          onClick={() => setActiveTab("dosen")}
        >
          Data Dosen
        </button>
        <button
          className={`px-4 py-2 rounded font-semibold border transition ${
            activeTab === "kelas"
              ? "bg-green-600 text-white"
              : "bg-white text-green-600 border-green-600"
          }`}
          onClick={() => setActiveTab("kelas")}
        >
          Data Kelas Dosen
        </button>
      </div>

      {activeTab === "dosen" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Daftar Dosen</h2>
            {role === "Kaprodi" && <ButtonAdd onClick={openModal} />}
          </div>
          <table className="w-full table-auto border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">No</th>
                <th className="border px-4 py-2">Nama Dosen</th>
                <th className="border px-4 py-2">Kode Dosen</th>
              </tr>
            </thead>
            <tbody>
              {getPaginatedData(dosenList).map((dosen, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2 text-center">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="border px-4 py-2">{dosen.nama_dosen}</td>
                  <td className="border px-4 py-2">{dosen.kode_dosen}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {renderPagination(dosenList)}
        </div>
      )}

      {activeTab === "kelas" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Daftar Kelas Dosen</h2>
            {role === "Kaprodi" && <ButtonAdd onClick={openModal} />}
          </div>
          <table className="w-full table-auto border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">No</th>
                <th className="border px-4 py-2">Tahun Akademik</th>
                <th className="border px-4 py-2">Kelas</th>
                <th className="border px-4 py-2">Nama Dosen</th>
                <th className="border px-4 py-2">Mata Kuliah</th>
              </tr>
            </thead>
            <tbody>
              {getPaginatedData(kelasDosenList).map((kelas, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2 text-center">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="border px-4 py-2">{kelas.tahun_akademik}</td>
                  <td className="border px-4 py-2">{kelas.kelas}</td>
                  <td className="border px-4 py-2">
                    {kelas.tb_dosen?.nama_dosen}
                  </td>
                  <td className="border px-4 py-2">
                    {kelas.tb_matkul?.nama_matkul}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {renderPagination(kelasDosenList)}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {activeTab === "dosen" ? (
          <FormInputDosen
            onSuccess={() => {
              fetchDosen();
              closeModal();
            }}
          />
        ) : (
          <FormInputKelasDosen
            onSuccess={() => {
              fetchKelasDosen();
              closeModal();
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default DataDosenKelas;
