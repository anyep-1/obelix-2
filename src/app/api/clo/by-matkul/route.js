import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const kurikulumId = Number(searchParams.get("id"));

  if (isNaN(kurikulumId)) {
    return NextResponse.json({ message: "ID tidak valid" }, { status: 400 });
  }

  try {
    const cloList = await prisma.tb_clo.findMany({
      where: {
        tb_matkul: {
          kurikulum_id: kurikulumId,
        },
      },
      orderBy: {
        nomor_clo: "asc",
      },
      include: {
        tb_pi: {
          include: {
            tb_plo: true,
          },
        },
        tb_matkul: true,
      },
    });

    return NextResponse.json(cloList);
  } catch (error) {
    console.error("Gagal ambil CLO:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data CLO" },
      { status: 500 }
    );
  }
}
