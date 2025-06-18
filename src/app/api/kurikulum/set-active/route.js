import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";

export async function PATCH(req) {
  const { kurikulum_id } = await req.json();

  // Reset semua jadi false
  await prisma.tb_kurikulum.updateMany({
    data: { selected: false },
  });

  // Set yang dipilih jadi true
  const updated = await prisma.tb_kurikulum.update({
    where: { kurikulum_id },
    data: { selected: true },
  });

  return Response.json(updated);
}
