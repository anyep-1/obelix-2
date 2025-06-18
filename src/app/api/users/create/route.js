import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const body = await req.json();
    const { username, password, role, nama } = body;

    if (!username || !password || !role || !nama) {
      return NextResponse.json(
        { message: "Semua field harus diisi" },
        { status: 400 }
      );
    }

    // Validasi: hanya boleh ada satu Kaprodi
    if (role === "Kaprodi") {
      const existingKaprodi = await prisma.tb_user.findFirst({
        where: { role: "Kaprodi" },
      });

      if (existingKaprodi) {
        return NextResponse.json(
          { message: "Akun Kaprodi sudah ada. Tidak boleh lebih dari satu." },
          { status: 400 }
        );
      }
    }

    const existingUser = await prisma.tb_user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Username sudah digunakan" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.tb_user.create({
      data: { username, password: hashedPassword, role, nama },
    });

    return NextResponse.json(
      {
        message: "User berhasil ditambahkan",
        user: {
          user_id: newUser.user_id,
          username: newUser.username,
          role: newUser.role,
          nama: newUser.nama,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding user:", error);
    return NextResponse.json(
      { message: "Gagal menambahkan user" },
      { status: 500 }
    );
  }
}
