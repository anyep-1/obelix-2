import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";

export async function PUT(req) {
  try {
    const body = await req.json();
    const { profil_id, deskripsi_profil } = body;

    if (!profil_id || !deskripsi_profil) {
      return NextResponse.json(
        { message: "Data tidak lengkap." },
        { status: 400 }
      );
    }

    await prisma.tb_profillulusan.update({
      where: { profil_id: Number(profil_id) },
      data: { deskripsi_profil },
    });

    return NextResponse.json(
      { message: "Data berhasil diperbarui." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating profil lulusan:", error);
    return NextResponse.json(
      { message: "Gagal memperbarui data." },
      { status: 500 }
    );
  }
}
