import prisma from "@/lib/prisma";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const kurikulumId = parseInt(searchParams.get("id"));

  if (!kurikulumId || isNaN(kurikulumId)) {
    return new Response("Kurikulum ID tidak valid", { status: 400 });
  }

  try {
    const data = await prisma.tb_selected_matkul.findMany({
      where: {
        selected: true,
        tb_matkul: {
          kurikulum_id: kurikulumId,
        },
      },
      include: {
        tb_matkul: {
          include: {
            tb_clo: {
              include: {
                tb_pi: true,
                tb_plo: true,
              },
            },
          },
        },
        tb_plo: true,
      },
    });

    const grouped = {};

    data.forEach((item) => {
      const plo = item.tb_plo;
      if (!plo) return;

      if (!grouped[plo.plo_id]) {
        grouped[plo.plo_id] = {
          plo_id: plo.plo_id,
          nomor_plo: plo.nomor_plo || "-",
          nama_plo: plo.nama_plo || "-",
          matkul: [],
        };
      }

      grouped[plo.plo_id].matkul.push({
        id: item.tb_matkul.matkul_id,
        nama: item.tb_matkul.nama_matkul,
        tingkat: item.tb_matkul.tingkat,
        semester: item.tb_matkul.semester,
        clo: item.tb_matkul.tb_clo.map((clo) => ({
          id: clo.clo_id,
          nama: clo.nama_clo,
          pi: {
            id: clo.tb_pi.pi_id,
            nomor: clo.tb_pi.nomor_pi,
            deskripsi: clo.tb_pi.deskripsi_pi,
            plo_id: clo.tb_pi.plo_id,
          },
          plo: {
            id: clo.tb_plo.plo_id,
          },
        })),
      });
    });

    return Response.json({ data: Object.values(grouped) });
  } catch (error) {
    console.error("Gagal ambil hasil selected matkul:", error);
    return new Response("Gagal mengambil data", { status: 500 });
  }
}
