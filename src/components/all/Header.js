"use client";

import { Menu } from "lucide-react";
import ProfileButton from "./ButtonProfile";

const Header = ({ title, toggleSidebar }) => {
  return (
    <div className="w-full bg-blue-900 border-b px-6 py-4 shadow-sm sticky top-0 z-10 flex items-center justify-between">
      {/* Kiri: Toggle Sidebar (jika ada) dan Judul */}
      <div className="flex items-center gap-4">
        {toggleSidebar && (
          <button
            onClick={toggleSidebar}
            className="text-white hover:text-gray-200 focus:outline-none"
          >
            <Menu size={24} />
          </button>
        )}
        <h1 className="text-xl font-semibold text-white">{title}</h1>
      </div>

      {/* Kanan: Tombol Profile */}
      <ProfileButton />
    </div>
  );
};

export default Header;
