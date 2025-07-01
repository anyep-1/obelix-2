"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  BookOpenCheck,
  BarChart3,
  RefreshCw,
  Settings,
} from "lucide-react";

const Sidebar = ({ visible, role }) => {
  const [openPlan, setOpenPlan] = useState(false);
  const [openAssessmentPlan, setOpenAssessmentPlan] = useState(false);
  const [openSettingData, setOpenSettingData] = useState(false);
  const [openData, setOpenData] = useState(false);
  const [openServices, setOpenServices] = useState(false);
  const [openDo, setOpenDo] = useState(false);
  const [openRubrik, setOpenRubrik] = useState(false);
  const [openPortofolio, setOpenPortofolio] = useState(false);
  const [openCheck, setOpenCheck] = useState(false);
  const [openAct, setOpenAct] = useState(false);

  const router = useRouter();

  const menuButtonClass =
    "block w-full text-left px-2 py-2 text-gray-700 rounded hover:bg-gray-100";

  const goTo = (path) => {
    router.push(path);
  };

  return (
    <div
      className={`bg-white text-gray-900 h-screen fixed top-0 left-0 z-50 transition-transform duration-300 w-64 border-r shadow-md ${
        visible ? "translate-x-0" : "-translate-x-full"
      } flex flex-col`}
    >
      <div className="p-4 text-2xl font-bold border-b border-gray-200">
        My System
      </div>
      <nav className="flex-1 p-4 overflow-y-auto">
        <button
          onClick={() => goTo("/dashboard/dashboard")}
          className={`${menuButtonClass} flex items-center gap-2 font-semibold`}
        >
          <LayoutDashboard size={18} />
          Dashboard
        </button>

        {/* PLAN */}
        <div className="mt-4 mb-2">
          <button
            onClick={() => setOpenPlan(!openPlan)}
            className="w-full flex justify-between items-center px-2 py-2 hover:bg-gray-100 text-left text-gray-900 font-semibold rounded"
          >
            <span className="flex items-center gap-2">
              <LayoutDashboard size={18} />
              Plan
            </span>
            {openPlan ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {openPlan && (
            <div className="ml-6 mt-2 space-y-1">
              <button
                onClick={() => goTo("/dashboard/kurikulum")}
                className={menuButtonClass}
              >
                Tahun Kurikulum
              </button>
              <button
                onClick={() => goTo("/dashboard/profil-lulusan")}
                className={menuButtonClass}
              >
                Profil Lulusan
              </button>
              <button
                onClick={() => goTo("/dashboard/plo")}
                className={menuButtonClass}
              >
                PLO
              </button>
              <button
                onClick={() => goTo("/dashboard/pi")}
                className={menuButtonClass}
              >
                PI
              </button>
              <button
                onClick={() => goTo("/dashboard/matkul")}
                className={menuButtonClass}
              >
                Mata Kuliah
              </button>
              <button
                onClick={() => goTo("/dashboard/clo")}
                className={menuButtonClass}
              >
                CLO
              </button>

              {/* Assessment Plan */}
              <div>
                <button
                  onClick={() => setOpenAssessmentPlan(!openAssessmentPlan)}
                  className={`${menuButtonClass} flex justify-between items-center`}
                >
                  <span>Assessment Plan</span>
                  {openAssessmentPlan ? (
                    <ChevronUp size={14} />
                  ) : (
                    <ChevronDown size={14} />
                  )}
                </button>
                {openAssessmentPlan && (
                  <div className="ml-4 mt-1 space-y-1">
                    {role === "Kaprodi" && (
                      <button
                        onClick={() => goTo("/dashboard/assesment/set")}
                        className={menuButtonClass}
                      >
                        Set
                      </button>
                    )}
                    <button
                      onClick={() => goTo("/dashboard/assesment/hasil")}
                      className={menuButtonClass}
                    >
                      Assessment Plan
                    </button>
                  </div>
                )}
              </div>

              {/* Setting Data */}
              {(role === "Kaprodi" ||
                role === "DosenAmpu" ||
                role === "DosenKoor") && (
                <div>
                  <button
                    onClick={() => setOpenSettingData(!openSettingData)}
                    className={`${menuButtonClass} flex justify-between items-center`}
                  >
                    <span>Setting Data</span>
                    {openSettingData ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    )}
                  </button>
                  {openSettingData && (
                    <div className="ml-4 mt-1 space-y-1">
                      {role === "Kaprodi" && (
                        <>
                          <button
                            onClick={() => goTo("/dashboard/setting/dosen")}
                            className={menuButtonClass}
                          >
                            Setting Data Dosen & Kelas
                          </button>
                          <button
                            onClick={() =>
                              goTo("/dashboard/setting/toolsAssesment")
                            }
                            className={menuButtonClass}
                          >
                            Setting Tools Assessment
                          </button>
                        </>
                      )}
                      {(role === "DosenAmpu" || role === "DosenKoor") && (
                        <button
                          onClick={() => goTo("/dashboard/setting/mahasiswa")}
                          className={menuButtonClass}
                        >
                          Setting Data Kelas & Mahasiswa
                        </button>
                      )}
                      {role === "DosenKoor" && (
                        <button
                          onClick={() => goTo("/dashboard/setting/question")}
                          className={menuButtonClass}
                        >
                          Setting Question
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Data */}
              <div>
                <button
                  onClick={() => setOpenData(!openData)}
                  className={`${menuButtonClass} flex justify-between items-center`}
                >
                  <span>Data</span>
                  {openData ? (
                    <ChevronUp size={14} />
                  ) : (
                    <ChevronDown size={14} />
                  )}
                </button>
                {openData && (
                  <div className="ml-4 mt-1 space-y-1">
                    <button
                      onClick={() => goTo("/dashboard/data/dosen")}
                      className={menuButtonClass}
                    >
                      Data Dosen & Kelas
                    </button>
                    <button
                      onClick={() => goTo("/dashboard/data/mahasiswa")}
                      className={menuButtonClass}
                    >
                      Data Kelas & Mahasiswa
                    </button>
                    <button
                      onClick={() => goTo("/dashboard/data/toolsAssesment")}
                      className={menuButtonClass}
                    >
                      Data Tools Assessment
                    </button>
                    <button
                      onClick={() => goTo("/dashboard/data/question")}
                      className={menuButtonClass}
                    >
                      Data Question
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* DO */}
        <div>
          <button
            onClick={() => setOpenDo(!openDo)}
            className="w-full flex justify-between items-center px-2 py-2 hover:bg-gray-100 text-left text-gray-900 font-semibold rounded"
          >
            <span className="flex items-center gap-2">
              <BookOpenCheck size={18} />
              Do
            </span>
            {openDo ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {openDo && (
            <div className="ml-4 mt-1 space-y-1">
              {/* Rubrik Penilaian */}
              <div>
                <button
                  onClick={() => setOpenRubrik(!openRubrik)}
                  className={`${menuButtonClass} flex justify-between items-center`}
                >
                  <span>Rubrik Penilaian</span>
                  {openRubrik ? (
                    <ChevronUp size={14} />
                  ) : (
                    <ChevronDown size={14} />
                  )}
                </button>
                {openRubrik && (
                  <div className="ml-4 mt-1 space-y-1">
                    {role === "DosenKoor" && (
                      <>
                        <button
                          onClick={() => goTo("/dashboard/input/rubrik")}
                          className={menuButtonClass}
                        >
                          Input Rubrik
                        </button>
                        <button
                          onClick={() => goTo("/dashboard/skor/mk")}
                          className={menuButtonClass}
                        >
                          Hitung Skor MK
                        </button>
                        <button
                          onClick={() => goTo("/dashboard/skor/pi-plo")}
                          className={menuButtonClass}
                        >
                          Hitung Skor PI & PLO
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => goTo("/dashboard/rubrik")}
                      className={menuButtonClass}
                    >
                      Rubrik
                    </button>
                    {role === "DosenAmpu" && (
                      <button
                        onClick={() => goTo("/dashboard/input/nilai")}
                        className={menuButtonClass}
                      >
                        Input Nilai
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Portofolio */}
              <div>
                <button
                  onClick={() => setOpenPortofolio(!openPortofolio)}
                  className={`${menuButtonClass} flex justify-between items-center`}
                >
                  <span>Portofolio</span>
                  {openPortofolio ? (
                    <ChevronUp size={14} />
                  ) : (
                    <ChevronDown size={14} />
                  )}
                </button>
                {openPortofolio && (
                  <div className="ml-4 mt-1 space-y-1">
                    {role === "DosenAmpu" && (
                      <button
                        onClick={() => goTo("/dashboard/input/portofolio")}
                        className={menuButtonClass}
                      >
                        Input Portofolio
                      </button>
                    )}
                    <button
                      onClick={() => goTo("/dashboard/portofolio")}
                      className={menuButtonClass}
                    >
                      Portofolio Mata Kuliah
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* CHECK */}
        <div>
          <button
            onClick={() => setOpenCheck(!openCheck)}
            className="w-full flex justify-between items-center px-2 py-2 hover:bg-gray-100 text-left text-gray-900 font-semibold rounded"
          >
            <span className="flex items-center gap-2">
              <BarChart3 size={18} />
              Check
            </span>
            {openCheck ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {openCheck && (
            <div className="ml-4 mt-1 space-y-1">
              {role === "GugusKendaliMutu" && (
                <button
                  onClick={() => goTo("/dashboard/input/monitoring")}
                  className={menuButtonClass}
                >
                  Monitoring Evaluasi
                </button>
              )}
              <button
                onClick={() => goTo("/dashboard/laporan")}
                className={menuButtonClass}
              >
                Laporan
              </button>
            </div>
          )}
        </div>

        {/* ACT */}
        <div>
          <button
            onClick={() => setOpenAct(!openAct)}
            className="w-full flex justify-between items-center px-2 py-2 hover:bg-gray-100 text-left text-gray-900 font-semibold rounded"
          >
            <span className="flex items-center gap-2">
              <RefreshCw size={18} />
              Act
            </span>
            {openAct ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {openAct && (
            <div className="ml-4 mt-1 space-y-1">
              <button
                onClick={() => goTo("/dashboard/hasil-validasi")}
                className={menuButtonClass}
              >
                Hasil Validasi Evaluasi
              </button>
            </div>
          )}
        </div>

        {/* Services */}
        {(role === "Kaprodi" ||
          role === "DosenKoor" ||
          role === "DosenAmpu" ||
          role === "GugusKendaliMutu") && (
          <div className="mt-2">
            <button
              onClick={() => setOpenServices(!openServices)}
              className="w-full flex justify-between items-center px-2 py-2 hover:bg-gray-100 text-left text-gray-900 font-semibold rounded"
            >
              <span className="flex items-center gap-2">
                <Settings size={18} />
                Services
              </span>
              {openServices ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>
            {openServices && (
              <div className="ml-6 mt-1 space-y-1">
                <button
                  onClick={() => goTo("/dashboard/services/download-excel")}
                  className={menuButtonClass}
                >
                  Download Template Excel
                </button>
                <button
                  onClick={() => goTo("/dashboard/services/buku-panduan")}
                  className={menuButtonClass}
                >
                  Download Panduan
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
