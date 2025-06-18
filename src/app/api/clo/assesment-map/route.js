import prisma from "@/lib/prisma";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const kurikulumId = parseInt(searchParams.get("id"));

  try {
    const cloData = await prisma.tb_clo.findMany({
      where: kurikulumId
        ? {
            tb_matkul: {
              kurikulum_id: kurikulumId,
            },
          }
        : undefined,
      include: {
        tb_pi: {
          include: {
            tb_plo: true,
          },
        },
        tb_matkul: true,
      },
    });

    const grouped = {};

    cloData.forEach((clo) => {
      const plo = clo.tb_pi.tb_plo;
      const pi = clo.tb_pi;
      const matkul = clo.tb_matkul;

      if (!grouped[plo.plo_id]) {
        grouped[plo.plo_id] = {
          plo_id: plo.plo_id,
          nomor_plo: plo.nomor_plo,
          pi: {},
        };
      }

      if (!grouped[plo.plo_id].pi[pi.pi_id]) {
        grouped[plo.plo_id].pi[pi.pi_id] = {
          pi_id: pi.pi_id,
          nomor_pi: pi.nomor_pi,
          matkul: [],
        };
      }

      const matkulSudahAda = grouped[plo.plo_id].pi[pi.pi_id].matkul.some(
        (m) => m.matkul_id === matkul.matkul_id
      );

      if (!matkulSudahAda) {
        grouped[plo.plo_id].pi[pi.pi_id].matkul.push({
          matkul_id: matkul.matkul_id,
          nama_matkul: matkul.nama_matkul,
        });
      }
    });

    const result = Object.values(grouped).map((plo) => ({
      plo_id: plo.plo_id,
      nomor_plo: plo.nomor_plo,
      pi: Object.values(plo.pi).map((pi) => ({
        pi_id: pi.pi_id,
        nomor_pi: pi.nomor_pi,
        matkul: pi.matkul.map((m) => ({
          matkul_id: m.matkul_id,
          nama_matkul: m.nama_matkul,
          plo_id: plo.plo_id,
        })),
      })),
    }));

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Gagal ambil assessment map:", error);
    return new Response("Gagal mengambil data", { status: 500 });
  }
}
