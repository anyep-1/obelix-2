import prisma from "@/lib/prisma";

export async function POST(req) {
  const body = await req.json();

  const aktif = await prisma.tb_kurikulum.findFirst({
    where: { selected: true },
  });

  if (!aktif) {
    return Response.json(
      { message: "Kurikulum aktif tidak ditemukan" },
      { status: 404 }
    );
  }

  const matkul = await prisma.tb_matkul.create({
    data: {
      ...body,
      kurikulum_id: aktif.kurikulum_id,
    },
  });

  return Response.json(matkul);
}
