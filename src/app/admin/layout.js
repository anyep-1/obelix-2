import { Geist, Geist_Mono } from "next/font/google";
import ClientLayout from "./ClientLayout"; // langsung import biasa

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Dashboard",
  description: "Academic planning area",
};

export default function DashboardLayout({ children }) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable}`}>
      <ClientLayout>{children}</ClientLayout>
    </div>
  );
}
