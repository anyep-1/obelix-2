"use client";

import Header from "@/components/all/Header";

export default function ClientLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Dashboard Admin" />
      <main className="p-6">{children}</main>
    </div>
  );
}
