"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/all/Sidebar";
import Header from "@/components/all/Header";
import apiService from "@/app/services/apiServices";
import SplashScreen from "@/components/all/SplashScreen";

export default function ClientLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await apiService.get("/me");
        if (res.authenticated) {
          setUser(res.user);
        } else {
          setUser(null);
          router.replace("/"); // Redirect ke login kalau gak ada user
        }
      } catch (error) {
        setUser(null);
        router.replace("/");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [router]);

  if (loading) {
    return (
      <div className="p-4">
        <SplashScreen />
      </div>
    );
  }

  if (!user) {
    // Kalau gak ada user, splash screen atau redirect sedang berlangsung
    return null;
  }

  return (
    <div className="flex min-h-screen transition-all duration-300">
      {/* Sidebar */}
      <aside
        className={`bg-white border-r shadow-md overflow-hidden transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-0 hidden"
        }`}
      >
        <Sidebar visible={sidebarOpen} role={user.role} />
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
