// /app/api/input/toolsAssessment/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const data = await req.json();

    const created = await prisma.$transaction(
      data.map((item) =>
        prisma.tb_tools_assessment.create({
          data: {
            nama_tools: item.nama_tools,
          },
        })
      )
    );

    return NextResponse.json(
      { success: true, inserted: created.length },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Gagal menyimpan data tools." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const tools = await prisma.tb_tools_assessment.findMany();
    return NextResponse.json({ tools });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Gagal mengambil data." },
      { status: 500 }
    );
  }
}
