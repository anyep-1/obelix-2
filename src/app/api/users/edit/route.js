import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
export const dynamic = "force-dynamic";

export async function PATCH(req) {
  try {
    const body = await req.json();
    const { user_id, username, password, role, nama } = body;

    if (!user_id || !username || !role || !nama) {
      return NextResponse.json(
        { message: "Semua field harus diisi" },
        { status: 400 }
      );
    }

    let updateData = { username, role, nama };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.tb_user.update({
      where: { user_id },
      data: updateData,
    });

    return NextResponse.json(
      {
        message: "User berhasil diperbarui",
        user: {
          user_id: updatedUser.user_id,
          username: updatedUser.username,
          role: updatedUser.role,
          nama: updatedUser.nama,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Gagal memperbarui user" },
      { status: 500 }
    );
  }
}
