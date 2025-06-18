// src/app/api/dashboard/skor/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const kurikulum = await prisma.tb_kurikulum.findFirst({
      where: { selected: true },
    });

    if (!kurikulum) {
      return NextResponse.json(
        { error: "Kurikulum aktif tidak ditemukan" },
        { status: 400 }
      );
    }

    const plos = await prisma.tb_plo.findMany({
      where: {
        kurikulum_id: kurikulum.kurikulum_id,
      },
      include: {
        tb_skor_plo: true,
      },
    });

    // Filter hanya yang punya nomor_plo, lalu urutkan berdasar parseInt(nomor_plo)
    const sortedPlos = plos
      .filter((p) => p.nomor_plo !== null)
      .sort(
        (a, b) => parseInt(a.nomor_plo || "0") - parseInt(b.nomor_plo || "0")
      );

    const labels = sortedPlos.map((p) => `PLO ${p.nomor_plo}`);
    const dataGrafik = sortedPlos.map((p) => p.tb_skor_plo?.skor || 0);
    const total = dataGrafik.reduce((a, b) => a + b, 0);
    const rataRata = dataGrafik.length ? total / dataGrafik.length : 0;

    return NextResponse.json({
      labels,
      dataGrafik,
      rataRata: parseFloat(rataRata.toFixed(2)),
    });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json(
      { error: "Gagal mengambil skor PLO" },
      { status: 500 }
    );
  }
}
