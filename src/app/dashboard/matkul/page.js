"use client";

import { useEffect, useState } from "react";
import apiService from "@/app/services/apiServices";
import MatkulFormModal from "@/components/Plan/MatkulFormModal";
import ButtonAdd from "@/components/all/ButtonAdd";
import TableMatkul from "@/components/Plan/TableMatkul";
import EditModal from "@/components/all/EditModal";

export default function MatkulPage() {
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [kurikulum, setKurikulum] = useState(null);
  const [role, setRole] = useState("");
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const aktif = await apiService.get("/kurikulum/active");
      setKurikulum(aktif);

      const matkul = await apiService.get("/matkul");
      setData(matkul.filter((m) => m.kurikulum_id === aktif.kurikulum_id));

      const user = await apiService.get("/me");
      setRole(user?.user?.role || "");
    };
    fetchData();
  }, [refresh]);

  const handleDelete = async (id) => {
    if (confirm("Yakin ingin menghapus mata kuliah ini?")) {
      await apiService.delete(`/matkul/delete?id=${id}`);
      setRefresh((r) => r + 1);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
  };

  const handleUpdate = async (updatedData) => {
    await apiService.put("/matkul/update", {
      matkul_id: editingItem.matkul_id,
      nama_matkul: updatedData.nama_matkul,
      kode_matkul: updatedData.kode_matkul,
      jumlah_sks: Math.max(0, parseInt(updatedData.jumlah_sks)), // pastikan tidak negatif
      tingkat: updatedData.tingkat,
      semester: updatedData.semester,
    });
    setEditingItem(null);
    setRefresh((r) => r + 1);
  };

  const handleSuccess = () => {
    setRefresh((r) => r + 1);
    setShowModal(false);
  };

  return (
    <div className="px-6 pt-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Mata Kuliah</h1>
        {role === "Kaprodi" && (
          <div className="relative z-20">
            <ButtonAdd onClick={() => setShowModal(true)} />
          </div>
        )}
      </div>

      <hr className="border-t border-gray-300 mb-4" />

      <p className="mb-4 text-gray-600">
        Kurikulum Aktif: <strong>{kurikulum?.tahun_kurikulum || "-"}</strong>
      </p>

      <TableMatkul
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isEditable={role === "Kaprodi"}
      />

      {showModal && (
        <MatkulFormModal
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
        />
      )}

      {editingItem && (
        <EditModal
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          onSubmit={handleUpdate}
          title="Edit Mata Kuliah"
          defaultData={{
            nama_matkul: editingItem.nama_matkul,
            kode_matkul: editingItem.kode_matkul,
            jumlah_sks: editingItem.jumlah_sks,
            tingkat: editingItem.tingkat || "",
            semester: editingItem.semester || "",
          }}
        />
      )}
    </div>
  );
}
