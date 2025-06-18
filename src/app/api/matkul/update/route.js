import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req) {
  try {
    const body = await req.json();
    const {
      matkul_id,
      nama_matkul,
      kode_matkul,
      jumlah_sks,
      tingkat,
      semester,
    } = body;

    if (
      !matkul_id ||
      !nama_matkul ||
      !kode_matkul ||
      jumlah_sks === undefined
    ) {
      return NextResponse.json(
        { message: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    const updated = await prisma.tb_matkul.update({
      where: { matkul_id },
      data: {
        nama_matkul,
        kode_matkul,
        jumlah_sks: parseInt(jumlah_sks),
        tingkat,
        semester,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Gagal update matkul:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat update data" },
      { status: 500 }
    );
  }
}
