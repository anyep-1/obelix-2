import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const kurikulum = await prisma.tb_kurikulum.findFirst({
      where: { selected: true },
    });
    if (!kurikulum) return NextResponse.json({ total: 0 });

    const total = await prisma.tb_matkul.count({
      where: { kurikulum_id: kurikulum.kurikulum_id },
    });

    return NextResponse.json({ total });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data matkul" },
      { status: 500 }
    );
  }
}
