import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Overview", icon: "📊" },
  { to: "/records", label: "My Records", icon: "📂" },
  { to: "/emergency", label: "Emergency", icon: "🚨" },
  { to: "/family", label: "Family", icon: "👨‍👩‍👧" },
  { to: "/settings", label: "Settings", icon: "⚙️" },
];

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="h-full flex flex-col glass-panel border-r-0 md:border-r rounded-r-3xl md:rounded-none relative z-50">
      <div className="h-20 flex items-center px-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center text-white font-bold shadow-lg shadow-teal-500/20">
            H
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
            HealthTrack
          </span>
        </div>
      </div>

      <div className="px-4 mb-2">
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold mb-1">
            Logged in as
          </p>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
            {user?.name || "User"}
          </p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300",
                isActive
                  ? "bg-teal-500 text-white shadow-lg shadow-teal-500/25 translate-x-1"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100",
              ].join(" ")
            }
          >
            <span className="text-lg opacity-80">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-6">
        <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-4 text-white shadow-lg">
          <p className="text-xs font-semibold opacity-80 mb-1">PROTOTYPE v1</p>
          <p className="text-xs opacity-70">
            All data is stored locally.
          </p>
        </div>
      </div>
    </aside>
  );
}
