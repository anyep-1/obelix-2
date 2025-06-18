import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = Number(searchParams.get("user_id"));

    if (!user_id) {
      return NextResponse.json(
        { message: "User ID tidak ditemukan" },
        { status: 400 }
      );
    }

    await prisma.tb_user.delete({
      where: { user_id },
    });

    return NextResponse.json({ message: "User berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "Gagal menghapus user" },
      { status: 500 }
    );
  }
}
