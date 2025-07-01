"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  LineController,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import apiService from "@/app/services/apiServices";
import ModalSetting from "@/components/all/ModalSetting";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  LineController
);

export default function Dashboard() {
  const [userRole, setUserRole] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [nilaiMinimum, setNilaiMinimum] = useState(3);
  const [ploData, setPloData] = useState({
    labels: [],
    dataGrafik: [],
    rataRata: 0,
  });
  const [summary, setSummary] = useState({
    totalMatkul: 0,
    totalValidasi: 0,
    totalPending: 0,
  });
  const [evaluasiTerbaru, setEvaluasiTerbaru] = useState([]);

  const chartRef = useRef(null);

  useEffect(() => {
    const resize = () => chartRef.current?.resize?.();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = await apiService.get("/me");
        setUserRole(user.user?.role || null);

        const setting = await apiService.get("/dashboard/setting");
        setNilaiMinimum(setting.nilai_minimum ?? 3);

        const matkul = await apiService.get("/dashboard/matkul");
        setSummary((prev) => ({
          ...prev,
          totalMatkul: matkul.total || 0,
        }));

        const evaluasi = await apiService.get("/dashboard/evaluasi");
        setEvaluasiTerbaru(evaluasi.evaluasiTerbaru || []);
        setSummary((prev) => ({
          ...prev,
          totalValidasi: evaluasi.totalValidasi || 0,
          totalPending: evaluasi.totalPending || 0,
        }));

        const skor = await apiService.get("/dashboard/skor");
        setPloData({
          labels: skor.labels || [],
          dataGrafik: skor.dataGrafik || [],
          rataRata: skor.rataRata || 0,
        });
      } catch (err) {
        console.error("Gagal ambil data dashboard:", err);
      }
    };

    loadData();
  }, []);

  const barData = {
    labels: ploData.labels,
    datasets: [
      {
        label: "Skor PLO",
        data: ploData.dataGrafik,
        backgroundColor: "#8FBCE6",
      },
      {
        label: "Target",
        data: ploData.labels.map(() => nilaiMinimum),
        type: "line",
        borderColor: "#E68F8F",
        borderWidth: 2,
        pointRadius: 0,
        fill: false,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { color: "#000" } },
      title: {
        display: true,
        text: "Grafik Skor PLO (Kurikulum Aktif)",
        color: "#000",
      },
    },
    scales: {
      y: { beginAtZero: true, max: 4, ticks: { stepSize: 1, color: "#000" } },
      x: { ticks: { color: "#000" } },
    },
  };

  const handleSaveSetting = async (newNilaiMinimum) => {
    try {
      const res = await apiService.put("/dashboard/setting", {
        nilai_minimum: newNilaiMinimum,
      });
      setNilaiMinimum(newNilaiMinimum);
      setModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="min-h-screen flex-1 bg-white px-4 py-6 overflow-x-hidden">
      <div className="w-full px-4 sm:px-6">
        <header className="flex justify-between items-center border-b pb-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            Dashboard Monitoring & Evaluasi PLO
          </h1>
          {userRole === "Kaprodi" && (
            <button
              onClick={() => setModalOpen(true)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Atur Nilai Target
            </button>
          )}
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Mata Kuliah", value: summary.totalMatkul },
            { label: "Total Validasi", value: summary.totalValidasi },
            { label: "Evaluasi Pending", value: summary.totalPending },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-gray-50 p-4 rounded border text-center"
            >
              <h2 className="text-sm text-gray-600">{item.label}</h2>
              <p className="text-2xl font-bold">{item.value}</p>
            </div>
          ))}
        </section>

        <div className="w-full h-[300px] sm:h-[400px] mb-10">
          <Bar ref={chartRef} data={barData} options={barOptions} />
        </div>

        <section className="bg-gray-50 rounded-lg p-4 border">
          <h2 className="text-lg font-semibold mb-3">Evaluasi Terbaru</h2>
          <ul className="divide-y text-sm">
            {evaluasiTerbaru.map(({ id, matkul, tanggal }) => (
              <li key={id} className="flex justify-between py-2 text-gray-800">
                <span>{matkul}</span>
                <time dateTime={tanggal}>
                  {tanggal
                    ? new Date(tanggal).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "-"}
                </time>
              </li>
            ))}
          </ul>
        </section>

        {modalOpen && (
          <ModalSetting
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            nilaiMinimum={nilaiMinimum}
            onSave={handleSaveSetting}
          />
        )}
      </div>
    </div>
  );
}
