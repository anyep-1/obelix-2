// src/app/api/dashboard/evaluasi/route.js
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

    const monevList = await prisma.tb_monev.findMany({
      where: {
        matkul: {
          kurikulum_id: kurikulum.kurikulum_id,
        },
      },
      include: {
        matkul: true,
        rtList: true,
      },
      orderBy: {
        tanggalMonev: "desc",
      },
    });

    let totalValidasi = 0;
    let totalPending = 0;

    for (const monev of monevList) {
      const statusSet = new Set(
        monev.rtList.map((rt) => rt.statusImplementasi)
      );
      if (statusSet.has("Sudah")) {
        totalValidasi += 1;
      } else if (statusSet.has("Dalam proses")) {
        totalPending += 1;
      }
    }

    const evaluasiTerbaru = monevList.slice(0, 5).map((item) => ({
      id: item.monev_id,
      matkul: item.matkul.nama_matkul,
      tanggal: item.tanggalMonev,
    }));

    return NextResponse.json({
      totalValidasi,
      totalPending,
      evaluasiTerbaru,
    });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json(
      { error: "Gagal mengambil data evaluasi" },
      { status: 500 }
    );
  }
}
