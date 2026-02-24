"use client";

import { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { MedicineProvider } from "@/context/MedicineContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header onMenuToggle={() => setSidebarOpen((prev) => !prev)} />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <MedicineProvider>{children}</MedicineProvider>
        </main>
      </div>
    </div>
  );
}
