import { Link } from "react-router-dom";

const actions = [
    { 
        label: "Upload Record", 
        to: "/records/upload", 
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
        ), 
        color: "bg-teal-500/10 text-teal-600" 
    },
    { 
        label: "Add Family", 
        to: "/family", 
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
        ), 
        color: "bg-indigo-500/10 text-indigo-600" 
    },
    { 
        label: "Update Emergency", 
        to: "/emergency", 
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        ), 
        color: "bg-rose-500/10 text-rose-600" 
    },
];

export default function QuickActions() {
    return (
        <div className="glass-panel p-8 rounded-[2.5rem] h-full flex flex-col border-slate-200/50 dark:border-slate-800/50 shadow-sm">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6">
                Quick Actions
            </h3>
            <div className="flex-1 space-y-3">
                {actions.map((action) => (
                    <Link
                        key={action.to}
                        to={action.to}
                        className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-teal-500/20 transition-all group shadow-sm hover:shadow-md"
                    >
                        <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                            {action.icon}
                        </div>
                        <span className="text-sm font-black text-slate-700 dark:text-slate-300 tracking-tight">
                            {action.label}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
