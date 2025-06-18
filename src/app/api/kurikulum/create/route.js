import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";

export async function POST(request) {
  const { tahun_kurikulum } = await request.json();

  if (!tahun_kurikulum) {
    return Response.json(
      { error: "Tahun kurikulum wajib diisi" },
      { status: 400 }
    );
  }

  try {
    const kurikulum = await prisma.tb_kurikulum.create({
      data: {
        tahun_kurikulum,
        selected: false, // default belum aktif
      },
    });

    return Response.json({
      message: "Kurikulum berhasil ditambahkan",
      data: kurikulum,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
