"use client";

import { useEffect, useState } from "react";
import ButtonAdd from "@/components/all/ButtonAdd";
import TahunKurikulumModal from "@/components/Plan/TahunKurikulumModal";
import TahunKurikulumTable from "@/components/Plan/TahunKurikulumTable";
import apiService from "@/app/services/apiServices";

export default function KurikulumPage() {
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [role, setRole] = useState("");

  const refreshData = () => setRefreshKey((k) => k + 1);

  useEffect(() => {
    const fetchRole = async () => {
      const user = await apiService.get("/me");
      setRole(user?.user?.role || "");
    };

    fetchRole();
  }, []);

  return (
    <div className="px-6 pt-6">
      {/* Judul di luar card */}
      <div className="mb-4 border-b pb-2">
        <h1 className="text-2xl font-bold text-gray-800">
          Manajemen Tahun Kurikulum
        </h1>
      </div>

      {/* Card untuk konten */}
      <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
        {role === "Kaprodi" && (
          <div className="flex justify-end mb-4">
            <ButtonAdd onClick={() => setShowModal(true)} />
          </div>
        )}

        <TahunKurikulumTable refreshSignal={refreshKey} />
      </div>

      {showModal && (
        <TahunKurikulumModal
          onSuccess={refreshData}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
