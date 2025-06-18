// /app/api/clo/from-active-kurikulum/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const kurikulum = await prisma.tb_kurikulum.findFirst({
      where: { selected: true },
    });

    if (!kurikulum) {
      return NextResponse.json({ cloList: [] });
    }

    const cloList = await prisma.tb_clo.findMany({
      where: {
        tb_matkul: {
          kurikulum_id: kurikulum.id,
        },
      },
      include: {
        tb_matkul: true,
      },
      orderBy: {
        nomor_clo: "asc",
      },
    });

    return NextResponse.json({ cloList });
  } catch (err) {
    console.error("Gagal ambil CLO aktif:", err);
    return NextResponse.json(
      { error: "Gagal mengambil CLO dari kurikulum aktif" },
      { status: 500 }
    );
  }
}
