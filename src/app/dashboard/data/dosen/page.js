"use client";

import { useEffect, useState } from "react";
import DataDosenKelas from "@/components/Plan/DataDosenKelas";
import apiService from "@/app/services/apiServices";
import LoadingSpinner from "@/components/all/LoadingSpinner";

export default function Page() {
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiService.get("/me");
        setRole(res.user?.role || "");
      } catch (err) {
        console.error("Gagal ambil role user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="p-6 min-h-screen flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  return <DataDosenKelas role={role} />;
}
