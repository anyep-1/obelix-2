import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req, context) {
  const { params } = context;
  const templateId = parseInt(params.id, 10);

  // Ambil template dan relasi yang dibutuhkan
  const template = await prisma.tb_template_rubrik.findUnique({
    where: { template_id: templateId },
    include: {
      tb_matkul: { select: { nama_matkul: true } },
      tb_plo: { select: { nama_plo: true, nomor_plo: true } },
      tb_pi: {
        select: {
          deskripsi_pi: true,
          tb_clo: { select: { clo_id: true, nama_clo: true } },
        },
      },
      tb_skor_clo: true,
    },
  });

  if (!template) {
    return NextResponse.json(
      { error: "Rubrik tidak ditemukan" },
      { status: 404 }
    );
  }

  // Total jumlah mahasiswa = total sampel dari semua CLO
  const jumlahMahasiswa = template.tb_skor_clo.reduce(
    (total, item) => total + (item.jumlah_sampel || 0),
    0
  );

  // Hitung jumlah kategori berdasarkan kolom langsung dari tabel
  const kategoriCount = {
    EXEMPLARY: 0,
    SATISFACTORY: 0,
    DEVELOPING: 0,
    UNSATISFACTORY: 0,
    TIDAK_DIKETAHUI: 0,
  };

  template.tb_skor_clo.forEach((item) => {
    kategoriCount.EXEMPLARY += item.exc || 0;
    kategoriCount.SATISFACTORY += item.sat || 0;
    kategoriCount.DEVELOPING += item.dev || 0;
    kategoriCount.UNSATISFACTORY += item.uns || 0;
  });

  // Siapkan data untuk frontend jika perlu ditampilkan semua
  const semuaNilai = template.tb_skor_clo.map((item) => ({
    clo_id: item.clo_id,
    skor: item.skor,
    jumlah_sampel: item.jumlah_sampel || 0,
    exc: item.exc || 0,
    sat: item.sat || 0,
    dev: item.dev || 0,
    uns: item.uns || 0,
  }));

  return NextResponse.json({
    template,
    semuaNilai,
    kategoriCount,
    jumlahMahasiswa,
  });
}
