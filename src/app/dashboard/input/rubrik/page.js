"use client";

import apiService from "@/app/services/apiServices";
import ModalSuccess from "@/components/all/ModalSuccess";
import ReusableForm from "@/components/Do/ReuseableForm";
import { useState, useEffect } from "react";

const initialFormData = {
  kurikulum: "",
  matkul: "",
  plo: "",
  pi: "",
  ta_semester: "",
  dosen_pengampu: [],
  objek_pengukuran: "",
  kategori: [
    { level: "Exemplary", nilai: 4, min: 80, max: 100, deskripsi: "" },
    { level: "Satisfactory", nilai: 3, min: 70, max: 79, deskripsi: "" },
    { level: "Developing", nilai: 2, min: 60, max: 69, deskripsi: "" },
    { level: "Unsatisfactory", nilai: 1, min: 0, max: 59, deskripsi: "" },
  ],
};

const SetRubrik = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [options, setOptions] = useState({ matkul: [], plo: [], dosen: [] });
  const [piByPlo, setPiByPlo] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const aktif = await apiService.get("/kurikulum/active");
        const kurikulum_id = aktif?.kurikulum_id;

        if (!kurikulum_id) return;

        setFormData((prev) => ({ ...prev, kurikulum: kurikulum_id }));

        const matkulData = await apiService.get("/input/rubrik", {
          kurikulum_id,
        });

        setOptions((prev) => ({ ...prev, matkul: matkulData.matkul || [] }));
      } catch (err) {
        console.error("Gagal ambil kurikulum aktif dan matkul:", err);
      }
    };

    fetchData();
  }, []);

  const fetchPloAndPi = async (matkul_id) => {
    try {
      const selectedMatkul = options.matkul.find(
        (m) => m.matkul_id === parseInt(matkul_id)
      );
      if (!selectedMatkul) return;

      const data = await apiService.get("/input/rubrik", {
        matkul_id: selectedMatkul.matkul_id,
      });

      const groupedPi = {};
      data.pi.forEach((pi) => {
        const ploId = pi.plo_id;
        if (!groupedPi[ploId]) groupedPi[ploId] = [];
        groupedPi[ploId].push(pi);
      });

      for (const key in groupedPi) {
        groupedPi[key] = groupedPi[key].sort(
          (a, b) =>
            parseFloat(a.nomor_pi.replace(",", ".")) -
            parseFloat(b.nomor_pi.replace(",", "."))
        );
      }

      setOptions((prev) => ({
        ...prev,
        plo: data.plo.sort((a, b) => a.nomor_plo - b.nomor_plo),
        dosen: data.dosen,
      }));
      setPiByPlo(groupedPi);
    } catch (err) {
      console.error("Error fetch PI/PLO:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "matkul") {
      fetchPloAndPi(value);
      setFormData((prev) => ({
        ...prev,
        plo: "",
        pi: "",
        dosen_pengampu: [],
      }));
    }
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      dosen_pengampu: checked
        ? [...prev.dosen_pengampu, value.toString()]
        : prev.dosen_pengampu.filter((v) => v !== value.toString()),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiService.post(
        "/templateRubrik/saveTemplate",
        formData
      );
      if (!res) throw new Error("Gagal simpan");

      // Reset hanya form data, tapi pertahankan data matkul
      setFormData((prev) => ({
        ...initialFormData,
        kurikulum: prev.kurikulum, // pertahankan kurikulum_id aktif
      }));

      setOptions((prev) => ({
        ...prev,
        plo: [],
        dosen: [],
      }));

      setPiByPlo({});
      setShowSuccessModal(true);
    } catch (err) {
      console.error("Gagal submit:", err);
      alert("Terjadi kesalahan saat menyimpan.");
    }
  };

  const formFields = [
    {
      name: "matkul",
      label: "Mata Kuliah",
      type: "select",
      options: options.matkul.map((m) => ({
        value: m.matkul_id,
        label: m.nama_matkul,
      })),
      required: true,
    },
    {
      name: "plo",
      label: "PLO",
      type: "select",
      options: options.plo.map((p) => ({
        value: p.plo_id,
        label: `PLO ${p.nomor_plo}`,
      })),
      required: true,
      disabled: !formData.matkul,
    },
    {
      name: "pi",
      label: "PI",
      type: "select",
      options: (piByPlo[formData.plo] || []).map((pi) => ({
        value: pi.pi_id,
        label: `PI ${pi.nomor_pi}`,
      })),
      required: true,
      disabled: !formData.plo,
    },
    {
      name: "dosen_pengampu",
      label: "Dosen Pengampu",
      type: "checkboxGroup",
      options: options.dosen.map((d) => ({
        value: d.dosen_id,
        label: d.nama_dosen,
      })),
      onCheckboxChange: handleCheckboxChange,
    },
    {
      name: "ta_semester",
      label: "TA-Semester",
      type: "text",
      required: true,
    },
    {
      name: "objek_pengukuran",
      label: "Objek Pengukuran",
      type: "textarea",
      required: true,
    },
    {
      name: "kategori",
      type: "kategori-input",
      required: true,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Input Rubrik Penilaian</h2>

      <div className="bg-white p-6 rounded shadow-md">
        <ReusableForm
          fields={formFields}
          data={formData}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
        />
      </div>

      <ModalSuccess
        isOpen={showSuccessModal}
        message="Template rubrik berhasil disimpan!"
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
};

export default SetRubrik;
