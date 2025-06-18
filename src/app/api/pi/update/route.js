import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req) {
  try {
    const body = await req.json();
    const { pi_id, nomor_pi, deskripsi_pi } = body;

    if (!pi_id || !nomor_pi || !deskripsi_pi) {
      return NextResponse.json(
        { error: "Data tidak lengkap." },
        { status: 400 }
      );
    }

    // Update PI di database
    await prisma.tb_pi.update({
      where: { pi_id: parseInt(pi_id) },
      data: {
        nomor_pi,
        deskripsi_pi,
      },
    });

    return NextResponse.json({ message: "PI berhasil diupdate." });
  } catch (error) {
    console.error("Gagal update PI:", error);
    return NextResponse.json({ error: "Gagal update PI." }, { status: 500 });
  }
}
