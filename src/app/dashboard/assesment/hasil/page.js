"use client";

import { useEffect, useState } from "react";
import apiService from "@/app/services/apiServices";
import TableAssessment from "@/components/Plan/TableAssessment";

const AssessmentResultPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [kurikulumAktif, setKurikulumAktif] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const kurikulum = await apiService.get("/kurikulum/active");
        setKurikulumAktif(kurikulum);

        const res = await apiService.get(
          `/selected-matkul/hasil?id=${kurikulum.kurikulum_id}`
        );
        setData(res.data);
      } catch (err) {
        console.error("Gagal ambil data hasil:", err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4">Hasil Assessment Plan</h1>
      <p className="mb-2 text-gray-600">
        Kurikulum Aktif:{" "}
        <strong>{kurikulumAktif?.tahun_kurikulum || "Tidak ditemukan"}</strong>
      </p>
      <TableAssessment ploData={data} />
    </div>
  );
};

export default AssessmentResultPage;
