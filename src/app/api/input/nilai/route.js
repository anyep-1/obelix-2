import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);

async function getUserFromToken() {
  const cookieStore = await cookies(); // ✅ sync
  const token = cookieStore.get("token")?.value;
  if (!token) throw new Error("Token tidak ditemukan");

  const { payload } = await jwtVerify(token, SECRET_KEY);
  return payload;
}

export async function POST(req) {
  try {
    const user = await getUserFromToken();
    const inputBy = user.email || user.username || user.id;

    const data = await req.json();
    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { error: "Data nilai tidak boleh kosong." },
        { status: 400 }
      );
    }

    // Ambil kurikulum aktif
    const kurikulum = await prisma.tb_kurikulum.findFirst({
      where: { selected: true },
    });

    if (!kurikulum) {
      return NextResponse.json(
        { error: "Kurikulum aktif tidak ditemukan." },
        { status: 400 }
      );
    }

    // Ambil semua mahasiswa, matkul, clo, dan question sekaligus
    const [allMahasiswa, allMatkul, allCLO, allQuestions] = await Promise.all([
      prisma.tb_mahasiswa.findMany({
        select: { mahasiswa_id: true, nim_mahasiswa: true },
      }),
      prisma.tb_matkul.findMany({
        select: { matkul_id: true, kode_matkul: true },
      }),
      prisma.tb_clo.findMany({
        select: { clo_id: true, nomor_clo: true, matkul_id: true },
      }),
      prisma.tb_question.findMany({
        select: { question_id: true, nama_question: true, clo_id: true },
      }),
    ]);

    const normalize = (str) =>
      typeof str === "string"
        ? str.trim().replace(/\s+/g, "").toLowerCase()
        : String(str).trim().replace(/\s+/g, "").toLowerCase();

    const mhsMap = new Map(
      allMahasiswa.map((m) => [normalize(m.nim_mahasiswa), m.mahasiswa_id])
    );

    const matkulMap = new Map(
      allMatkul.map((m) => [normalize(m.kode_matkul), m.matkul_id])
    );

    const cloMap = new Map(
      allCLO.map((c) => [`${normalize(c.nomor_clo)}-${c.matkul_id}`, c.clo_id])
    );

    const questionMap = new Map(
      allQuestions.map((q) => [
        `${normalize(q.nama_question)}-${q.clo_id}`,
        q.question_id,
      ])
    );

    const toInsert = [];
    const skipped = [];

    for (const item of data) {
      const nim = normalize(item.nim);
      const kode_matkul = normalize(item.kode_matkul);
      const clo = normalize(item.clo);
      const question = normalize(item.question);
      const nilai = item.nilai;
      const tahunAkademik = String(item.tahun_akademik || "").trim();

      const mahasiswa_id = mhsMap.get(nim);
      const matkul_id = matkulMap.get(kode_matkul);
      const cloKey = `${clo}-${matkul_id}`;
      const clo_id = cloMap.get(cloKey);
      const questionKey = `${question}-${clo_id}`;
      const question_id = questionMap.get(questionKey);

      if (!mahasiswa_id) {
        skipped.push({
          item,
          reason: `Mahasiswa NIM ${item.nim} tidak ditemukan.`,
        });
        continue;
      }

      if (!matkul_id) {
        skipped.push({
          item,
          reason: `Matkul kode ${item.kode_matkul} tidak ditemukan.`,
        });
        continue;
      }

      if (!clo_id) {
        skipped.push({
          item,
          reason: `CLO ${item.clo} untuk matkul ${item.kode_matkul} tidak ditemukan.`,
        });
        continue;
      }

      if (!question_id) {
        skipped.push({
          item,
          reason: `Question "${item.question}" untuk CLO ${item.clo} tidak ditemukan.`,
        });
        continue;
      }

      if (!tahunAkademik || typeof tahunAkademik !== "string") {
        skipped.push({
          item,
          reason: `Tahun akademik tidak ditemukan atau tidak valid.`,
        });
        continue;
      }

      if (nilai === undefined || nilai === null || isNaN(nilai)) {
        skipped.push({
          item,
          reason: `Nilai tidak valid untuk mahasiswa ${item.nim}.`,
        });
        continue;
      }

      toInsert.push({
        nilai_per_question: parseFloat(nilai),
        input_by: inputBy,
        question_id,
        mahasiswa_id,
        clo_id,
        matkul_id,
        kurikulum_id: kurikulum.kurikulum_id,
        tahun_akademik: tahunAkademik,
      });
    }

    if (toInsert.length > 0) {
      await prisma.tb_nilai.createMany({
        data: toInsert,
        skipDuplicates: true,
      });
    }

    return NextResponse.json(
      {
        message: "Data nilai berhasil diproses.",
        inserted: toInsert.length,
        skipped: skipped.length,
        skippedItems: skipped,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Gagal menyimpan nilai:", error);
    return NextResponse.json(
      {
        error: error.message || "Terjadi kesalahan saat menyimpan data nilai.",
      },
      { status: 500 }
    );
  }
}
