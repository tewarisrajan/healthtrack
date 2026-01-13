import { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { Toaster } from "react-hot-toast";

interface Props {
  children: ReactNode;
}

export default function AppLayout({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-30 w-64 transform
          bg-slate-900/95 backdrop-blur-sm border-r border-slate-800
          text-slate-100
          transition-transform duration-200 ease-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0
        `}
      >
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1">
        <TopBar onToggleSidebar={() => setSidebarOpen((v) => !v)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/60 dark:bg-slate-900/60 transition-colors duration-300">
          {/* Subtle gradient background */}
          <div className="mx-auto max-w-6xl">
            <div className="pointer-events-none fixed inset-0 -z-10 opacity-40 dark:opacity-60">
              <div className="absolute -top-32 -right-32 w-72 h-72 bg-teal-500/20 blur-3xl rounded-full" />
              <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-emerald-500/15 blur-3xl rounded-full" />
            </div>
            {children}
          </div>
        </main>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          className:
            "bg-slate-900 text-slate-50 dark:bg-slate-100 dark:text-slate-900 border border-slate-700 dark:border-slate-200 text-sm",
        }}
      />
    </div>
  );
}
