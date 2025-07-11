import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";

export async function POST(req) {
  const body = await req.json();
  const { user_id, matkul_id } = body;

  if (!user_id || !matkul_id) {
    return NextResponse.json(
      { message: "user_id dan matkul_id wajib" },
      { status: 400 }
    );
  }

  try {
    await prisma.tb_dosen_koor_matkul.create({
      data: {
        user_id: parseInt(user_id),
        matkul_id: parseInt(matkul_id),
      },
    });

    return NextResponse.json({ message: "Berhasil assign matkul" });
  } catch (err) {
    if (err.code === "P2002") {
      return NextResponse.json(
        { message: "Sudah diassign sebelumnya." },
        { status: 409 }
      );
    }
    console.error(err);
    return NextResponse.json(
      { message: "Gagal assign matkul." },
      { status: 500 }
    );
  }
}
