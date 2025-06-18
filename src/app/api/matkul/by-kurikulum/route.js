import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));

  if (isNaN(id)) {
    return NextResponse.json({ message: "ID tidak valid" }, { status: 400 });
  }

  try {
    const matkul = await prisma.tb_matkul.findMany({
      where: { kurikulum_id: id },
      select: {
        matkul_id: true,
        nama_matkul: true,
        kode_matkul: true,
      },
    });

    return NextResponse.json(matkul);
  } catch (error) {
    console.error("Gagal mengambil data matkul:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
