"use client";

import { useEffect, useState } from "react";
import ButtonAdd from "@/components/all/ButtonAdd";
import ProfilLulusanForm from "@/components/Plan/ProfilLulusanForm";
import ProfilLulusanList from "@/components/Plan/ProfilLulusanList";
import apiService from "@/app/services/apiServices";

export default function ProfilLulusanPage() {
  const [refresh, setRefresh] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [role, setRole] = useState("");

  const handleSuccess = () => {
    setRefresh((r) => r + 1);
    setShowModal(false);
  };

  useEffect(() => {
    const fetchRole = async () => {
      const res = await apiService.get("/me");
      setRole(res?.user?.role || "");
    };
    fetchRole();
  }, []);

  return (
    <div className="px-6 pt-6">
      {/* Judul dan Button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Profil Lulusan</h1>
        {role === "Kaprodi" && <ButtonAdd onClick={() => setShowModal(true)} />}
      </div>

      {/* Garis bawah */}
      <hr className="border-t border-gray-300 mb-6" />

      {/* Tabel / List */}
      <ProfilLulusanList refresh={refresh} />

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/10">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg relative border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">
              Tambah Profil Lulusan
            </h2>
            <ProfilLulusanForm
              onSuccess={handleSuccess}
              onClose={() => setShowModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
