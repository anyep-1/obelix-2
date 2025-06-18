import React from "react";

const ReusableRtItem = ({ rt, index, onChange }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange(index, name, value);
  };

  return (
    <div className="border p-4 rounded mb-4 bg-gray-50 shadow-sm">
      <label
        htmlFor={`deskripsiRT-${index}`}
        className="block mb-1 font-medium text-sm"
      >
        Deskripsi RT
      </label>
      <input
        type="text"
        id={`deskripsiRT-${index}`}
        name="deskripsiRT"
        value={rt.deskripsiRT || ""}
        onChange={handleInputChange}
        placeholder="Deskripsi RT"
        className="w-full p-2 border rounded mb-2"
      />

      <label className="block mb-1 font-medium text-sm">
        Status Implementasi
      </label>
      <p className="mb-2">{rt.statusImplementasi || "Belum"}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
        <div>
          <label
            htmlFor={`tanggalMulai-${index}`}
            className="block mb-1 font-medium text-sm"
          >
            Tanggal Mulai
          </label>
          <input
            type="date"
            id={`tanggalMulai-${index}`}
            name="tanggalMulai"
            value={rt.tanggalMulai || ""}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label
            htmlFor={`tanggalSelesai-${index}`}
            className="block mb-1 font-medium text-sm"
          >
            Tanggal Selesai
          </label>
          <input
            type="date"
            id={`tanggalSelesai-${index}`}
            name="tanggalSelesai"
            value={rt.tanggalSelesai || ""}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <label
        htmlFor={`analisisKetercapaian-${index}`}
        className="block mb-1 font-medium text-sm"
      >
        Analisis Ketercapaian
      </label>
      <textarea
        id={`analisisKetercapaian-${index}`}
        name="analisisKetercapaian"
        value={rt.analisisKetercapaian || ""}
        onChange={handleInputChange}
        placeholder="Masukkan analisis ketercapaian"
        className="w-full p-2 border rounded mb-2"
        rows={3}
      />

      <label
        htmlFor={`kendala-${index}`}
        className="block mb-1 font-medium text-sm"
      >
        Kendala
      </label>
      <textarea
        id={`kendala-${index}`}
        name="kendala"
        value={rt.kendala || ""}
        onChange={handleInputChange}
        placeholder="Masukkan kendala"
        className="w-full p-2 border rounded mb-2"
        rows={3}
      />

      <label
        htmlFor={`solusi-${index}`}
        className="block mb-1 font-medium text-sm"
      >
        Solusi
      </label>
      <textarea
        id={`solusi-${index}`}
        name="solusi"
        value={rt.solusi || ""}
        onChange={handleInputChange}
        placeholder="Masukkan solusi"
        className="w-full p-2 border rounded"
        rows={3}
      />
    </div>
  );
};

export default ReusableRtItem;
