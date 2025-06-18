import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";

export async function POST(req) {
  const body = await req.json();
  const { deskripsi_pi, plo_id, nomor_pi } = body;

  const newPi = await prisma.tb_pi.create({
    data: {
      deskripsi_pi,
      nomor_pi,
      plo_id: Number(plo_id),
    },
  });

  return Response.json(newPi);
}
