"use client";

import { useEffect, useState } from "react";
import apiService from "@/app/services/apiServices";
import ButtonAdd from "../all/ButtonAdd";
import Modal from "../all/Modal";
import FormInputMahasiswa from "./FormInputMahasiswa";
import FormInputKelasMahasiswa from "./FormInputKelasMahasiswa";
import Pagination from "../all/Pagination";

const DataMahasiswaKelas = ({ role }) => {
  const [activeTab, setActiveTab] = useState("mahasiswa");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [kurikulumAktif, setKurikulumAktif] = useState(null);

  // State mahasiswa
  const [mahasiswaList, setMahasiswaList] = useState([]);
  const [mahasiswaTotalPages, setMahasiswaTotalPages] = useState(1);
  const [mahasiswaPage, setMahasiswaPage] = useState(1);
  const [loadingMahasiswa, setLoadingMahasiswa] = useState(false);

  // State kelas
  const [kelasList, setKelasList] = useState([]);
  const [kelasTotalPages, setKelasTotalPages] = useState(1);
  const [kelasPage, setKelasPage] = useState(1);
  const [loadingKelas, setLoadingKelas] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchKurikulumAktif = async () => {
      try {
        const res = await apiService.get("/kurikulum/active");
        setKurikulumAktif(res);
      } catch (error) {
        console.error("Gagal ambil kurikulum aktif:", error);
      }
    };

    fetchKurikulumAktif();
  }, []);

  useEffect(() => {
    if (!kurikulumAktif) return;
    if (activeTab === "mahasiswa") fetchMahasiswa(mahasiswaPage);
    else fetchKelas(kelasPage);
  }, [activeTab, kurikulumAktif, mahasiswaPage, kelasPage]);

  const fetchMahasiswa = async (page) => {
    if (!kurikulumAktif) return;
    setLoadingMahasiswa(true);
    try {
      const res = await apiService.get(
        `/mahasiswa/by-kurikulum?kurikulum_id=${kurikulumAktif.kurikulum_id}&page=${page}&limit=${itemsPerPage}`
      );
      setMahasiswaList(res.mahasiswa || []);
      setMahasiswaTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Gagal fetch mahasiswa:", err);
    } finally {
      setLoadingMahasiswa(false);
    }
  };

  const fetchKelas = async (page) => {
    if (!kurikulumAktif) return;
    setLoadingKelas(true);
    try {
      const res = await apiService.get(
        `/kelasMahasiswa/by-kurikulum?kurikulum_id=${kurikulumAktif.kurikulum_id}&page=${page}&limit=${itemsPerPage}`
      );
      setKelasList(res.kelas || []);
      setKelasTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Gagal fetch kelas:", err);
    } finally {
      setLoadingKelas(false);
    }
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
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Daftar Mahasiswa</h2>
            {(role === "DosenKoor" || role === "DosenAmpu") && (
              <ButtonAdd onClick={openModal} />
            )}
          </div>

          {loadingMahasiswa ? (
            <p>Loading...</p>
          ) : (
            <>
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
                  {mahasiswaList.map((mhs, index) => (
                    <tr key={mhs.mahasiswa_id}>
                      <td className="border px-4 py-2 text-center">
                        {(mahasiswaPage - 1) * itemsPerPage + index + 1}
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

              <Pagination
                currentPage={mahasiswaPage}
                totalPages={mahasiswaTotalPages}
                onPageChange={setMahasiswaPage}
              />
            </>
          )}
        </>
      )}

      {activeTab === "kelas" && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Daftar Kelas</h2>
            {role === "DosenKoor" && <ButtonAdd onClick={openModal} />}
          </div>

          {loadingKelas ? (
            <p>Loading...</p>
          ) : (
            <>
              <table className="w-full table-auto border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-4 py-2">No</th>
                    <th className="border px-4 py-2">Kode Kelas</th>
                  </tr>
                </thead>
                <tbody>
                  {kelasList.map((kelas, index) => (
                    <tr key={kelas.kode_kelas}>
                      <td className="border px-4 py-2 text-center">
                        {(kelasPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="border px-4 py-2">{kelas.kode_kelas}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <Pagination
                currentPage={kelasPage}
                totalPages={kelasTotalPages}
                onPageChange={setKelasPage}
              />
            </>
          )}
        </>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {activeTab === "mahasiswa" ? (
          <FormInputMahasiswa
            onSuccess={() => {
              fetchMahasiswa(mahasiswaPage);
              closeModal();
            }}
          />
        ) : (
          <FormInputKelasMahasiswa
            onSuccess={() => {
              fetchKelas(kelasPage);
              closeModal();
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default DataMahasiswaKelas;
