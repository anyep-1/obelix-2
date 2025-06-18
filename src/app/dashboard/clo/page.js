"use client";

import { useEffect, useState } from "react";
import apiService from "@/app/services/apiServices";
import CloFormModal from "@/components/Plan/CloFormModal";
import ButtonAdd from "@/components/all/ButtonAdd";
import EditModal from "@/components/all/EditModal";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

export default function CLOPage() {
  const [kurikulum, setKurikulum] = useState(null);
  const [matkulList, setMatkulList] = useState([]);
  const [selectedMatkulId, setSelectedMatkulId] = useState(null);
  const [cloList, setCloList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [role, setRole] = useState("");
  const [editingItem, setEditingItem] = useState(null);

  // Fetch kurikulum aktif dan matkul list
  useEffect(() => {
    const fetchData = async () => {
      try {
        const aktif = await apiService.get("/kurikulum/active");
        setKurikulum(aktif);

        const matkul = await apiService.get(
          `/matkul/by-kurikulum?id=${aktif.kurikulum_id}`
        );
        setMatkulList(matkul);
      } catch (err) {
        console.error("Gagal mengambil data:", err);
      }
    };

    fetchData();
  }, []);

  // Reset selectedMatkulId setiap kali matkulList berubah
  useEffect(() => {
    if (matkulList.length > 0) {
      setSelectedMatkulId(matkulList[0].matkul_id);
    } else {
      setSelectedMatkulId(null);
    }
  }, [matkulList]);

  // Ambil role user
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const user = await apiService.get("/me");
        setRole(user?.user?.role || "");
      } catch (err) {
        console.error("Gagal mengambil role user:", err);
      }
    };
    fetchUserRole();
  }, []);

  // Ambil daftar CLO sesuai selectedMatkulId dan refresh
  useEffect(() => {
    const fetchCLO = async () => {
      if (!selectedMatkulId || isNaN(selectedMatkulId)) return;

      setLoading(true);
      try {
        const clo = await apiService.get(
          `/clo/by-matkul?id=${selectedMatkulId}`
        );

        const sorted = [...clo].sort((a, b) => {
          const aNum = parseInt(a.nomor_clo.replace(/\D/g, ""));
          const bNum = parseInt(b.nomor_clo.replace(/\D/g, ""));
          return aNum - bNum;
        });

        setCloList(sorted);
      } catch (err) {
        console.error("Gagal mengambil CLO:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCLO();
  }, [selectedMatkulId, refresh]);

  const handleDelete = async (id) => {
    if (confirm("Yakin ingin menghapus CLO ini?")) {
      await apiService.delete(`/clo/delete?id=${id}`);
      setRefresh((r) => r + 1);
    }
  };

  const handleUpdate = async (updatedData) => {
    await apiService.put("/clo/update", {
      clo_id: editingItem.clo_id,
      nomor_clo: updatedData.nomor_clo,
      nama_clo: updatedData.nama_clo,
      pi_id: editingItem.pi_id,
      matkul_id: selectedMatkulId,
    });
    setEditingItem(null);
    setRefresh((r) => r + 1);
  };

  return (
    <div className="p-6">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-gray-800">
          CLO - Course Learning Outcome
        </h1>
        <hr className="mt-2 border-t border-gray-300" />
      </div>

      <p className="mb-4 text-gray-600">
        Tahun Kurikulum Aktif:{" "}
        <strong>{kurikulum?.tahun_kurikulum || "-"}</strong>
      </p>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Pilih Mata Kuliah:</label>
        <select
          value={selectedMatkulId || ""}
          onChange={(e) => {
            const val = e.target.value === "" ? null : parseInt(e.target.value);
            setSelectedMatkulId(val);
          }}
          className="max-w-xl border px-3 py-2 rounded"
        >
          <option value="">-- Pilih Mata Kuliah --</option>
          {matkulList.map((matkul) => (
            <option key={matkul.matkul_id} value={matkul.matkul_id}>
              {matkul.nama_matkul} ({matkul.kode_matkul})
            </option>
          ))}
        </select>
      </div>

      {role === "DosenKoor" && (
        <div className="mb-4">
          <ButtonAdd
            onClick={() => {
              setShowModal(true);
            }}
          />
        </div>
      )}

      {showModal && (
        <CloFormModal
          kurikulumId={kurikulum?.kurikulum_id}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setRefresh((r) => r + 1);
            setShowModal(false);
          }}
        />
      )}

      <div className="mt-4">
        {loading ? (
          <p>Loading...</p>
        ) : cloList.length === 0 ? (
          <p className="text-gray-500">Belum ada CLO untuk mata kuliah ini.</p>
        ) : (
          <ul className="space-y-2 text-gray-800">
            {cloList.map((clo) => (
              <li
                key={clo.clo_id}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <strong>CLO {clo.nomor_clo}</strong> - {clo.nama_clo}
                </div>
                {role === "DosenKoor" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingItem(clo)}
                      title="Edit"
                      className="text-black hover:text-gray-800"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(clo.clo_id)}
                      title="Hapus"
                      className="text-black hover:text-gray-800"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {editingItem && (
        <EditModal
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          onSubmit={handleUpdate}
          title="Edit CLO"
          defaultData={{
            nomor_clo: editingItem.nomor_clo,
            nama_clo: editingItem.nama_clo,
          }}
        />
      )}
    </div>
  );
}
