import { Link } from "react-router-dom";

const actions = [
    { label: "Upload Record", to: "/records/upload", icon: "📤", color: "bg-blue-500" },
    { label: "Add Family", to: "/family", icon: "👨‍👩‍👧", color: "bg-purple-500" },
    { label: "Update Emergency", to: "/emergency", icon: "🚨", color: "bg-red-500" },
];

export default function QuickActions() {
    return (
        <div className="glass-card rounded-3xl p-6 h-full flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">
                Quick Actions
            </h3>
            <div className="flex-1 grid grid-cols-1 gap-3">
                {actions.map((action) => (
                    <Link
                        key={action.to}
                        to={action.to}
                        className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group"
                    >
                        <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center text-white text-xl shadow-md group-hover:scale-110 transition-transform`}>
                            {action.icon}
                        </div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {action.label}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
