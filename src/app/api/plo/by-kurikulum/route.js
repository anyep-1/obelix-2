import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));

  if (isNaN(id)) {
    return NextResponse.json({ message: "ID tidak valid" }, { status: 400 });
  }

  const data = await prisma.tb_plo.findMany({
    where: {
      kurikulum_id: id,
    },
    include: {
      tb_plo_profil: {
        include: {
          tb_profillulusan: true,
        },
      },
    },
    orderBy: {
      plo_id: "asc",
    },
  });

  return NextResponse.json(data);
}
