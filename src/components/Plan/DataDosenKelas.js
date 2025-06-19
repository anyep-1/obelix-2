"use client";

import { useEffect, useState } from "react";
import apiService from "@/app/services/apiServices";
import ButtonAdd from "../all/ButtonAdd";
import Modal from "../all/Modal";
import FormInputDosen from "./FormInputDosen";
import FormInputKelasDosen from "./FormInputKelasDosen";
import Pagination from "../all/Pagination";

const DataDosenKelas = ({ role }) => {
  const [activeTab, setActiveTab] = useState("dosen");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dosenList, setDosenList] = useState([]);
  const [kelasDosenList, setKelasDosenList] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchDosen = async (page) => {
    const res = await apiService.get(
      `/dosen/by-kurikulum?page=${page}&limit=${itemsPerPage}`
    );
    setDosenList(res.dosen || []);
    setTotalPages(res.totalPages || 1);
  };

  const fetchKelasDosen = async (page) => {
    const res = await apiService.get(
      `/kelasDosen/by-kurikulum?page=${page}&limit=${itemsPerPage}`
    );
    setKelasDosenList(res.kelas || []);
    setTotalPages(res.totalPages || 1);
  };

  useEffect(() => {
    if (activeTab === "dosen") fetchDosen(currentPage);
    else fetchKelasDosen(currentPage);
  }, [activeTab, currentPage]);

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
          onClick={() => {
            setActiveTab("dosen");
            setCurrentPage(1);
          }}
        >
          Data Dosen
        </button>
        <button
          className={`px-4 py-2 rounded font-semibold border transition ${
            activeTab === "kelas"
              ? "bg-green-600 text-white"
              : "bg-white text-green-600 border-green-600"
          }`}
          onClick={() => {
            setActiveTab("kelas");
            setCurrentPage(1);
          }}
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
              {dosenList.map((dosen, index) => (
                <tr key={dosen.dosen_id}>
                  <td className="border px-4 py-2 text-center">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="border px-4 py-2">{dosen.nama_dosen}</td>
                  <td className="border px-4 py-2">{dosen.kode_dosen}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
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
              {kelasDosenList.map((kelas, index) => (
                <tr key={kelas.kelas_dosen_id || index}>
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
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {activeTab === "dosen" ? (
          <FormInputDosen
            onSuccess={() => {
              fetchDosen(currentPage);
              closeModal();
            }}
          />
        ) : (
          <FormInputKelasDosen
            onSuccess={() => {
              fetchKelasDosen(currentPage);
              closeModal();
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default DataDosenKelas;
