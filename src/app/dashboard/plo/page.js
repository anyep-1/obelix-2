"use client";

import { useEffect, useState } from "react";
import apiService from "@/app/services/apiServices";
import ButtonAdd from "@/components/all/ButtonAdd";
import EditModal from "@/components/all/EditModal";
import { Pencil, Trash2 } from "lucide-react";
import PloFormModal from "@/components/Plan/PloForm";

export default function PloPage() {
  const [ploList, setPloList] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(true);
  const [kurikulum, setKurikulum] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [role, setRole] = useState("");
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const aktif = await apiService.get("/kurikulum/active");
        setKurikulum(aktif);

        const res = await apiService.get(
          `/plo/by-kurikulum?id=${aktif.kurikulum_id}`
        );

        const sorted = [...res].sort((a, b) => {
          const aNum = parseInt(a.nomor_plo);
          const bNum = parseInt(b.nomor_plo);
          return aNum - bNum;
        });

        setPloList(sorted);

        const user = await apiService.get("/me");
        setRole(user?.user?.role || "");
      } catch (err) {
        console.error("Gagal ambil data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refresh]);

  const handleDelete = async (id) => {
    if (confirm("Yakin ingin menghapus PLO ini?")) {
      await apiService.delete(`/plo/delete?id=${id}`);
      setRefresh((r) => r + 1);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
  };

  const handleUpdate = async (updatedData) => {
    await apiService.put("/plo/update", {
      plo_id: editingItem.plo_id,
      nomor_plo: updatedData.nomor_plo,
      nama_plo: updatedData.nama_plo,
    });
    setEditingItem(null);
    setRefresh((r) => r + 1);
  };

  return (
    <div className="px-6 pt-6">
      {/* Judul dan Tombol */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          PLO - Program Learning Outcome
        </h1>
        {role === "Kaprodi" && <ButtonAdd onClick={() => setShowModal(true)} />}
      </div>

      <hr className="border-t border-gray-300 mb-4" />

      <p className="mb-4 text-gray-600">
        Tahun Kurikulum Aktif:{" "}
        <strong>{kurikulum?.tahun_kurikulum || "-"}</strong>
      </p>

      {showModal && (
        <PloFormModal
          onSuccess={() => {
            setRefresh((r) => r + 1);
            setShowModal(false);
          }}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* List PLO */}
      <div className="mt-4 space-y-2 text-sm">
        {loading ? (
          <p>Loading...</p>
        ) : ploList.length === 0 ? (
          <p className="text-gray-500">
            Belum ada data PLO untuk kurikulum ini.
          </p>
        ) : (
          ploList.map((plo) => (
            <div
              key={plo.plo_id}
              className="border-b border-gray-200 pb-2 flex justify-between items-start"
            >
              <div className="flex items-start">
                <span className="min-w-[1.5rem] font-medium">
                  {plo.nomor_plo}.
                </span>
                <span className="flex-1">{plo.nama_plo}</span>
              </div>

              {role === "Kaprodi" && (
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(plo)}
                    className="text-black hover:text-gray-800"
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(plo.plo_id)}
                    className="text-black hover:text-gray-800"
                    title="Hapus"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal Edit */}
      {editingItem && (
        <EditModal
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          onSubmit={handleUpdate}
          title="Edit PLO"
          defaultData={{
            nomor_plo: editingItem.nomor_plo,
            nama_plo: editingItem.nama_plo,
          }}
        />
      )}
    </div>
  );
}
