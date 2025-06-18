import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";

// GET nilai minimum setting
export async function GET() {
  try {
    let setting = await prisma.tb_nilai_minimum.findFirst();

    // Jika tidak ada, buat default
    if (!setting) {
      setting = await prisma.tb_nilai_minimum.create({
        data: { nilai_minimum: 3 },
      });
    }

    return NextResponse.json({ nilai_minimum: setting.nilai_minimum });
  } catch (error) {
    console.error("Gagal ambil nilai minimum:", error);
    return NextResponse.json(
      { error: "Gagal mengambil nilai minimum" },
      { status: 500 }
    );
  }
}

// PUT untuk update nilai minimum
export async function PUT(req) {
  try {
    const { nilai_minimum } = await req.json();

    const existing = await prisma.tb_setting.findFirst();

    if (existing) {
      await prisma.tb_setting.update({
        where: { id: existing.id },
        data: { nilai_minimum },
      });
    } else {
      await prisma.tb_setting.create({
        data: { nilai_minimum },
      });
    }

    return NextResponse.json({ message: "Berhasil update nilai minimum" });
  } catch (error) {
    console.error("Gagal update nilai minimum:", error);
    return NextResponse.json(
      { error: "Gagal update nilai minimum" },
      { status: 500 }
    );
  }
}
