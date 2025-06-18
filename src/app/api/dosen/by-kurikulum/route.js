import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const kurikulum = await prisma.tb_kurikulum.findFirst({
      where: { selected: true },
    });

    if (!kurikulum) {
      return NextResponse.json([], { status: 200 });
    }

    const dosen = await prisma.tb_dosen.findMany({
      where: { kurikulum_id: kurikulum.kurikulum_id },
      select: {
        dosen_id: true,
        nama_dosen: true,
        kode_dosen: true,
      },
    });

    return NextResponse.json(dosen);
  } catch (error) {
    console.error("Gagal ambil dosen:", error);
    return NextResponse.json([], { status: 500 });
  }
}
