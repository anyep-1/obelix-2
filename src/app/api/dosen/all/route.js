import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const kurikulum = await prisma.tb_kurikulum.findFirst({
      where: { selected: true },
    });

    if (!kurikulum) {
      return NextResponse.json({ dosen: [] });
    }

    const dosen = await prisma.tb_dosen.findMany({
      where: { kurikulum_id: kurikulum.kurikulum_id },
      select: {
        dosen_id: true,
        nama_dosen: true,
      },
      orderBy: {
        nama_dosen: "asc",
      },
    });

    return NextResponse.json({ dosen });
  } catch (error) {
    console.error("❌ Gagal ambil semua dosen:", error);
    return NextResponse.json(
      { error: "Gagal mengambil semua data dosen." },
      { status: 500 }
    );
  }
}
