import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const data = await req.json();

    // Ambil kurikulum aktif
    const kurikulumAktif = await prisma.tb_kurikulum.findFirst({
      where: { selected: true },
    });

    if (!kurikulumAktif) {
      return NextResponse.json(
        { error: "Kurikulum aktif tidak ditemukan." },
        { status: 400 }
      );
    }

    const created = await prisma.$transaction(
      data.map((item) =>
        prisma.tb_kelas.create({
          data: {
            kode_kelas: item.kode_kelas,
            kurikulum_id: kurikulumAktif.kurikulum_id, // kaitkan otomatis
          },
        })
      )
    );

    return NextResponse.json(
      { success: true, inserted: created.length },
      { status: 201 }
    );
  } catch (err) {
    console.error("❌ Gagal input kelas:", err);
    return NextResponse.json(
      { error: "Gagal menyimpan data kelas." },
      { status: 500 }
    );
  }
}
