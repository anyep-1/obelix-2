import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req) {
  try {
    const { kurikulum_id, tahun_kurikulum } = await req.json();

    if (!kurikulum_id || !tahun_kurikulum) {
      return NextResponse.json(
        { message: "Data tidak lengkap." },
        { status: 400 }
      );
    }

    const updated = await prisma.tb_kurikulum.update({
      where: { kurikulum_id },
      data: { tahun_kurikulum },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("❌ Gagal update kurikulum:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat update." },
      { status: 500 }
    );
  }
}
