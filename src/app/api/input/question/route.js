// /app/api/input/question/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const data = await req.json();

    let inserted = 0;
    let skipped = 0;
    const skippedItems = [];

    // Ambil kurikulum aktif
    const kurikulumAktif = await prisma.tb_kurikulum.findFirst({
      where: { selected: true },
    });

    if (!kurikulumAktif) {
      return NextResponse.json(
        { error: "Kurikulum aktif tidak ditemukan." },
        { status: 400 }
      );
    }

    for (const item of data) {
      try {
        // ✅ Jika input dari form manual
        if (item.clo_id && item.tool_id) {
          await prisma.tb_question.create({
            data: {
              nama_question: item.nama_question?.trim(),
              clo_id: Number(item.clo_id),
              tool_id: Number(item.tool_id),
            },
          });
          inserted++;
          continue;
        }

        // ✅ Jika input dari file XLSX
        const namaMatkul = item.nama_matkul?.trim();
        const cloNomor = String(item.clo).trim();
        const namaTools = item.tools?.trim();

        // Cari mata kuliah berdasarkan nama dan kurikulum aktif
        const matkul = await prisma.tb_matkul.findFirst({
          where: {
            nama_matkul: namaMatkul,
            kurikulum_id: kurikulumAktif.id,
          },
        });

        if (!matkul) {
          skipped++;
          skippedItems.push({
            item,
            reason: "❌ Mata kuliah tidak ditemukan di kurikulum aktif.",
          });
          continue;
        }

        // Cari CLO berdasarkan matkul dan nomor_clo
        const clo = await prisma.tb_clo.findFirst({
          where: {
            matkul_id: matkul.matkul_id,
            nomor_clo: cloNomor,
          },
        });

        if (!clo) {
          skipped++;
          skippedItems.push({
            item,
            reason: "❌ CLO tidak ditemukan berdasarkan nomor dan matkul.",
          });
          continue;
        }

        // Cari tools assessment
        const tool = await prisma.tb_tools_assessment.findFirst({
          where: {
            nama_tools: {
              contains: namaTools,
              // bisa juga pakai "startsWith" atau "equals" tergantung kebutuhan
            },
          },
        });

        if (!tool) {
          skipped++;
          skippedItems.push({
            item,
            reason: "❌ Tools tidak ditemukan.",
          });
          continue;
        }

        await prisma.tb_question.create({
          data: {
            nama_question: item.nama_question?.trim(),
            clo_id: clo.clo_id,
            tool_id: tool.tool_id,
          },
        });

        inserted++;
      } catch (err) {
        skipped++;
        skippedItems.push({ item, reason: err.message });
      }
    }

    return NextResponse.json(
      { success: true, inserted, skipped, skippedItems },
      { status: 201 }
    );
  } catch (err) {
    console.error("❌ Error saving question:", err);
    return NextResponse.json(
      { error: "Gagal menyimpan data question." },
      { status: 500 }
    );
  }
}
