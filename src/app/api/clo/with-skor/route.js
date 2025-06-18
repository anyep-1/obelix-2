import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const pi_id = parseInt(searchParams.get("pi_id"));

    if (isNaN(pi_id)) {
      return NextResponse.json(
        { message: "PI ID tidak valid." },
        { status: 400 }
      );
    }

    // Ambil CLO yang sesuai dengan PI, beserta skor CLO dan mata kuliah-nya
    const cloList = await prisma.tb_clo.findMany({
      where: {
        pi_id,
        tb_skor_clo: {
          some: {}, // hanya yang punya skor
        },
      },
      include: {
        tb_skor_clo: true,
        tb_matkul: true,
      },
    });

    return NextResponse.json(cloList);
  } catch (error) {
    console.error("❌ Gagal ambil CLO:", error);
    return NextResponse.json(
      { message: "Gagal ambil data CLO." },
      { status: 500 }
    );
  }
}
