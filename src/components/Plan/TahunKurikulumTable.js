"use client";

import apiService from "@/app/services/apiServices";
import { useEffect, useState } from "react";
import { CheckCircle, Circle, Pencil, Trash2 } from "lucide-react";
import EditModal from "@/components/all/EditModal";

export default function TahunKurikulumTable({ refreshSignal }) {
  const [data, setData] = useState([]);
  const [role, setRole] = useState("");
  const [editingItem, setEditingItem] = useState(null);

  const fetchData = async () => {
    const result = await apiService.get("/kurikulum/list");
    const sorted = result.sort((a, b) => b.tahun_kurikulum - a.tahun_kurikulum);
    setData(sorted);
  };

  const fetchRole = async () => {
    const user = await apiService.get("/me");
    setRole(user?.user?.role || "");
  };

  useEffect(() => {
    fetchData();
    fetchRole();
  }, [refreshSignal]);

  const setAktif = async (id) => {
    await apiService.patch("/kurikulum/set-active", { kurikulum_id: id });
    fetchData();
  };

  const handleDelete = async (id) => {
    if (confirm("Yakin ingin menghapus tahun kurikulum ini?")) {
      await apiService.delete(`/kurikulum/delete?id=${id}`);
      fetchData();
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
  };

  const handleUpdate = async (updatedData) => {
    await apiService.put("/kurikulum/update", {
      kurikulum_id: editingItem.kurikulum_id,
      tahun_kurikulum: updatedData.tahun_kurikulum,
    });
    setEditingItem(null);
    fetchData();
  };

  return (
    <div className="mt-6 overflow-x-auto">
      <table className="min-w-full border rounded shadow-md text-sm">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="p-3 border text-center">#</th>
            <th className="p-3 border text-left">Tahun Kurikulum</th>
            <th className="p-3 border text-center">Status</th>
            {role === "Kaprodi" && (
              <th className="p-3 border text-center">Set Aktif</th>
            )}
            {role === "Kaprodi" && (
              <th className="p-3 border text-center">Aksi</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr
              key={item.kurikulum_id}
              className="hover:bg-gray-50 transition-all"
            >
              <td className="p-3 border text-center">{i + 1}</td>
              <td className="p-3 border">{item.tahun_kurikulum}</td>
              <td className="p-3 border text-center">
                {item.selected ? (
                  <span className="flex items-center justify-center text-green-600 font-medium gap-1">
                    <CheckCircle size={16} /> Aktif
                  </span>
                ) : (
                  <span className="flex items-center justify-center text-gray-500 gap-1">
                    <Circle size={16} /> Tidak Aktif
                  </span>
                )}
              </td>
              {role === "Kaprodi" && (
                <td className="p-3 border text-center">
                  {!item.selected && (
                    <button
                      onClick={() => setAktif(item.kurikulum_id)}
                      className="px-2 py-1 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition"
                    >
                      Set Aktif
                    </button>
                  )}
                </td>
              )}
              {role === "Kaprodi" && (
                <td className="p-3 border text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-yellow-600 hover:text-yellow-800"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.kurikulum_id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {editingItem && (
        <EditModal
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          onSubmit={handleUpdate}
          title="Edit Tahun Kurikulum"
          defaultData={{
            tahun_kurikulum: editingItem.tahun_kurikulum,
          }}
        />
      )}
    </div>
  );
}
