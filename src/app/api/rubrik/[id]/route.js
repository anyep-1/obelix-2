import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Fungsi untuk mencari kategori berdasarkan skor dan rubrik
function cariKategori(skor, rubrikKategori) {
  for (const [namaKategori, info] of Object.entries(rubrikKategori)) {
    if (skor >= info.min && skor <= info.max) {
      return namaKategori.toUpperCase(); // Konsisten di frontend
    }
  }
  return "TIDAK DIKETAHUI";
}

export async function GET(req, context) {
  const { params } = context;
  const templateId = parseInt(params.id, 10);

  // Ambil template rubrik dan relasi
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

  // Parse rubrik kategori
  const rubrikKategori =
    typeof template.rubrik_kategori === "string"
      ? JSON.parse(template.rubrik_kategori)
      : template.rubrik_kategori;

  // Ambil dari tb_skor_clo yang sudah di-generate sebelumnya
  const semuaNilai = template.tb_skor_clo.map((item) => {
    const kategori = cariKategori(item.skor, rubrikKategori);
    return {
      nilai_per_question: item.skor,
      jumlah_sampel: item.jumlah_sampel || 0,
      kategori,
    };
  });

  // Hitung total jumlah sampel
  const jumlahMahasiswa = semuaNilai.reduce(
    (total, item) => total + (item.jumlah_sampel || 0),
    0
  );

  // Hitung kategori berdasarkan hasil yang tersimpan
  const kategoriCount = {
    EXEMPLARY: 0,
    SATISFACTORY: 0,
    DEVELOPING: 0,
    UNSATISFACTORY: 0,
    TIDAK_DIKETAHUI: 0,
  };

  semuaNilai.forEach((item) => {
    const kategori = item.kategori;
    if (kategoriCount[kategori] !== undefined) {
      kategoriCount[kategori] += item.jumlah_sampel || 0;
    } else {
      kategoriCount.TIDAK_DIKETAHUI += item.jumlah_sampel || 0;
    }
  });

  return NextResponse.json({
    template,
    semuaNilai,
    kategoriCount,
    jumlahMahasiswa,
  });
}
