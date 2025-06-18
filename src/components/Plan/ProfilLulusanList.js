"use client";

import apiService from "@/app/services/apiServices";
import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import EditModal from "@/components/all/EditModal";

export default function ProfilLulusanList({ refresh }) {
  const [data, setData] = useState([]);
  const [role, setRole] = useState("");
  const [editingItem, setEditingItem] = useState(null);

  const fetchData = async () => {
    const aktif = await apiService.get("/kurikulum/active");
    const res = await apiService.get(
      `/profillulusan/by-kurikulum?id=${aktif.kurikulum_id}`
    );
    setData(res);
  };

  const fetchRole = async () => {
    const user = await apiService.get("/me");
    setRole(user?.user?.role || "");
  };

  useEffect(() => {
    fetchData();
    fetchRole();
  }, [refresh]);

  const handleDelete = async (id) => {
    if (confirm("Yakin ingin menghapus profil lulusan ini?")) {
      await apiService.delete(`/profillulusan/delete?id=${id}`);
      fetchData();
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
  };

  const handleUpdate = async (updatedData) => {
    await apiService.put("/profillulusan/update", {
      profil_id: editingItem.profil_id,
      deskripsi_profil: updatedData.deskripsi_profil,
    });
    setEditingItem(null);
    fetchData();
  };

  return (
    <>
      <ul className="pl-4 mt-4 space-y-4">
        {data.map((item) => (
          <li key={item.profil_id} className="relative">
            <div className="flex justify-between items-start text-sm">
              <span className="pl-2 before:content-['•'] before:text-black before:mr-2 before:text-lg">
                {item.deskripsi_profil}
              </span>
              {role === "Kaprodi" && (
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-black hover:text-gray-800"
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.profil_id)}
                    className="text-black hover:text-gray-800"
                    title="Hapus"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
            <hr className="mt-2 border-gray-200" />
          </li>
        ))}
      </ul>

      {editingItem && (
        <EditModal
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          onSubmit={handleUpdate}
          title="Edit Profil Lulusan"
          defaultData={{
            deskripsi_profil: editingItem.deskripsi_profil,
          }}
        />
      )}
    </>
  );
}
