// Komponen Modal Assign Matkul untuk Admin
// File: components/Admin/MatkulAssignModal.jsx

"use client";

import { useEffect, useState } from "react";
import apiService from "@/app/services/apiServices";

const MatkulAssignModal = ({ user, isOpen, onClose }) => {
  const [allMatkul, setAllMatkul] = useState([]);
  const [assignedMatkul, setAssignedMatkul] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !isOpen) return;

    const fetchData = async () => {
      try {
        const kurikulum = await apiService.get("/kurikulum/active");
        const all = await apiService.get(
          `/matkul/by-kurikulum?id=${kurikulum.kurikulum_id}`
        );
        setAllMatkul(all);

        const assigned = await apiService.get(
          `/dosenkoor/matkul?user_id=${user.user_id}`
        );
        setAssignedMatkul(assigned.map((m) => m.matkul_id));
      } catch (err) {
        console.error("Gagal load matkul:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isOpen]);

  const handleCheckboxChange = async (matkul_id, checked) => {
    try {
      if (checked) {
        await apiService.post("/dosenkoor/assign", {
          user_id: user.user_id,
          matkul_id,
        });
        setAssignedMatkul((prev) => [...prev, matkul_id]);
      } else {
        await apiService.delete(
          `/dosenkoor/unassign?user_id=${user.user_id}&matkul_id=${matkul_id}`
        );
        setAssignedMatkul((prev) => prev.filter((id) => id !== matkul_id));
      }
    } catch (err) {
      console.error("Gagal update matkul:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
        <h2 className="text-lg font-bold mb-4 text-center">
          Kelola Mata Kuliah - {user?.nama}
        </h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="max-h-96 overflow-y-auto space-y-2">
            {allMatkul.map((matkul) => (
              <label key={matkul.matkul_id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={assignedMatkul.includes(matkul.matkul_id)}
                  onChange={(e) =>
                    handleCheckboxChange(matkul.matkul_id, e.target.checked)
                  }
                />
                <span>
                  {matkul.nama_matkul} ({matkul.kode_matkul})
                </span>
              </label>
            ))}
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatkulAssignModal;
