import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const kurikulum_id = Number(searchParams.get("kurikulum_id"));
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  try {
    const kurikulum = await prisma.tb_kurikulum.findFirst({
      where: { kurikulum_id },
    });

    if (!kurikulum) {
      return NextResponse.json({ mahasiswa: [], totalPages: 0 });
    }

    // ✅ Hitung total mahasiswa sesuai kurikulum
    const totalCount = await prisma.tb_mahasiswa.count({
      where: {
        tb_kelas: {
          is: {
            kurikulum_id: kurikulum.kurikulum_id,
          },
        },
      },
    });

    // ✅ Ambil data mahasiswa dengan relasi kelas
    const mahasiswa = await prisma.tb_mahasiswa.findMany({
      where: {
        tb_kelas: {
          is: {
            kurikulum_id: kurikulum.kurikulum_id,
          },
        },
      },
      include: {
        tb_kelas: {
          select: {
            kode_kelas: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        nama_mahasiswa: "asc",
      },
    });

    const formatted = mahasiswa.map((mhs) => ({
      mahasiswa_id: mhs.mahasiswa_id,
      nama_mahasiswa: mhs.nama_mahasiswa,
      nim_mahasiswa: mhs.nim_mahasiswa,
      enroll_year: mhs.enroll_year,
      tb_kelas: mhs.tb_kelas,
    }));

    return NextResponse.json({
      mahasiswa: formatted,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (err) {
    console.error("❌ Gagal mengambil mahasiswa:", err);
    return NextResponse.json(
      { error: "Gagal mengambil data mahasiswa." },
      { status: 500 }
    );
  }
}
