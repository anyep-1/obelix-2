import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get("id"));

    if (!id) {
      return NextResponse.json({ error: "ID tidak valid." }, { status: 400 });
    }

    // Hapus dulu semua question yang berelasi dengan clo
    await prisma.tb_question.deleteMany({
      where: { clo_id: id },
    });

    // Baru hapus CLO
    await prisma.tb_clo.delete({
      where: { clo_id: id },
    });

    return NextResponse.json({ message: "Berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting CLO:", error);
    return NextResponse.json({ error: "Gagal menghapus CLO" }, { status: 500 });
  }
}
