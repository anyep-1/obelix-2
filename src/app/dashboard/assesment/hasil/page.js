"use client";

import { useEffect, useState } from "react";
import apiService from "@/app/services/apiServices";
import TableAssessment from "@/components/Plan/TableAssessment";
import Alert from "@/components/all/Alert";
import LoadingSpinner from "@/components/all/LoadingSpinner";

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

        const sortedData = res.data.sort((a, b) => {
          const angkaA = parseInt(a.tingkat?.match(/\d+/)?.[0] || "0");
          const angkaB = parseInt(b.tingkat?.match(/\d+/)?.[0] || "0");
          return angkaA - angkaB;
        });

        setData(sortedData);
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
        <LoadingSpinner />
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

      {data.length === 0 ? (
        <Alert.InfoAlert
          title="Belum Ada Data"
          message="Belum ada mata kuliah yang dipilih untuk assessment plan."
        />
      ) : (
        <TableAssessment ploData={data} />
      )}
    </div>
  );
};

export default AssessmentResultPage;
