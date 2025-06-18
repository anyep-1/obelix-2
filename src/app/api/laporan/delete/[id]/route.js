import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(req, { params }) {
  const id = Number(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  try {
    // Cek apakah data monev tersedia
    const monev = await prisma.tb_monev.findUnique({
      where: { monev_id: id },
    });

    if (!monev) {
      return NextResponse.json(
        { error: "Data monev tidak ditemukan" },
        { status: 404 }
      );
    }

    // Hapus data rt terkait
    await prisma.tb_rt.deleteMany({
      where: { monev_id: id },
    });

    // Hapus data monev
    await prisma.tb_monev.delete({
      where: { monev_id: id },
    });

    return NextResponse.json({ message: "Berhasil dihapus" }, { status: 200 });
  } catch (error) {
    console.error("Gagal hapus monev:", error);
    return NextResponse.json(
      { error: "Gagal menghapus data monev" },
      { status: 500 }
    );
  }
}
