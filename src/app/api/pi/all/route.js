import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Ambil kurikulum aktif
    const kurikulumAktif = await prisma.tb_kurikulum.findFirst({
      where: { selected: true },
    });

    if (!kurikulumAktif) {
      return Response.json(
        { data: [], message: "Kurikulum aktif tidak ditemukan." },
        { status: 404 }
      );
    }

    // Ambil semua PI yang terkait dengan PLO dari kurikulum aktif
    const data = await prisma.tb_pi.findMany({
      where: {
        tb_plo: {
          kurikulum_id: kurikulumAktif.kurikulum_id,
        },
      },
      include: {
        tb_plo: true,
        tb_skor_pi: true,
      },
      orderBy: {
        pi_id: "asc",
      },
    });

    return Response.json(data);
  } catch (err) {
    console.error("❌ Gagal ambil data PI:", err);
    return Response.json({ error: "Gagal ambil data PI." }, { status: 500 });
  }
}
