// src/app/api/pi/by-plo/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get("id"));

  if (isNaN(id)) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  try {
    const piList = await prisma.tb_pi.findMany({
      where: { plo_id: id },
      select: {
        pi_id: true,
        nomor_pi: true,
        tb_skor_pi: true,
      },
      orderBy: {
        pi_id: "asc",
      },
    });

    return NextResponse.json(piList);
  } catch (error) {
    console.error("Error fetching PI by PLO:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data PI" },
      { status: 500 }
    );
  }
}
