import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID wajib diisi!" }, { status: 400 });
    }

    // Hapus PI dari database
    await prisma.tb_pi.delete({
      where: { pi_id: parseInt(id) },
    });

    return NextResponse.json({ message: "PI berhasil dihapus." });
  } catch (error) {
    console.error("Gagal menghapus PI:", error);
    return NextResponse.json({ error: "Gagal menghapus PI." }, { status: 500 });
  }
}
