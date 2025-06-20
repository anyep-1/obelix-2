// /app/api/kurikulum/check/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const tahun = searchParams.get("tahun");

  const exists = await prisma.tb_kurikulum.findFirst({
    where: { tahun_kurikulum: tahun },
  });

  return NextResponse.json({ exists: !!exists });
}
