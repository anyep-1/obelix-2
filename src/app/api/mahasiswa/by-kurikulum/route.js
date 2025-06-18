import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const kurikulum = await prisma.tb_kurikulum.findFirst({
      where: { selected: true },
    });

    if (!kurikulum) {
      return NextResponse.json({ mahasiswa: [] });
    }

    // Ambil mahasiswa yang kelasnya termasuk dalam kurikulum aktif
    const data = await prisma.tb_mahasiswa.findMany({
      where: {
        tb_kelas: {
          kurikulum_id: kurikulum.kurikulum_id,
        },
      },
      include: {
        tb_kelas: {
          select: {
            kode_kelas: true,
          },
        },
      },
    });

    // Format data supaya tetap menyertakan kode_kelas secara langsung
    const formatted = data.map((mhs) => ({
      mahasiswa_id: mhs.mahasiswa_id, // tambahkan ini
      nama_mahasiswa: mhs.nama_mahasiswa,
      nim_mahasiswa: mhs.nim_mahasiswa,
      tb_kelas: mhs.tb_kelas,
    }));

    return NextResponse.json({ mahasiswa: formatted });
  } catch (err) {
    console.error("❌ Gagal mengambil mahasiswa:", err);
    return NextResponse.json(
      { error: "Gagal mengambil data mahasiswa." },
      { status: 500 }
    );
  }
}
