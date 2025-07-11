import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get("user_id");
  const matkul_id = searchParams.get("matkul_id");

  if (!user_id || !matkul_id) {
    return NextResponse.json(
      { message: "user_id dan matkul_id wajib" },
      { status: 400 }
    );
  }

  try {
    await prisma.tb_dosen_koor_matkul.delete({
      where: {
        user_id_matkul_id: {
          user_id: parseInt(user_id),
          matkul_id: parseInt(matkul_id),
        },
      },
    });

    return NextResponse.json({ message: "Berhasil unassign matkul" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Gagal unassign matkul." },
      { status: 500 }
    );
  }
}
