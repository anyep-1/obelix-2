import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req) {
  try {
    const data = await req.json();
    const { clo_id, nomor_clo, nama_clo, pi_id, matkul_id } = data;

    if (!clo_id || !nomor_clo || !nama_clo || !pi_id || !matkul_id) {
      return NextResponse.json(
        { error: "Data tidak lengkap." },
        { status: 400 }
      );
    }

    const updated = await prisma.tb_clo.update({
      where: { clo_id: parseInt(clo_id) },
      data: {
        nomor_clo,
        nama_clo,
        pi_id: parseInt(pi_id),
        matkul_id: parseInt(matkul_id),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating CLO:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui CLO" },
      { status: 500 }
    );
  }
}
