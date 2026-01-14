import { useAuth } from "../../context/AuthContext";

interface TopBarProps {
  onToggleSidebar: () => void;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function TopBar({ onToggleSidebar }: TopBarProps) {
  const { user, logout } = useAuth();
  const greeting = getGreeting();

  return (
    <header className="h-16 flex items-center justify-between px-6 md:px-8 mt-2 z-20">
      <div className="flex items-center gap-4">
        <button
          className="md:hidden p-2 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-sm"
          onClick={onToggleSidebar}
        >
          <span className="sr-only">Toggle menu</span>
          <div className="space-y-1.5">
            <span className="block w-5 h-0.5 bg-slate-700 dark:bg-slate-200 rounded-full"></span>
            <span className="block w-4 h-0.5 bg-slate-700 dark:bg-slate-200 rounded-full"></span>
          </div>
        </button>

        <div className="flex flex-col">
          <span className="text-xl font-bold text-slate-800 dark:text-slate-100 hidden md:block">
            {greeting}, {user?.name?.split(' ')[0] || "User"} 👋
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user?.abhaId && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50/50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800/50 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-teal-700 dark:text-teal-300">
              ABHA Linked
            </span>
          </div>
        )}

        <button
          onClick={logout}
          className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-200 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}
