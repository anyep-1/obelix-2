// /app/api/users/by-role/route.js

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.tb_user.findMany({
      where: {
        role: {
          in: ["DosenKoor", "DosenAmpu"], // sesuai casing di database
        },
      },
      select: {
        user_id: true,
        nama: true,
        role: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Gagal mengambil user by role:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
