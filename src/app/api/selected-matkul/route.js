import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";

export async function POST(req) {
  const body = await req.json();
  const { matkul_id, plo_id, selected } = body; // abaikan pi_id di backend

  try {
    const existing = await prisma.tb_selected_matkul.findFirst({
      where: {
        matkul_id,
        plo_id,
      },
    });

    if (selected) {
      if (existing) {
        // update selected = true kalau sudah ada
        await prisma.tb_selected_matkul.update({
          where: { id: existing.id },
          data: { selected: true },
        });
      } else {
        // buat baru
        await prisma.tb_selected_matkul.create({
          data: {
            matkul_id,
            plo_id,
            selected: true,
          },
        });
      }
    } else {
      if (existing) {
        // hapus jika uncheck
        await prisma.tb_selected_matkul.delete({
          where: { id: existing.id },
        });
      }
    }

    return NextResponse.json({ message: "Berhasil disimpan" });
  } catch (error) {
    console.error("Gagal simpan selected:", error);
    return NextResponse.json({ error: "Gagal simpan" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const selected = await prisma.tb_selected_matkul.findMany();
    return NextResponse.json(selected);
  } catch (error) {
    console.error("Gagal ambil data:", error);
    return NextResponse.json({ error: "Gagal ambil data" }, { status: 500 });
  }
}
