import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE() {
  try {
    await prisma.tb_selected_matkul.deleteMany(); // Hapus semua data
    return NextResponse.json({ message: "Berhasil direset" });
  } catch (error) {
    console.error("Gagal reset data:", error);
    return NextResponse.json({ error: "Gagal reset data" }, { status: 500 });
  }
}
