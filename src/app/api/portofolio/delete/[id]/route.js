import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(_, { params }) {
  const id = Number(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ message: "ID tidak valid" }, { status: 400 });
  }

  try {
    const existing = await prisma.tb_portofolio.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { message: "Portofolio tidak ditemukan" },
        { status: 404 }
      );
    }

    await prisma.tb_portofolio.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Berhasil dihapus" });
  } catch (error) {
    console.error("Gagal hapus portofolio:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat menghapus portofolio" },
      { status: 500 }
    );
  }
}
