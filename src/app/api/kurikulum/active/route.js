// src/app/api/kurikulum/aktif/route.js
import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";

export async function GET() {
  const aktif = await prisma.tb_kurikulum.findFirst({
    where: { selected: true },
  });

  if (!aktif)
    return Response.json(
      { error: "Tidak ada kurikulum aktif" },
      { status: 404 }
    );
  return Response.json(aktif);
}
