"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import apiService from "@/app/services/apiServices";
import LoadingSpinner from "@/components/all/LoadingSpinner";
import StatusCard from "@/components/Do/StatusCard";

const ValidasiEvaluasi = () => {
  const [matkulList, setMatkulList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const [kurikulumAktif, matkulRes] = await Promise.all([
          apiService.get("/kurikulum/active"),
          apiService.get("/laporan/matkul-with-data"),
        ]);

        const filteredByKurikulum = Array.isArray(matkulRes)
          ? matkulRes.filter(
              (item) =>
                item.matkul?.kurikulum_id === kurikulumAktif.kurikulum_id
            )
          : [];

        setMatkulList(filteredByKurikulum);
      } catch (err) {
        console.error(err);
        setError("Gagal mengambil data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center mt-6">{error}</p>;
  }

  const filteredList = matkulList.filter((item) =>
    item.rtList?.some((rt) => rt.statusImplementasi === "Sudah")
  );

  if (filteredList.length === 0) {
    return (
      <div className="p-4 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Validasi Evaluasi Mata Kuliah
        </h1>
        <p>Belum ada data monitoring dan evaluasi dengan status "Sudah".</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Validasi Evaluasi Mata Kuliah
      </h1>

      <div className="flex flex-col space-y-6">
        {filteredList.map((item) => (
          <div
            key={item.monev_id}
            onClick={() =>
              router.push(`/dashboard/hasil-validasi/${item.monev_id}`)
            }
            className="cursor-pointer"
          >
            <StatusCard
              className="w-full"
              id={item.monev_id}
              title={item.matkul.nama_matkul}
              subtitle="Lihat Detail"
              waveColor="#3b82f63a"
              iconBgColor="bg-blue-100"
              iconColor="text-blue-600"
              textColor="text-blue-700"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ValidasiEvaluasi;
