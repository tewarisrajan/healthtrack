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
    <header className="h-14 border-b bg-white dark:bg-slate-900 dark:border-slate-800 flex items-center justify-between px-3 md:px-4">
      <div className="flex items-center gap-2">
        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
          onClick={onToggleSidebar}
        >
          <span className="sr-only">Toggle menu</span>
          <div className="space-y-1">
            <span className="block w-4 h-[2px] bg-slate-700"></span>
            <span className="block w-4 h-[2px] bg-slate-700"></span>
          </div>
        </button>
        <div className="flex flex-col">
          <span className="text-xs text-slate-500 dark:text-slate-400">{greeting}</span>
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {user?.name ?? "User"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs md:text-sm">
        {user?.abhaId && (
          <span className="hidden md:inline-block px-2 py-1 rounded-full bg-teal-50 text-teal-700">
            ABHA: <span className="font-mono text-[11px]">{user.abhaId}</span>
          </span>
        )}
        <button
          onClick={logout}
          className="px-3 py-1 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs md:text-sm"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
