import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();

    if (!Array.isArray(body)) {
      return new Response(
        JSON.stringify({ message: "Format data tidak valid" }),
        { status: 400 }
      );
    }

    // Ambil kurikulum aktif
    const kurikulum = await prisma.tb_kurikulum.findFirst({
      where: { selected: true },
    });

    if (!kurikulum) {
      return new Response(
        JSON.stringify({ message: "Kurikulum aktif tidak ditemukan." }),
        { status: 400 }
      );
    }

    // Filter hanya data yang memiliki nama_dosen dan kode_dosen
    const validData = body.filter((d) => d.nama_dosen && d.kode_dosen);

    if (validData.length === 0) {
      return new Response(
        JSON.stringify({ message: "Tidak ada data dosen yang valid." }),
        { status: 400 }
      );
    }

    // Cek duplikat nama di dalam input
    const namaSet = new Set();
    const duplicateNamaInInput = validData.some((d) => {
      if (namaSet.has(d.nama_dosen)) return true;
      namaSet.add(d.nama_dosen);
      return false;
    });

    if (duplicateNamaInInput) {
      return new Response(
        JSON.stringify({
          message: "Terdapat nama dosen duplikat dalam data input.",
        }),
        { status: 400 }
      );
    }

    // Cek nama dosen yang sudah ada di database
    const existing = await prisma.tb_dosen.findMany({
      where: {
        nama_dosen: {
          in: validData.map((d) => d.nama_dosen),
        },
      },
      select: {
        nama_dosen: true,
      },
    });

    const existingNama = new Set(existing.map((e) => e.nama_dosen));
    const filtered = validData.filter((d) => !existingNama.has(d.nama_dosen));

    if (filtered.length === 0) {
      return new Response(
        JSON.stringify({ message: "Semua nama dosen sudah ada di database." }),
        { status: 400 }
      );
    }

    // Simpan data
    const result = await prisma.tb_dosen.createMany({
      data: filtered.map((d) => ({
        nama_dosen: d.nama_dosen,
        kode_dosen: d.kode_dosen,
        kurikulum_id: kurikulum.kurikulum_id,
      })),
      skipDuplicates: true,
    });

    return new Response(
      JSON.stringify({
        message: `${result.count} dosen berhasil ditambahkan.`,
        success: true,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Gagal menyimpan data dosen:", error);
    return new Response(
      JSON.stringify({ message: "Terjadi kesalahan server" }),
      { status: 500 }
    );
  }
}
