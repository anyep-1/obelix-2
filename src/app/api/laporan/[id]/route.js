import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const id = parseInt(params.id); // pastikan ini angka

  try {
    const monev = await prisma.tb_monev.findUnique({
      where: {
        monev_id: id,
      },
      include: {
        userTujuan: {
          select: {
            user_id: true,
            nama: true,
            role: true,
          },
        },
        userPembuat: {
          select: {
            user_id: true,
            nama: true,
            role: true,
          },
        },
        matkul: {
          select: {
            matkul_id: true,
            nama_matkul: true,
          },
        },
        rtList: true,
      },
    });

    if (!monev) {
      return NextResponse.json(
        { message: "Laporan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(monev);
  } catch (error) {
    console.error("Gagal mengambil data monev:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data monev" },
      { status: 500 }
    );
  }
}
