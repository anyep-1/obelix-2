import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const kurikulum_id = searchParams.get("kurikulum_id");
    const matkul_id = searchParams.get("matkul_id");

    // 1. Ambil semua matkul dari kurikulum aktif
    if (kurikulum_id && !matkul_id) {
      const matkuls = await prisma.tb_matkul.findMany({
        where: {
          kurikulum_id: parseInt(kurikulum_id),
        },
        select: {
          matkul_id: true,
          nama_matkul: true,
        },
      });
      return Response.json({ matkul: matkuls });
    }

    // 2. Ambil PLO, PI, Dosen dari matkul yang dipilih
    if (matkul_id) {
      const clos = await prisma.tb_clo.findMany({
        where: {
          matkul_id: parseInt(matkul_id),
        },
        include: {
          tb_plo: {
            select: {
              plo_id: true,
              nomor_plo: true,
            },
          },
          tb_pi: {
            select: {
              pi_id: true,
              nomor_pi: true,
              plo_id: true,
            },
          },
        },
      });

      // Unikkan PLO dan PI
      const uniquePloMap = new Map();
      const uniquePiMap = new Map();
      clos.forEach((clo) => {
        if (clo.tb_plo) uniquePloMap.set(clo.tb_plo.plo_id, clo.tb_plo);
        if (clo.tb_pi) uniquePiMap.set(clo.tb_pi.pi_id, clo.tb_pi);
      });

      // Ambil dosen pengampu berdasarkan matkul_id
      const kelasDosen = await prisma.tb_kelas_dosen.findMany({
        where: {
          matkul_id: parseInt(matkul_id),
        },
        include: {
          tb_dosen: {
            select: {
              dosen_id: true,
              nama_dosen: true,
            },
          },
        },
      });

      const uniqueDosenMap = new Map();
      kelasDosen.forEach((item) => {
        if (item.tb_dosen) {
          uniqueDosenMap.set(item.tb_dosen.dosen_id, item.tb_dosen);
        }
      });

      return Response.json({
        plo: [...uniquePloMap.values()].sort(
          (a, b) => a.nomor_plo - b.nomor_plo
        ),
        pi: [...uniquePiMap.values()].sort(
          (a, b) =>
            parseFloat(a.nomor_pi.replace(",", ".")) -
            parseFloat(b.nomor_pi.replace(",", "."))
        ),
        dosen: [...uniqueDosenMap.values()],
      });
    }

    return Response.json({ error: "Invalid parameter" }, { status: 400 });
  } catch (error) {
    console.error("API Error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
