import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const ploId = searchParams.get("id");

    if (!ploId) {
      return NextResponse.json(
        { error: "PLO ID wajib diisi!" },
        { status: 400 }
      );
    }

    const ploIdInt = parseInt(ploId, 10);
    if (isNaN(ploIdInt)) {
      return NextResponse.json(
        { error: "PLO ID tidak valid!" },
        { status: 400 }
      );
    }

    await prisma.$transaction([
      prisma.tb_plo_profil.deleteMany({ where: { plo_id: ploIdInt } }),
      prisma.tb_pi.deleteMany({ where: { plo_id: ploIdInt } }),
      prisma.tb_clo.deleteMany({ where: { plo_id: ploIdInt } }),
      prisma.tb_template_rubrik.deleteMany({ where: { plo_id: ploIdInt } }),
      prisma.tb_selected_matkul.deleteMany({ where: { plo_id: ploIdInt } }),
      prisma.tb_skor_plo.deleteMany({ where: { plo_id: ploIdInt } }),
      prisma.tb_plo.delete({ where: { plo_id: ploIdInt } }),
    ]);

    return NextResponse.json(
      { message: "PLO berhasil dihapus!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting PLO:", error);
    return NextResponse.json({ error: "Gagal menghapus PLO" }, { status: 500 });
  }
}
