import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const roleFilter = searchParams.get("role");

    let users;

    if (roleFilter === "tujuan") {
      users = await prisma.tb_user.findMany({
        where: {
          role: {
            in: ["DosenKoor", "DosenAmpu"],
          },
        },
        select: { user_id: true, nama: true },
      });
    } else {
      users = await prisma.tb_user.findMany({
        select: { user_id: true, username: true, role: true, nama: true },
      });
    }

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data pengguna" },
      { status: 500 }
    );
  }
}
