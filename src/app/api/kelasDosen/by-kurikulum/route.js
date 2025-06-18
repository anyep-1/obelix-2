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

    const kelasDosen = await prisma.tb_kelas_dosen.findMany({
      where: {
        tb_matkul: {
          kurikulum_id: kurikulum.kurikulum_id,
        },
      },
      include: {
        tb_dosen: true,
        tb_matkul: true,
      },
    });

    return NextResponse.json(kelasDosen);
  } catch (error) {
    console.error("Gagal ambil kelas dosen:", error);
    return NextResponse.json([], { status: 500 });
  }
}
