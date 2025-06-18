import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";

export async function GET() {
  const result = await prisma.tb_kurikulum.findMany({
    orderBy: { kurikulum_id: "desc" },
  });
  return Response.json(result);
}
