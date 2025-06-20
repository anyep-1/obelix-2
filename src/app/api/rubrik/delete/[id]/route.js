import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    const rubrik = await prisma.tb_template_rubrik.findUnique({
      where: { template_id: Number(id) },
      select: { pi_id: true, plo_id: true },
    });

    if (!rubrik) {
      return NextResponse.json(
        { message: "Rubrik tidak ditemukan" },
        { status: 404 }
      );
    }

    // Hapus skor CLO
    await prisma.tb_skor_clo.deleteMany({
      where: { template_id: Number(id) },
    });

    // Hapus skor PI (langsung saja, nanti bisa generate ulang)
    await prisma.tb_skor_pi
      .delete({
        where: { pi_id: rubrik.pi_id },
      })
      .catch(() => {});

    // Hapus skor PLO (langsung juga)
    await prisma.tb_skor_plo
      .delete({
        where: { plo_id: rubrik.plo_id },
      })
      .catch(() => {});

    // Hapus rubrik
    await prisma.tb_template_rubrik.delete({
      where: { template_id: Number(id) },
    });

    return NextResponse.json({
      message: "Rubrik dan seluruh skor terkait berhasil dihapus",
    });
  } catch (error) {
    console.error("Gagal menghapus rubrik:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat menghapus rubrik" },
      { status: 500 }
    );
  }
}
