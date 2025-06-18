import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Ambil kurikulum aktif
    const kurikulumAktif = await prisma.tb_kurikulum.findFirst({
      where: { selected: true },
    });

    if (!kurikulumAktif) {
      return NextResponse.json({ kelas: [] });
    }

    // Ambil hanya kelas yang sesuai kurikulum aktif
    const data = await prisma.tb_kelas.findMany({
      where: {
        kurikulum_id: kurikulumAktif.kurikulum_id,
      },
    });

    return NextResponse.json({ kelas: data });
  } catch (err) {
    console.error("❌ Gagal ambil kelas:", err);
    return NextResponse.json(
      { error: "Gagal mengambil data kelas." },
      { status: 500 }
    );
  }
}
