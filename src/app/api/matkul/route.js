// src/app/api/matkul/route.js
import prisma from "@/lib/prisma";

export async function GET() {
  const data = await prisma.tb_matkul.findMany({
    include: {
      tb_kurikulum: true,
    },
    orderBy: {
      matkul_id: "asc",
    },
  });

  return Response.json(data);
}

export async function POST(req) {
  const body = await req.json();
  const {
    nama_matkul,
    kode_matkul,
    jumlah_sks,
    tingkat,
    semester,
    kurikulum_id,
  } = body;

  const created = await prisma.tb_matkul.create({
    data: {
      nama_matkul,
      kode_matkul,
      jumlah_sks: Number(jumlah_sks),
      tingkat,
      semester,
      kurikulum_id: Number(kurikulum_id),
    },
  });

  return Response.json(created);
}
