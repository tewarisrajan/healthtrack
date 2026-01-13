import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/records", label: "Records" },
  { to: "/emergency", label: "Emergency" },
  { to: "/family", label: "Family" },
  { to: "/settings", label: "Settings" },
];

export default function Sidebar() {
  return (
    <aside className="h-full flex flex-col">
      <div className="h-14 flex items-center px-4 border-b border-slate-800/80">
        <span className="text-lg font-semibold tracking-tight">
          Health<span className="text-teal-400">Track</span>
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              [
                "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
                "border border-transparent",
                isActive
                  ? "bg-teal-500/15 text-teal-100 border-teal-500/60"
                  : "text-slate-300 hover:bg-slate-800/70 hover:text-white hover:border-slate-700",
              ].join(" ")
            }
          >
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400/80" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-4 pb-4 text-[11px] text-slate-500 border-t border-slate-800/80 pt-3">
        <p>Prototype build for digital health records.</p>
        <p className="mt-1 text-slate-400">
          Dark mode friendly • Emergency ready
        </p>
      </div>
    </aside>
  );
}
