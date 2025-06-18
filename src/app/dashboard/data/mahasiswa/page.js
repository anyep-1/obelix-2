"use client";

import { useEffect, useState } from "react";

import apiService from "@/app/services/apiServices";
import DataMahasiswaKelas from "@/components/Plan/DataMahasiswaKelas";

const MahasiswaPage = () => {
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await apiService.get("/me");
      setRole(res.user?.role || "");
    } catch (err) {
      console.error("Gagal mengambil data user:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading)
    return (
      <div className="p-6 min-h-screen flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Data Mahasiswa & Kelas</h1>
      <DataMahasiswaKelas role={role} />
    </div>
  );
};

export default MahasiswaPage;
