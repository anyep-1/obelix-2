import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req) {
  try {
    const body = await req.json();
    const { plo_id, nomor_plo, nama_plo } = body;

    if (!plo_id || !nomor_plo || !nama_plo) {
      return NextResponse.json(
        { message: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    await prisma.tb_plo.update({
      where: { plo_id },
      data: {
        nomor_plo,
        nama_plo,
      },
    });

    return NextResponse.json({ message: "Berhasil diupdate" });
  } catch (error) {
    console.error("Gagal update PLO:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat update" },
      { status: 500 }
    );
  }
}
