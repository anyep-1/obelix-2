import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const kurikulumId = parseInt(searchParams.get("id"));

    if (!kurikulumId) {
      return NextResponse.json({ questions: [] }, { status: 400 });
    }

    const questions = await prisma.tb_question.findMany({
      where: {
        tb_clo: {
          tb_matkul: {
            kurikulum_id: kurikulumId,
          },
        },
      },
      include: {
        tb_clo: {
          include: {
            tb_matkul: true,
          },
        },
        tb_tools_assessment: true,
      },
    });

    const formatted = questions.map((q) => ({
      id: q.question_id,
      nama_question: q.nama_question,
      clo: q.tb_clo?.nomor_clo || "-",
      matkul: q.tb_clo?.tb_matkul?.nama_matkul || "-",
      tools: q.tb_tools_assessment?.nama_tools || "-",
    }));

    return NextResponse.json({ questions: formatted });
  } catch (err) {
    console.error("❌ Error fetching questions:", err);
    return NextResponse.json(
      { error: "Gagal mengambil data question." },
      { status: 500 }
    );
  }
}
