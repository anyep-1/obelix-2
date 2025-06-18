"use client";

import { useEffect, useState } from "react";
import apiService from "@/app/services/apiServices";

const SetAssessmentPlan = () => {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState({});
  const [loading, setLoading] = useState(true);
  const [kurikulumAktif, setKurikulumAktif] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const kurikulum = await apiService.get("/kurikulum/active");
        setKurikulumAktif(kurikulum);

        const res = await apiService.get(
          `/clo/assesment-map?id=${kurikulum.kurikulum_id}`
        );
        setData(res);

        const selectedData = await apiService.get("/selected-matkul");
        const selectedMap = {};
        selectedData.forEach((item) => {
          selectedMap[item.matkul_id] = true;
        });
        setSelected(selectedMap);
      } catch (error) {
        console.error("Gagal fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCheckboxChange = async (matkul_id, plo_id, isChecked) => {
    setSelected((prev) => ({ ...prev, [matkul_id]: isChecked }));

    try {
      await apiService.post("/selected-matkul", {
        matkul_id,
        plo_id,
        selected: isChecked,
      });
    } catch (error) {
      console.error("Gagal simpan selected:", error);
    }
  };

  const handleReset = async () => {
    if (!confirm("Yakin ingin menghapus semua pilihan mata kuliah?")) return;

    try {
      await apiService.delete("/selected-matkul/reset");
      setSelected({});
    } catch (err) {
      console.error("Gagal reset:", err);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Set Assessment Plan</h1>
      <p className="text-gray-600">
        Kurikulum Aktif:{" "}
        <strong>{kurikulumAktif?.tahun_kurikulum || "Tidak ditemukan"}</strong>
      </p>

      <div className="flex justify-end">
        <button
          onClick={handleReset}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Reset Semua
        </button>
      </div>

      {data.map((plo) => (
        <div
          key={`plo-${plo.plo_id}`}
          className="border p-4 rounded bg-white shadow"
        >
          <h2 className="text-xl font-semibold mb-2">PLO {plo.nomor_plo}</h2>

          {plo.pi.map((pi) => (
            <div key={`pi-${pi.pi_id}`} className="ml-4 mb-2">
              <h3 className="text-lg font-medium text-gray-700">
                PI {pi.nomor_pi}
              </h3>
              <ul className="ml-6 text-gray-800 space-y-2">
                {pi.matkul.map((mk) => (
                  <li
                    key={`mk-${mk.matkul_id}`}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      checked={!!selected[mk.matkul_id]}
                      onChange={(e) =>
                        handleCheckboxChange(
                          mk.matkul_id,
                          plo.plo_id,
                          e.target.checked
                        )
                      }
                    />
                    {mk.nama_matkul}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default SetAssessmentPlan;
