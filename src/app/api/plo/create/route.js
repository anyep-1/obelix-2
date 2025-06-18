import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const { kode_plo, deskripsi_plo, profilLulusanIds } = await req.json();

    // 1. Ambil kurikulum aktif
    const kurikulum = await prisma.tb_kurikulum.findFirst({
      where: { selected: true },
    });

    if (!kurikulum) {
      return Response.json(
        { error: "Tidak ada kurikulum aktif" },
        { status: 400 }
      );
    }

    // 2. Validasi array
    if (!Array.isArray(profilLulusanIds)) {
      return Response.json(
        { error: "Data profilLulusanIds harus berupa array" },
        { status: 400 }
      );
    }

    // 3. Ubah semua ke number & filter ID tidak valid
    const validProfilIds = profilLulusanIds
      .map(Number)
      .filter((id) => !isNaN(id));

    // 4. Cek apakah semua profil_id benar-benar ada di database
    const existingIds = await prisma.tb_profillulusan.findMany({
      where: { profil_id: { in: validProfilIds } },
      select: { profil_id: true },
    });

    const existingIdValues = existingIds.map((item) => item.profil_id);
    const invalidIds = validProfilIds.filter(
      (id) => !existingIdValues.includes(id)
    );

    if (invalidIds.length > 0) {
      return Response.json(
        {
          error: `profil_id berikut tidak ditemukan: ${invalidIds.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // 5. Buat data PLO
    const newPlo = await prisma.tb_plo.create({
      data: {
        nomor_plo: kode_plo,
        nama_plo: deskripsi_plo,
        kurikulum_id: kurikulum.kurikulum_id,
        tb_plo_profil: {
          create: validProfilIds.map((profilId) => ({
            profil_id: profilId,
          })),
        },
      },
      include: { tb_plo_profil: true },
    });

    return Response.json(newPlo);
  } catch (error) {
    console.error("Gagal membuat PLO:", error);
    return Response.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
