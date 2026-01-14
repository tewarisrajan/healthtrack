import { useState } from "react";
import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { Toaster } from "react-hot-toast";

interface Props {
  children: ReactNode;
}

export default function AppLayout({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="h-screen flex bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-50 transition-colors duration-500 overflow-hidden font-sans">

      {/* Ambient Background Mesh - Highly Optimized (No blend modes, low blur) */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 dark:opacity-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500 rounded-full blur-3xl transform translate-z-0" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500 rounded-full blur-3xl transform translate-z-0" />
      </div>

      {/* Sidebar Container */}
      <div
        className={`
          fixed inset-y-0 left-0 z-40 w-72 transform 
          transition-transform duration-300 ease-spring
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0
        `}
      >
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 relative z-10 h-full overflow-hidden">
        <TopBar onToggleSidebar={() => setSidebarOpen((v) => !v)} />

        <main className="flex-1 overflow-y-auto w-full">
          <div className="p-4 md:p-8 max-w-7xl mx-auto pb-20">
            {children}
          </div>
        </main>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          className:
            "glass-card !bg-white/90 dark:!bg-slate-800/90 !text-slate-900 dark:!text-slate-100 !border-slate-200 dark:!border-slate-700 !shadow-xl",
          style: {
            borderRadius: '12px',
          }
        }}
      />
    </div>
  );
}
