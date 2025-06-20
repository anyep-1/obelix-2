import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";

export async function GET(req) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (id) {
    // GET by template_id
    const template = await prisma.tb_template_rubrik.findUnique({
      where: { template_id: Number(id) },
      include: {
        tb_matkul: true,
        tb_pi: {
          include: {
            tb_plo: true,
            tb_clo: true, // biarkan ini tetap, hanya untuk detail
          },
        },
      },
    });

    return NextResponse.json(template);
  }

  // ✅ GET ALL templates only for active kurikulum
  const activeKurikulum = await prisma.tb_kurikulum.findFirst({
    where: { selected: true },
  });

  if (!activeKurikulum) {
    return NextResponse.json({ templates: [] });
  }

  const templates = await prisma.tb_template_rubrik.findMany({
    where: {
      kurikulum_id: activeKurikulum.kurikulum_id,
    },
    include: {
      tb_matkul: true,
      tb_pi: {
        include: {
          tb_clo: true,
        },
      },
    },
  });

  // ✅ Perbaiki agar hanya CLO yang sesuai matkul_id
  const formatted = templates.map((tpl) => {
    const cloList =
      tpl.tb_pi?.tb_clo?.filter((c) => c.matkul_id === tpl.matkul_id) || [];

    return {
      template_id: tpl.template_id,
      matkul: tpl.tb_matkul.nama_matkul,
      kurikulum: `TA ${tpl.ta_semester}`,
      clo: cloList.map((c) => c.nomor_clo),
    };
  });

  return NextResponse.json({ templates: formatted });
}
