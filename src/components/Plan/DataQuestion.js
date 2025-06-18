"use client";

import { useEffect, useState } from "react";
import apiService from "@/app/services/apiServices";
import ButtonAdd from "../all/ButtonAdd";
import Modal from "../all/Modal";
import FormInputQuestion from "./FormInputQuestion";

const DataQuestion = ({ role }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchQuestions = async () => {
    try {
      const aktif = await apiService.get("/kurikulum/active");
      const res = await apiService.get("/question/by-kurikulum", {
        id: aktif.kurikulum_id,
      });
      setQuestions(res.questions || []);
    } catch (err) {
      console.error("Gagal mengambil data question:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleSuccess = () => {
    fetchQuestions();
    closeModal();
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="bg-white p-6 rounded shadow border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Daftar Question</h2>
        {role === "DosenKoor" && <ButtonAdd onClick={openModal} />}
      </div>

      {questions.length === 0 ? (
        <p>Tidak ada data.</p>
      ) : (
        <table className="w-full table-auto border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">No</th>
              <th className="border px-4 py-2">Question</th>
              <th className="border px-4 py-2">CLO</th>
              <th className="border px-4 py-2">Tools</th>
              <th className="border px-4 py-2">Mata Kuliah</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q, index) => (
              <tr key={q.id || index}>
                <td className="border px-4 py-2 text-center">{index + 1}</td>
                <td className="border px-4 py-2">{q.nama_question}</td>
                <td className="border px-4 py-2">{q.clo}</td>
                <td className="border px-4 py-2">{q.tools}</td>
                <td className="border px-4 py-2">{q.matkul}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal Form Tambah */}
      <Modal isOpen={showModal} onClose={closeModal}>
        <h3 className="text-lg font-bold mb-4">Tambah Question</h3>
        <FormInputQuestion onSuccess={handleSuccess} />
      </Modal>
    </div>
  );
};

export default DataQuestion;
