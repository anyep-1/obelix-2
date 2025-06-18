import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const data = await req.json();

    // Validasi kurikulum aktif
    const kurikulum = await prisma.tb_kurikulum.findFirst({
      where: { selected: true },
    });

    if (!kurikulum) {
      return NextResponse.json(
        { error: "Kurikulum aktif tidak ditemukan." },
        { status: 400 }
      );
    }

    // Ambil semua kelas dari kurikulum aktif
    const kelasList = await prisma.tb_kelas.findMany({
      where: { kurikulum_id: kurikulum.kurikulum_id },
      select: { kelas_id: true, kode_kelas: true },
    });

    const kelasMap = {};
    kelasList.forEach((k) => {
      kelasMap[k.kode_kelas] = k.kelas_id;
    });

    // Validasi dan siapkan data mahasiswa
    const mahasiswaData = [];
    for (const item of data) {
      const kelasId = kelasMap[item.kode_kelas];
      if (!kelasId) {
        return NextResponse.json(
          {
            error: `Kelas '${item.kode_kelas}' tidak ditemukan dalam kurikulum aktif.`,
          },
          { status: 400 }
        );
      }

      mahasiswaData.push({
        nama_mahasiswa: item.nama,
        nim_mahasiswa: String(item.nim),
        enroll_year: Number(item.enroll_year),
        kelas_id: kelasId,
      });
    }

    // Simpan data secara batch
    const created = await prisma.$transaction(
      mahasiswaData.map((mhs) => prisma.tb_mahasiswa.create({ data: mhs }))
    );

    return NextResponse.json(
      { success: true, inserted: created.length },
      { status: 201 }
    );
  } catch (err) {
    console.error("❌ Gagal menyimpan mahasiswa:", err);
    return NextResponse.json(
      { error: err.message || "Gagal menyimpan data mahasiswa." },
      { status: 500 }
    );
  }
}
