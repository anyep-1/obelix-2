import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    const rubrik = await prisma.tb_template_rubrik.findUnique({
      where: { template_id: Number(id) },
    });

    if (!rubrik) {
      return NextResponse.json(
        { message: "Rubrik tidak ditemukan" },
        { status: 404 }
      );
    }

    // Hapus skor CLO yang terkait jika ada
    await prisma.tb_skor_clo.deleteMany({
      where: { template_id: Number(id) },
    });

    // Hapus rubrik
    await prisma.tb_template_rubrik.delete({
      where: { template_id: Number(id) },
    });

    return NextResponse.json({ message: "Rubrik berhasil dihapus" });
  } catch (error) {
    console.error("Gagal menghapus rubrik:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat menghapus rubrik" },
      { status: 500 }
    );
  }
}
