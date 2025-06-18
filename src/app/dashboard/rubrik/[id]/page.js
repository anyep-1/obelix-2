"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import apiService from "@/app/services/apiServices";
import LoadingSpinner from "@/components/all/LoadingSpinner";

function RubrikDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [tpl, setTpl] = useState(null);
  const [kategoriCount, setKategoriCount] = useState(null);
  const [jumlahMahasiswa, setJumlahMahasiswa] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setTpl(null);
      setKategoriCount(null);
      setJumlahMahasiswa(0);

      try {
        const res = await apiService.get(`/rubrik/${id}`);
        if (!res || !res.template) {
          console.error("Template tidak ditemukan");
          return;
        }

        setTpl(res.template);
        setKategoriCount(res.kategoriCount || {});
        setJumlahMahasiswa(res.jumlahMahasiswa || 0);
      } catch (err) {
        console.error("Gagal mengambil data rubrik:", err);
      }
    };

    fetchData();
  }, [id]);

  if (!tpl || !kategoriCount) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  const skorFinalRaw = Array.isArray(tpl.tb_skor_clo)
    ? tpl.tb_skor_clo[0]?.skor || 0
    : tpl.tb_skor_clo?.skor || 0;
  const skorFinal = parseFloat(skorFinalRaw).toFixed(2);
  const jumlahFinal = jumlahMahasiswa || 0;

  const rubrik =
    typeof tpl.rubrik_kategori === "string"
      ? JSON.parse(tpl.rubrik_kategori)
      : tpl.rubrik_kategori;

  const dosenList = (() => {
    try {
      return Array.isArray(tpl.dosen_pengampu)
        ? tpl.dosen_pengampu
        : JSON.parse(tpl.dosen_pengampu || "[]");
    } catch {
      return [];
    }
  })();

  const downloadPDF = async () => {
    const el = document.getElementById("to-pdf");
    if (!el) {
      console.error("Elemen to-pdf tidak ditemukan");
      return;
    }

    try {
      const html2pdf = (await import("html2pdf.js")).default;

      // Biarkan browser merender dulu baru convert ke PDF
      setTimeout(() => {
        html2pdf()
          .from(el)
          .set({
            margin: [0.5, 0.5, 0.5, 0.5], // Cukup ruang di kiri-kanan
            filename: `rubrik_${id}.pdf`,
            html2canvas: {
              scale: 2,
              useCORS: true,
              windowWidth: 1200, // Memastikan lebar viewport cukup
            },
            jsPDF: {
              unit: "in",
              format: "a3",
              orientation: "portrait",
            },
            pagebreak: { mode: ["css", "legacy"] },
          })
          .save();
      }, 300);
    } catch (error) {
      console.error("Gagal menyimpan PDF:", error);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <div
        id="to-pdf"
        style={{
          backgroundColor: "#ffffff",
          color: "#000000",
          fontFamily: "Arial, sans-serif",
          width: "8.27in",
          margin: "0 auto",
          padding: "1rem",
          border: "1px solid #000",
          fontSize: "12px",
          lineHeight: 1.4,
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontWeight: "bold",
            marginBottom: "1rem",
          }}
        >
          RUBRIK PENGUKURAN PLO {tpl.tb_plo?.nomor_plo || "-"}
        </h2>

        <table style={tableStyle}>
          <tbody>
            <tr>
              <td style={tdHead}>Kuliah</td>
              <td style={td}>{tpl.tb_matkul?.nama_matkul || "-"}</td>
              <td style={tdHead}>Objek pengukuran</td>
              <td style={td}>{tpl.objek_pengukuran || "-"}</td>
            </tr>
            <tr>
              <td style={tdHead}>TA-Semester</td>
              <td style={td}>{tpl.ta_semester || "-"}</td>
              <td style={td}></td>
              <td style={td}></td>
            </tr>
            <tr>
              <td style={tdHead}>Dosen pengampu</td>
              <td style={td} colSpan={3}>
                {dosenList.map((d, i) => (
                  <div key={i}>{d}</div>
                ))}
              </td>
            </tr>
          </tbody>
        </table>

        <h3 style={{ fontWeight: "bold", marginTop: "1rem" }}>
          Pengukuran Luaran
        </h3>

        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={th} colSpan={2}>
                Program Learning Outcome:
              </th>
              <th style={th} colSpan={2} align="left">
                {tpl.tb_plo?.nama_plo || "-"}
              </th>
            </tr>
            <tr>
              <th style={th} colSpan={2}>
                Performance Indicator:
              </th>
              <th style={th} colSpan={2} align="left">
                {tpl.tb_pi?.deskripsi_pi || "-"}
              </th>
            </tr>
            <tr>
              <th style={th} colSpan={4} align="center">
                Klasifikasi Pengukuran Luaran
              </th>
            </tr>
            <tr>
              {[
                "Exemplary",
                "Satisfactory",
                "Developing",
                "Unsatisfactory",
              ].map((t) => (
                <th key={t} style={th}>
                  {t}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={td}>{rubrik.exemplary?.deskripsi || "-"}</td>
              <td style={td}>{rubrik.satisfactory?.deskripsi || "-"}</td>
              <td style={td}>{rubrik.developing?.deskripsi || "-"}</td>
              <td style={td}>{rubrik.unsatisfactory?.deskripsi || "-"}</td>
            </tr>
            <tr>
              <th style={th} colSpan={4}>
                Hasil ({jumlahFinal} sampel)
              </th>
            </tr>
            <tr>
              <th style={th}>Exemplary (4)</th>
              <th style={th}>Satisfactory (3)</th>
              <th style={th}>Developing (2)</th>
              <th style={th}>Unsatisfactory (1)</th>
            </tr>
            <tr>
              <td style={td}>{kategoriCount.EXEMPLARY || 0}</td>
              <td style={td}>{kategoriCount.SATISFACTORY || 0}</td>
              <td style={td}>{kategoriCount.DEVELOPING || 0}</td>
              <td style={td}>{kategoriCount.UNSATISFACTORY || 0}</td>
            </tr>
            <tr>
              <td style={td} colSpan={4}>
                <div>Skor:</div>
                <div style={{ paddingLeft: "1rem" }}>
                  {skorFinal} dari {jumlahFinal} mahasiswa
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    fontStyle: "italic",
                    color: "#444",
                  }}
                >
                  *Jika belum ada skor tersimpan, sistem menampilkan 0
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "1rem",
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            backgroundColor: "#dc2626",
            color: "#fff",
            padding: "0.5rem 1rem",
            borderRadius: "4px",
            border: "none",
          }}
        >
          ← Kembali
        </button>
        <button
          onClick={downloadPDF}
          style={{
            backgroundColor: "#2563eb",
            color: "#fff",
            padding: "0.5rem 1rem",
            borderRadius: "4px",
            border: "none",
          }}
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "0.5rem",
};

const th = {
  border: "1px solid #000",
  padding: "6px",
  backgroundColor: "#f0f0f0",
};

const td = {
  border: "1px solid #000",
  padding: "6px",
};

const tdHead = {
  ...td,
  fontWeight: "bold",
  width: "25%",
};

export default RubrikDetail;
