import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "ID tidak ditemukan." },
        { status: 400 }
      );
    }

    await prisma.tb_profillulusan.delete({
      where: {
        profil_id: Number(id),
      },
    });

    return NextResponse.json(
      { message: "Data berhasil dihapus." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting profil lulusan:", error);
    return NextResponse.json(
      { message: "Gagal menghapus data." },
      { status: 500 }
    );
  }
}
