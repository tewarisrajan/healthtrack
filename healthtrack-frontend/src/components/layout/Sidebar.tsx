import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";

const Icons = {
  Overview: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
  ),
  Records: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9l-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
  ),
  Triage: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
  ),
  Emergency: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
  ),
  Family: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
  ),
  Settings: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
  ),
  Patients: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
  ),
  Consultations: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
  ),
  Management: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
  )
};

interface NavGroup {
  title: string;
  items: { to: string; label: string; icon: JSX.Element; }[];
}

const getNavGroups = (role?: string): NavGroup[] => {
  if (role === "DOCTOR") {
    return [
      {
        title: "Main",
        items: [{ to: "/dashboard", label: "Overview", icon: Icons.Overview }]
      },
      {
        title: "Medical",
        items: [
          { to: "/consultations", label: "Consultations", icon: Icons.Consultations },
          { to: "/patients", label: "Patients", icon: Icons.Patients },
        ]
      }
    ];
  }

  if (role === "PROVIDER") {
    return [
      {
        title: "Main",
        items: [{ to: "/dashboard", label: "Overview", icon: Icons.Overview }]
      },
      {
        title: "Management",
        items: [
          { to: "/management", label: "Facility Mgmt", icon: Icons.Management },
          { to: "/staff", label: "Staff", icon: Icons.Patients },
        ]
      }
    ];
  }

  // Default: PATIENT
  return [
    {
      title: "Menu",
      items: [{ to: "/dashboard", label: "Overview", icon: Icons.Overview }]
    },
    {
      title: "Health Vault",
      items: [
        { to: "/records", label: "Medical Records", icon: Icons.Records },
        { to: "/triage", label: "AI Triage", icon: Icons.Triage },
      ]
    },
    {
      title: "Emergency & Family",
      items: [
        { to: "/emergency", label: "Emergency Hub", icon: Icons.Emergency },
        { to: "/family", label: "Family Circle", icon: Icons.Family },
      ]
    },
    {
      title: "Account",
      items: [
        { to: "/settings", label: "Settings", icon: Icons.Settings },
      ]
    }
  ];
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navGroups = getNavGroups(user?.role);

  return (
    <aside className="h-full flex flex-col glass-panel border-r-0 md:border-r rounded-r-3xl md:rounded-none relative z-50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl">
      {/* Brand Section */}
      <div className="h-24 flex items-center px-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-600 flex items-center justify-center text-white font-black text-xl shadow-xl shadow-teal-500/20 rotate-3 hover:rotate-0 transition-transform duration-500 cursor-pointer">
            H
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
              HealthTrack
            </span>
            <span className="text-[10px] font-bold text-teal-600/60 dark:text-teal-400/60 uppercase tracking-widest leading-none">
              Web3 Vault
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto px-6 py-4 space-y-8 custom-scrollbar">
        {navGroups.map((group, gIdx) => (
          <div key={group.title} className="space-y-3">
            <h3 className="px-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.items.map((item, iIdx) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      "group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300 relative overflow-hidden",
                      isActive
                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl shadow-slate-900/10 dark:shadow-white/5"
                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-500/5 hover:text-slate-900 dark:hover:text-white",
                    ].join(" ")
                  }
                >
                  <motion.span 
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="text-lg"
                  >
                    {item.icon}
                  </motion.span>
                  <span className="relative z-10">{item.label}</span>
                  
                  {/* Active Indicator Glow */}
                  <div className="absolute left-0 w-1 h-6 bg-teal-500 rounded-r-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 active:bg-teal-400" />
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User & Footer Section */}
      <div className="p-6 mt-auto border-t border-slate-100 dark:border-slate-800/50 space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/30 dark:border-slate-700/30">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-300 font-bold">
            {user?.name?.[0] || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-slate-900 dark:text-white truncate uppercase tracking-tight">
              {user?.name || "Anonymous"}
            </p>
            <p className="text-[10px] font-bold text-slate-400 truncate uppercase tracking-widest">
              {user?.role || "Patient"}
            </p>
          </div>
          <button 
            onClick={logout}
            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
            title="Logout"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </button>
        </div>

        <div className="px-2">
          <p className="text-[9px] font-bold text-slate-400 dark:text-slate-600 text-center uppercase tracking-[0.3em]">
            V1.2 Secure Build
          </p>
        </div>
      </div>
    </aside>
  );
}
