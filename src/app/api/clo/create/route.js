import prisma from "@/lib/prisma";

export async function POST(req) {
  const body = await req.json();
  const { nama_clo, nomor_clo, matkul_id, pi_id, plo_id } = body;

  const newClo = await prisma.tb_clo.create({
    data: {
      nama_clo,
      nomor_clo,
      matkul_id: Number(matkul_id),
      pi_id: Number(pi_id),
      plo_id: Number(plo_id),
    },
  });

  return Response.json(newClo);
}
