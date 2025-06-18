import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "ID tidak ditemukan" },
        { status: 400 }
      );
    }

    await prisma.tb_matkul.delete({
      where: {
        matkul_id: parseInt(id), // ← konversi ke integer
      },
    });

    return NextResponse.json({ message: "Berhasil dihapus" });
  } catch (error) {
    console.error("Gagal hapus matkul:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat menghapus" },
      { status: 500 }
    );
  }
}
