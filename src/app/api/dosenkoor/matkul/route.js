import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get("user_id");

  if (!user_id) {
    return NextResponse.json({ message: "user_id wajib" }, { status: 400 });
  }

  try {
    const data = await prisma.tb_dosen_koor_matkul.findMany({
      where: { user_id: parseInt(user_id) },
      select: { matkul_id: true },
    });

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Gagal mengambil data matkul." },
      { status: 500 }
    );
  }
}
