import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  try {
    // Ambil kurikulum aktif
    const kurikulum = await prisma.tb_kurikulum.findFirst({
      where: { selected: true },
    });

    if (!kurikulum) {
      return NextResponse.json({ kelas: [], totalPages: 0 });
    }

    // Hitung total data untuk pagination
    const totalCount = await prisma.tb_kelas_dosen.count({
      where: {
        tb_matkul: {
          kurikulum_id: kurikulum.kurikulum_id,
        },
      },
    });

    // Ambil data dengan relasi dan pagination
    const kelas = await prisma.tb_kelas_dosen.findMany({
      where: {
        tb_matkul: {
          kurikulum_id: kurikulum.kurikulum_id,
        },
      },
      include: {
        tb_dosen: true,
        tb_matkul: true,
      },
      skip,
      take: limit,
      orderBy: {
        tahun_akademik: "desc",
      },
    });

    return NextResponse.json({
      kelas,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error("❌ Gagal ambil kelas dosen:", error);
    return NextResponse.json(
      { error: "Gagal ambil data kelas dosen." },
      { status: 500 }
    );
  }
}
