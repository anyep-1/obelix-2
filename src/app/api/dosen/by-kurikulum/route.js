import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  try {
    const kurikulum = await prisma.tb_kurikulum.findFirst({
      where: { selected: true },
    });

    if (!kurikulum) {
      return NextResponse.json({ dosen: [], totalPages: 0 });
    }

    // Hitung total data
    const totalCount = await prisma.tb_dosen.count({
      where: { kurikulum_id: kurikulum.kurikulum_id },
    });

    // Ambil data sesuai halaman
    const dosen = await prisma.tb_dosen.findMany({
      where: { kurikulum_id: kurikulum.kurikulum_id },
      select: {
        dosen_id: true,
        nama_dosen: true,
        kode_dosen: true,
      },
      skip,
      take: limit,
      orderBy: {
        nama_dosen: "asc",
      },
    });

    return NextResponse.json({
      dosen,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error("❌ Gagal ambil dosen:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data dosen." },
      { status: 500 }
    );
  }
}
