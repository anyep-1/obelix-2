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
    // Validasi kurikulum
    const kurikulum = await prisma.tb_kurikulum.findFirst({
      where: { kurikulum_id },
    });

    if (!kurikulum) {
      return NextResponse.json({ kelas: [], totalPages: 0 });
    }

    // Hitung total kelas
    const totalCount = await prisma.tb_kelas.count({
      where: { kurikulum_id },
    });

    // Ambil data kelas sesuai pagination
    const kelas = await prisma.tb_kelas.findMany({
      where: { kurikulum_id },
      skip,
      take: limit,
      orderBy: {
        kode_kelas: "asc",
      },
    });

    return NextResponse.json({
      kelas,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (err) {
    console.error("❌ Gagal ambil kelas:", err);
    return NextResponse.json(
      { error: "Gagal mengambil data kelas." },
      { status: 500 }
    );
  }
}
