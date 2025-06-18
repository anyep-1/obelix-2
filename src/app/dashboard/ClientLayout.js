"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/all/Sidebar";
import Header from "@/components/all/Header";
import apiService from "@/app/services/apiServices";
import SplashScreen from "@/components/all/SplashScreen";

export default function ClientLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userRole, setUserRole] = useState(null);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiService.get("/me");
        setUserRole(res.user.role);
      } catch (err) {
        console.error("Gagal ambil user:", err);
      }
    };
    fetchUser();
  }, []);

  if (!userRole) {
    return (
      <div className="p-4">
        <SplashScreen />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen transition-all duration-300">
      {/* Sidebar selalu ada, hanya width dan overflow-nya diatur */}
      <aside
        className={`bg-white border-r shadow-md overflow-hidden transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-0"
        }`}
      >
        <Sidebar visible={sidebarOpen} role={userRole} />
      </aside>

      {/* Konten utama */}
      <div className="flex flex-col flex-1 min-w-0 transition-all duration-300">
        <Header
          toggleSidebar={toggleSidebar}
          title="Academic Planning System"
        />
        <main className="flex-1 p-6 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
