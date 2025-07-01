"use client";

import { useEffect, useState } from "react";
import apiService from "@/app/services/apiServices";
import PiFormModal from "@/components/Plan/PiFormModal";
import ButtonAdd from "@/components/all/ButtonAdd";
import EditModal from "@/components/all/EditModal";
import { Pencil, Trash2 } from "lucide-react";

export default function PIPage() {
  const [piList, setPiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [kurikulum, setKurikulum] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [role, setRole] = useState("");
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const aktif = await apiService.get("/kurikulum/active");
        setKurikulum(aktif);

        const data = await apiService.get("/pi/all");

        const sorted = [...data].sort((a, b) =>
          a.nomor_pi.localeCompare(b.nomor_pi, undefined, { numeric: true })
        );

        setPiList(sorted);

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
    if (confirm("Yakin ingin menghapus PI ini?")) {
      await apiService.delete(`/pi/delete?id=${id}`);
      setRefresh((r) => r + 1);
    }
  };

  const handleUpdate = async (updated) => {
    await apiService.put("/pi/update", {
      pi_id: editingItem.pi_id,
      nomor_pi: updated.nomor_pi,
      deskripsi_pi: updated.deskripsi_pi,
    });
    setEditingItem(null);
    setRefresh((r) => r + 1);
  };

  return (
    <div className="px-6 pt-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          PI - Peforma Indikator
        </h1>
        {role === "Kaprodi" && <ButtonAdd onClick={() => setShowModal(true)} />}
      </div>

      <hr className="border-t border-gray-300 mb-4" />

      <p className="mb-4 text-gray-600">
        Tahun Kurikulum Aktif:{" "}
        <strong>{kurikulum?.tahun_kurikulum || "-"}</strong>
      </p>

      {showModal && (
        <PiFormModal
          kurikulumId={kurikulum?.kurikulum_id}
          onSuccess={() => {
            setShowModal(false);
            setRefresh((r) => r + 1);
          }}
          onClose={() => setShowModal(false)}
        />
      )}

      <div className="mt-4 space-y-2 text-sm">
        {loading ? (
          <p>Loading...</p>
        ) : piList.length === 0 ? (
          <p className="text-gray-500">Belum ada data PI.</p>
        ) : (
          piList.map((pi) => (
            <div
              key={pi.pi_id}
              className="border-b border-gray-200 pb-2 flex justify-between items-start"
            >
              <div>
                <div className="flex items-start gap-1">
                  <span className="min-w-[2rem] font-medium">
                    {pi.nomor_pi}.
                  </span>
                  <span className="flex-1">{pi.deskripsi_pi}</span>
                </div>
                <p className="text-gray-600 text-xs mt-1">
                  PLO: {pi.tb_plo?.nomor_plo || "-"}
                </p>
              </div>
              {role === "Kaprodi" && (
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => setEditingItem(pi)}
                    className="text-black hover:text-gray-800"
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(pi.pi_id)}
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

      {editingItem && (
        <EditModal
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          onSubmit={handleUpdate}
          title="Edit PI"
          defaultData={{
            nomor_pi: editingItem.nomor_pi,
            deskripsi_pi: editingItem.deskripsi_pi,
          }}
        />
      )}
    </div>
  );
}
