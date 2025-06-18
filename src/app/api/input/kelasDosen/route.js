import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const body = await req.json();

    if (!Array.isArray(body)) {
      return new Response("Format data tidak valid.", { status: 400 });
    }

    // Ambil kurikulum aktif
    const kurikulum = await prisma.tb_kurikulum.findFirst({
      where: { selected: true },
    });

    if (!kurikulum) {
      return new Response("Kurikulum aktif tidak ditemukan.", { status: 400 });
    }

    // Ambil semua dosen dan matkul dari kurikulum aktif
    const [semuaDosen, semuaMatkul] = await Promise.all([
      prisma.tb_dosen.findMany(),
      prisma.tb_matkul.findMany({
        where: { kurikulum_id: kurikulum.kurikulum_id },
      }),
    ]);

    const dosenMap = new Map(semuaDosen.map((d) => [d.nama_dosen, d.dosen_id]));
    const matkulMap = new Map(
      semuaMatkul.map((m) => [m.nama_matkul, m.matkul_id])
    );

    const dataSiapSimpan = [];
    const kombinasiSet = new Set();

    for (const item of body) {
      const tahun = String(item.tahun_akademik);
      const kelas = item.kelas;
      const nama_dosen = item.nama_dosen;
      const nama_matkul = item.nama_matkul;

      const dosen_id = dosenMap.get(nama_dosen);
      const matkul_id = matkulMap.get(nama_matkul);

      // Jika tidak ditemukan di database atau tidak termasuk kurikulum aktif
      if (!dosen_id || !matkul_id) continue;

      const key = `${tahun}-${kelas}-${dosen_id}-${matkul_id}`;
      if (kombinasiSet.has(key)) continue; // hindari duplikat dalam input
      kombinasiSet.add(key);

      // Cek apakah sudah ada di database
      const existing = await prisma.tb_kelas_dosen.findFirst({
        where: {
          tahun_akademik: tahun,
          kelas,
          dosen_id,
          matkul_id,
        },
      });

      if (!existing) {
        dataSiapSimpan.push({
          tahun_akademik: tahun,
          kelas,
          dosen_id,
          matkul_id,
        });
      }
    }

    if (dataSiapSimpan.length === 0) {
      return new Response("Tidak ada data baru yang disimpan.", {
        status: 400,
      });
    }

    // Simpan sekaligus
    await prisma.tb_kelas_dosen.createMany({
      data: dataSiapSimpan,
      skipDuplicates: true, // jaga-jaga kalau masih ada yang lolos
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: `${dataSiapSimpan.length} kelas dosen berhasil disimpan.`,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Gagal simpan data kelas dosen:", error);
    return new Response("Terjadi kesalahan pada server.", { status: 500 });
  }
}
