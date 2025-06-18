"use client";

import { useEffect, useState } from "react";
import apiService from "@/app/services/apiServices";
import FormToolsAssessment from "./FormToolsAssesment";
import ButtonAdd from "../all/ButtonAdd";

const DataToolsAssessment = ({ role }) => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); // untuk modal

  const fetchTools = async () => {
    try {
      const data = await apiService.get("/input/toolsAssesment");
      setTools(data.tools || []);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const handleSuccess = () => {
    setShowModal(false); // tutup modal
    fetchTools(); // refresh data
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Daftar Tools Assessment</h2>

      {role === "Kaprodi" && (
        <>
          <ButtonAdd onClick={() => setShowModal(true)} />
          {showModal && (
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
              <div className="bg-white p-6 rounded shadow w-[90vw] max-w-md border border-gray-200 relative">
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                >
                  ✕
                </button>
                <h3 className="text-lg font-semibold mb-4">Tambah Tools</h3>
                <FormToolsAssessment onSuccess={handleSuccess} />
              </div>
            </div>
          )}
        </>
      )}

      {tools.length === 0 ? (
        <p>Tidak ada data.</p>
      ) : (
        <ul className="list-disc pl-5">
          {tools.map((tool) => (
            <li key={tool.tool_id}>{tool.nama_tools}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DataToolsAssessment;
