"use client";

import { useEffect, useState } from "react";
import apiService from "@/app/services/apiServices";

const SkorPage = () => {
  const [activeTab, setActiveTab] = useState("pi");
  const isPIPage = activeTab === "pi";

  const [kurikulumId, setKurikulumId] = useState(null);
  const [piList, setPiList] = useState([]);
  const [ploList, setPloList] = useState([]);
  const [selectedPiId, setSelectedPiId] = useState(null);
  const [selectedPloId, setSelectedPloId] = useState(null);
  const [weights, setWeights] = useState({});
  const [matkulList, setMatkulList] = useState([]);
  const [piHasScore, setPiHasScore] = useState(false);
  const [ploHasScore, setPloHasScore] = useState(false);
  const [ploReady, setPloReady] = useState(false);
  const [missingScoreWarning, setMissingScoreWarning] = useState(false);

  useEffect(() => {
    apiService.get("/kurikulum/active").then((res) => {
      if (res?.kurikulum_id) {
        setKurikulumId(res.kurikulum_id);
      }
    });
  }, []);

  useEffect(() => {
    if (!kurikulumId) return;
    apiService.get("/pi/all").then(setPiList);
    apiService.get("/plo/by-kurikulum", { id: kurikulumId }).then(setPloList);
  }, [kurikulumId]);

  useEffect(() => {
    if (!selectedPiId) {
      setMatkulList([]);
      setWeights({});
      return;
    }

    apiService.get("/clo/with-skor", { pi_id: selectedPiId }).then((data) => {
      const withScore = data.filter(
        (c) => Array.isArray(c.tb_skor_clo) && c.tb_skor_clo.length > 0
      );
      const uniq = new Map();
      withScore.forEach((c) => {
        const skor = c.tb_skor_clo[0].skor;
        uniq.set(c.matkul_id, {
          matkul_id: c.matkul_id,
          nama: c.tb_matkul.nama_matkul,
          skor,
        });
      });
      const list = Array.from(uniq.values());
      setMatkulList(list);
      const w = {};
      list.forEach((m) => (w[m.matkul_id] = ""));
      setWeights(w);
    });

    apiService.get("/skor/check", { pi_id: selectedPiId }).then((d) => {
      setPiHasScore(d.hasScore);
    });
  }, [selectedPiId]);

  useEffect(() => {
    if (!selectedPloId) {
      setMatkulList([]);
      setWeights({});
      setMissingScoreWarning(false);
      return;
    }

    apiService.get("/pi/by-plo", { id: selectedPloId }).then((data) => {
      const piWithSkor = data.filter(
        (pi) => pi.tb_skor_pi && pi.tb_skor_pi.skor != null
      );

      // mapping langsung ke format matkulList
      const piMapped = piWithSkor.map((pi) => ({
        pi_id: pi.pi_id,
        nomor_pi: pi.nomor_pi,
        skor: pi.tb_skor_pi?.skor || 0,
      }));
      setMatkulList(piMapped);

      const initialWeights = {};
      piMapped.forEach((pi) => {
        initialWeights[pi.pi_id] = "";
      });
      setWeights(initialWeights);

      const allPiHasScore =
        data.length > 0 && data.length === piWithSkor.length;
      setPloReady(allPiHasScore);
      setMissingScoreWarning(!allPiHasScore && piWithSkor.length > 0);
    });

    apiService.get("/skor/check", { plo_id: selectedPloId }).then((d) => {
      setPloHasScore(d.hasScore);
    });
  }, [selectedPloId, kurikulumId]);

  const handleWeightChange = (id, val) => {
    if (val === "") return setWeights((w) => ({ ...w, [id]: "" }));
    const v = parseFloat(val);
    if (isNaN(v) || v < 0 || v > 1) return;
    setWeights((w) => ({ ...w, [id]: v }));
  };

  const totalWeight = Object.values(weights)
    .reduce((a, b) => a + (parseFloat(b) || 0), 0)
    .toFixed(2);

  const score = matkulList
    .reduce((sum, m) => {
      const skor = m.skor || 0;
      const w = parseFloat(weights[m.matkul_id || m.pi_id]) || 0;
      return sum + skor * w;
    }, 0)
    .toFixed(2);

  const handleSave = async () => {
    const payload = isPIPage
      ? { pi_id: selectedPiId, skor: parseFloat(score) }
      : { plo_id: selectedPloId, skor: parseFloat(score) };

    const url = isPIPage ? "/skor/pi" : "/skor/plo";
    try {
      await apiService.post(url, payload);
      alert("Skor berhasil disimpan.");
      isPIPage ? setPiHasScore(true) : setPloHasScore(true);
    } catch (e) {
      alert("Gagal menyimpan skor.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow">
      <div className="flex space-x-8 border-b mb-6 text-gray-600 font-medium">
        <button
          onClick={() => {
            setActiveTab("pi");
            setSelectedPloId(null);
            setMatkulList([]);
          }}
          className={`pb-2 ${
            isPIPage
              ? "border-b-2 border-teal-600 text-teal-700"
              : "hover:text-teal-600"
          }`}
        >
          Generate Skor PI
        </button>
        <button
          onClick={() => {
            setActiveTab("plo");
            setSelectedPiId(null);
            setMatkulList([]);
          }}
          className={`pb-2 ${
            !isPIPage
              ? "border-b-2 border-teal-600 text-teal-700"
              : "hover:text-teal-600"
          }`}
        >
          Generate Skor PLO
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        {isPIPage ? "Generate Skor PI" : "Generate Skor PLO"}
      </h1>

      <div className="mb-6">
        <label className="block font-medium mb-2">
          {isPIPage ? "Pilih PI" : "Pilih PLO"}
        </label>
        <select
          className="w-full border p-2 rounded"
          value={isPIPage ? selectedPiId || "" : selectedPloId || ""}
          onChange={(e) => {
            const val = e.target.value ? parseInt(e.target.value) : null;
            isPIPage ? setSelectedPiId(val) : setSelectedPloId(val);
          }}
        >
          <option value="">-- Pilih --</option>
          {(isPIPage ? piList : ploList).map((item) => (
            <option
              key={item[isPIPage ? "pi_id" : "plo_id"]}
              value={item[isPIPage ? "pi_id" : "plo_id"]}
            >
              {isPIPage ? `PI ${item.nomor_pi}` : `PLO ${item.nomor_plo}`}
            </option>
          ))}
        </select>
      </div>

      {(isPIPage ? selectedPiId : selectedPloId) && (
        <p
          className={`mb-4 font-semibold ${
            (isPIPage ? piHasScore : ploHasScore)
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {(isPIPage ? piHasScore : ploHasScore)
            ? `${isPIPage ? "PI" : "PLO"} ini sudah memiliki skor.`
            : `${isPIPage ? "PI" : "PLO"} ini belum memiliki skor.`}
        </p>
      )}

      {!isPIPage && missingScoreWarning && (
        <p className="mb-4 text-yellow-600 font-medium">
          Beberapa PI dalam PLO ini belum memiliki skor. Skor PLO tidak dapat
          disimpan sampai semua PI memiliki skor.
        </p>
      )}

      {matkulList.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Atur Bobot (0 – 1)
          </h2>
          <div className="space-y-3">
            {matkulList.map((m) => (
              <div
                key={m.matkul_id || m.pi_id}
                className="flex justify-between items-center border p-3 rounded"
              >
                <div className="font-medium text-gray-800">
                  {isPIPage ? m.nama : `PI ${m.nomor_pi}`}
                </div>
                <div className="flex flex-col items-start">
                  <label className="text-sm text-gray-600 mb-1">Bobot</label>
                  <input
                    type="number"
                    min={0}
                    max={1}
                    step={0.01}
                    value={weights[m.matkul_id || m.pi_id] ?? ""}
                    onChange={(e) =>
                      handleWeightChange(m.matkul_id || m.pi_id, e.target.value)
                    }
                    placeholder="0.0"
                    className="border rounded p-2 w-24"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-sm font-medium text-gray-700">
            <div>
              Total Bobot:{" "}
              <span
                className={
                  totalWeight == 1.0 ? "text-green-600" : "text-red-600"
                }
              >
                {totalWeight}
              </span>{" "}
              (target: 1.00)
            </div>
            <div className="text-lg mt-2">
              Skor: <span className="font-bold text-teal-600">{score}</span>
            </div>
          </div>
        </>
      )}

      <div className="mt-8">
        <button
          onClick={handleSave}
          disabled={
            !(isPIPage ? selectedPiId : selectedPloId) ||
            parseFloat(score) === 0 ||
            (!isPIPage && !ploReady)
          }
          className={`w-full px-6 py-3 rounded-md text-lg font-semibold transition-colors duration-300 ${
            !(isPIPage ? selectedPiId : selectedPloId) ||
            parseFloat(score) === 0 ||
            (!isPIPage && !ploReady)
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-teal-600 text-white hover:bg-teal-700"
          }`}
        >
          Simpan Skor
        </button>
      </div>
    </div>
  );
};

export default SkorPage;
