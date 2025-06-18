import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const kurikulumAktif = await prisma.tb_kurikulum.findFirst({
      where: { selected: true },
      select: { kurikulum_id: true },
    });

    if (!kurikulumAktif) {
      return NextResponse.json(
        { message: "Kurikulum aktif tidak ditemukan" },
        { status: 404 }
      );
    }

    const monevList = await prisma.tb_monev.findMany({
      where: {
        matkul: {
          kurikulum_id: kurikulumAktif.kurikulum_id,
        },
      },
      include: {
        matkul: {
          select: {
            matkul_id: true,
            nama_matkul: true,
            kurikulum_id: true,
          },
        },
        userTujuan: {
          select: {
            user_id: true,
            nama: true,
          },
        },
        rtList: {
          select: {
            statusImplementasi: true,
          },
        },
      },
      orderBy: {
        tanggalMonev: "desc",
      },
    });

    return NextResponse.json(monevList, { status: 200 });
  } catch (error) {
    console.error("Gagal mengambil mata kuliah dengan data monev:", error);
    return NextResponse.json(
      { message: "Gagal mengambil mata kuliah" },
      { status: 500 }
    );
  }
}
