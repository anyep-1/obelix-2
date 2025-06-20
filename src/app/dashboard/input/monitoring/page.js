"use client";

import apiService from "@/app/services/apiServices";
import ModalSuccess from "@/components/all/ModalSuccess";
import ReusableForm from "@/components/Do/ReuseableForm";
import React, { useState, useEffect } from "react";

const Monev = () => {
  const [formData, setFormData] = useState({
    programStudi: "",
    tanggalRTM: "",
    tanggalMonev: "",
    evaluasiPeriode: "",
    tujuanEvaluasi: "",
    metodeEvaluasi: "",
  });

  const [userTujuanId, setUserTujuanId] = useState("");
  const [userList, setUserList] = useState([]);
  const [matkulList, setMatkulList] = useState([]);
  const [selectedMatkulId, setSelectedMatkulId] = useState("");
  const [kurikulumId, setKurikulumId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [rtData, setRtData] = useState([
    {
      deskripsiRT: "",
      statusImplementasi: "",
      tanggalMulai: "",
      tanggalSelesai: "",
      analisisKetercapaian: "",
      kendala: "",
      solusi: "",
    },
  ]);

  const [loadingUsers, setLoadingUsers] = useState(false);
  const [errorUsers, setErrorUsers] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Fetch kurikulum aktif
  useEffect(() => {
    const fetchKurikulum = async () => {
      try {
        const res = await apiService.get("/kurikulum/active");
        if (res?.kurikulum_id) {
          setKurikulumId(res.kurikulum_id);
        }
      } catch (err) {
        console.error("Gagal mengambil kurikulum aktif", err);
      }
    };
    fetchKurikulum();
  }, []);

  // Fetch users (dosen)
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const res = await apiService.get("/users/by-role");
        const filtered = res.filter(
          (user) =>
            user.role.toLowerCase() === "dosenampu" ||
            user.role.toLowerCase() === "dosenkoor"
        );
        setUserList(filtered);
        setErrorUsers(null);
      } catch (err) {
        setErrorUsers("Gagal mengambil data dosen");
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  // Fetch mata kuliah by kurikulum aktif
  useEffect(() => {
    if (!kurikulumId) return;

    const fetchMatkul = async () => {
      try {
        const res = await apiService.get("/matkul/by-kurikulum", {
          id: kurikulumId,
        });
        setMatkulList(res);
      } catch (err) {
        console.error("Gagal mengambil data matkul", err);
      }
    };
    fetchMatkul();
  }, [kurikulumId]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === "userTujuanId") setUserTujuanId(value);
    else if (name === "matkulId") setSelectedMatkulId(value);
    else setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // ⏳ Start loading

    const payload = {
      formData,
      userTujuanId,
      matkulId: selectedMatkulId,
      rtData,
    };

    try {
      await apiService.post("/input/monitoring", payload);
      setIsSuccessModalOpen(true);

      // reset form
      setFormData({
        programStudi: "",
        tanggalRTM: "",
        tanggalMonev: "",
        evaluasiPeriode: "",
        tujuanEvaluasi: "",
        metodeEvaluasi: "",
      });
      setUserTujuanId("");
      setSelectedMatkulId("");
      setRtData([
        {
          deskripsiRT: "",
          statusImplementasi: "",
          tanggalMulai: "",
          tanggalSelesai: "",
          analisisKetercapaian: "",
          kendala: "",
          solusi: "",
        },
      ]);
    } catch (err) {
      alert("Gagal menyimpan data");
      console.error(err);
    } finally {
      setLoading(false); // ✅ End loading
    }
  };

  const fields = [
    {
      type: "select",
      name: "userTujuanId",
      label: "Dosen Tujuan",
      required: true,
      options: userList.map((user) => ({
        value: user.user_id,
        label: user.nama,
      })),
      disabled: loadingUsers || errorUsers,
    },
    {
      type: "select",
      name: "matkulId",
      label: "Mata Kuliah",
      required: true,
      options: matkulList.map((matkul) => ({
        value: matkul.matkul_id,
        label: matkul.nama_matkul,
      })),
    },
    {
      type: "select",
      name: "programStudi",
      label: "Program Studi",
      required: true,
      options: [{ value: "Teknik Komputer", label: "Teknik Komputer" }],
    },
    {
      type: "date",
      name: "tanggalRTM",
      label: "Tanggal RTM",
      required: true,
    },
    {
      type: "date",
      name: "tanggalMonev",
      label: "Tanggal Monev",
      required: true,
    },
    {
      type: "text",
      name: "evaluasiPeriode",
      label: "Periode Evaluasi",
      placeholder: "cth: Ganjil 2021/2022",
      required: true,
    },
    {
      type: "textarea",
      name: "tujuanEvaluasi",
      label: "Tujuan Evaluasi",
      required: true,
    },
    {
      type: "textarea",
      name: "metodeEvaluasi",
      label: "Metode Evaluasi",
      required: true,
    },
    {
      type: "rt-list",
      name: "rtData",
      label: "Rencana Tindak",
      value: rtData,
      onChange: (index, key, value) => {
        const updated = [...rtData];
        updated[index] = { ...updated[index], [key]: value };
        setRtData(updated);
      },
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex justify-center">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-4xl">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">
          Form Monitoring & Evaluasi
        </h1>

        <ReusableForm
          fields={fields}
          data={{ ...formData, userTujuanId, matkulId: selectedMatkulId }}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
          loading={loading}
        />

        <div className="mt-6 flex justify-between items-center">
          <button
            type="button"
            onClick={() =>
              setRtData([
                ...rtData,
                {
                  deskripsiRT: "",
                  statusImplementasi: "",
                  tanggalMulai: "",
                  tanggalSelesai: "",
                  analisisKetercapaian: "",
                  kendala: "",
                  solusi: "",
                },
              ])
            }
            className="text-blue-600 hover:underline"
          >
            + Tambah Rencana Tindak
          </button>
        </div>
      </div>

      <ModalSuccess
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        message="Data berhasil disimpan"
      />
    </div>
  );
};

export default Monev;
