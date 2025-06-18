// src/app/api/profillulusan/create/route.js
import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";

export async function POST(req) {
  const { deskripsi } = await req.json();

  // cari kurikulum aktif
  const kurikulum = await prisma.tb_kurikulum.findFirst({
    where: { selected: true },
  });

  if (!kurikulum) {
    return Response.json(
      { error: "Tidak ada kurikulum aktif" },
      { status: 400 }
    );
  }

  const newProfil = await prisma.tb_profillulusan.create({
    data: {
      deskripsi_profil: deskripsi,
      kurikulum_id: kurikulum.kurikulum_id,
    },
  });

  return Response.json(newProfil);
}
