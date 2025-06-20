import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const POST = async (req) => {
  try {
    const { template_id } = await req.json();
    if (!template_id) {
      return new Response(
        JSON.stringify({ message: "Template ID wajib diisi" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Ambil template dan CLO
    const template = await prisma.tb_template_rubrik.findUnique({
      where: { template_id: Number(template_id) },
      include: {
        tb_pi: {
          include: { tb_clo: true },
        },
      },
    });

    if (!template?.tb_pi?.tb_clo?.length) {
      return new Response(
        JSON.stringify({ message: "Template atau CLO tidak ditemukan" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const cloList = template.tb_pi.tb_clo.filter(
      (clo) => clo.matkul_id === template.matkul_id
    );

    if (!cloList.length) {
      return new Response(
        JSON.stringify({
          message: "Tidak ada CLO yang cocok dengan matkul ini",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const cloIds = cloList.map((c) => c.clo_id);

    const nilaiMahasiswa = await prisma.tb_nilai.findMany({
      where: { clo_id: { in: cloIds } },
    });

    if (!nilaiMahasiswa.length) {
      return new Response(
        JSON.stringify({ message: "Tidak ada data nilai mahasiswa" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const parsed =
      typeof template.rubrik_kategori === "string"
        ? JSON.parse(template.rubrik_kategori)
        : template.rubrik_kategori;

    const rubrik = {};
    for (const [k, v] of Object.entries(parsed)) {
      rubrik[k.toUpperCase()] = v;
    }

    const skorKategori = {
      EXEMPLARY: rubrik.EXEMPLARY,
      SATISFACTORY: rubrik.SATISFACTORY,
      DEVELOPING: rubrik.DEVELOPING,
      UNSATISFACTORY: rubrik.UNSATISFACTORY,
    };

    const results = [];

    for (const clo of cloList) {
      const subset = nilaiMahasiswa.filter((n) => n.clo_id === clo.clo_id);
      const total = subset.length;

      let totalSkor = 0;
      let exc = 0,
        sat = 0,
        dev = 0,
        uns = 0;

      subset.forEach((n) => {
        const v = n.nilai_per_question;
        if (
          v >= skorKategori.EXEMPLARY.min &&
          v <= skorKategori.EXEMPLARY.max
        ) {
          totalSkor += skorKategori.EXEMPLARY.nilai;
          exc++;
        } else if (
          v >= skorKategori.SATISFACTORY.min &&
          v <= skorKategori.SATISFACTORY.max
        ) {
          totalSkor += skorKategori.SATISFACTORY.nilai;
          sat++;
        } else if (
          v >= skorKategori.DEVELOPING.min &&
          v <= skorKategori.DEVELOPING.max
        ) {
          totalSkor += skorKategori.DEVELOPING.nilai;
          dev++;
        } else {
          totalSkor += skorKategori.UNSATISFACTORY.nilai;
          uns++;
        }
      });

      const skorAkhir = total > 0 ? totalSkor / total : 0;

      const record = await prisma.tb_skor_clo.upsert({
        where: {
          clo_id_template_id: {
            clo_id: clo.clo_id,
            template_id: Number(template_id),
          },
        },
        update: {
          skor: skorAkhir,
          jumlah_sampel: total,
          exc,
          sat,
          dev,
          uns,
        },
        create: {
          clo_id: clo.clo_id,
          skor: skorAkhir,
          jumlah_sampel: total,
          exc,
          sat,
          dev,
          uns,
          template_id: Number(template_id),
        },
      });

      results.push({
        clo_id: clo.clo_id,
        total,
        counts: { exc, sat, dev, uns },
        skor: skorAkhir,
        saved: record,
      });
    }

    return new Response(
      JSON.stringify({
        message: "Skor per CLO berhasil disimpan",
        data: results,
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error saat generate & simpan skor:", err);
    return new Response(
      JSON.stringify({ message: "Gagal generate skor", error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
