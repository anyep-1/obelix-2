"use client";

import { useEffect, useState } from "react";
import ReusableForm from "@/components/Do/ReuseableForm";
import ModalSuccess from "@/components/all/ModalSuccess";
import apiService from "@/app/services/apiServices";

const InputPortofolio = () => {
  const [matkulList, setMatkulList] = useState([]);
  const [kelasList, setKelasList] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [kurikulumAktif, setKurikulumAktif] = useState(null);

  const [form, setForm] = useState({
    tahun_akademik: "",
    matkul_id: "",
    kelas_id: "",
    google_drive_link: "",
  });

  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // ✅ Ambil kurikulum aktif
        const aktif = await apiService.get("/kurikulum/active");

        console.log("Kurikulum Aktif:", aktif);
        setKurikulumAktif(aktif);

        // ✅ Ambil kelas mahasiswa
        const kelasRes = await apiService.get("/kelasMahasiswa/by-kurikulum");
        const kelasArray = kelasRes.kelas || [];

        console.log("Data kelas dari API:", kelasArray);

        setKelasList(
          kelasArray
            .sort((a, b) =>
              a.kode_kelas.localeCompare(b.kode_kelas, undefined, {
                numeric: true,
              })
            )
            .map((k) => ({
              value: k.kelas_id,
              label: k.kode_kelas,
            }))
        );

        // ✅ Ambil mata kuliah berdasarkan kurikulum aktif
        if (aktif?.kurikulum_id) {
          const matkulRes = await apiService.get(
            `/matkul/by-kurikulum?id=${aktif.kurikulum_id}`
          );

          setMatkulList(
            matkulRes.map((m) => ({
              value: m.matkul_id,
              label: m.nama_matkul,
            }))
          );
        }
      } catch (err) {
        console.error(
          "Gagal fetch data awal:",
          err?.response?.data || err.message
        );
      }
    };

    fetchInitialData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!kurikulumAktif?.kurikulum_id) {
      setStatus("Kurikulum aktif tidak ditemukan.");
      return;
    }

    try {
      await apiService.post("/input/portofolio", {
        ...form,
        kurikulum_id: kurikulumAktif.kurikulum_id,
      });

      setStatus("Berhasil disimpan");
      setForm({
        tahun_akademik: "",
        matkul_id: "",
        kelas_id: "",
        google_drive_link: "",
      });
      setShowSuccessModal(true);
    } catch (err) {
      console.error(err);
      setStatus("Gagal menyimpan");
    }
  };

  const fields = [
    {
      type: "text",
      name: "tahun_akademik",
      label: "Tahun Akademik",
      required: true,
      placeholder: "Masukan Tahun Akademik",
    },
    {
      type: "select",
      name: "matkul_id",
      label: "Mata Kuliah",
      required: true,
      disabled: matkulList.length === 0,
      options: matkulList,
    },
    {
      type: "select",
      name: "kelas_id",
      label: "Kelas",
      required: true,
      disabled: kelasList.length === 0,
      options: kelasList,
    },
    {
      type: "text",
      name: "google_drive_link",
      label: "Link Google Drive",
      required: true,
      placeholder: "Masukkan Link Gdrive",
    },
  ];

  return (
    <div className="max-w-6xl ml-8 p-4">
      <h2 className="text-xl font-bold mb-4">Input Portofolio Mata Kuliah</h2>

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <ReusableForm
          fields={fields}
          data={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </div>

      <ModalSuccess
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message="Portofolio berhasil disimpan!"
      />
    </div>
  );
};

export default InputPortofolio;
