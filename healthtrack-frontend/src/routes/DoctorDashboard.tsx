import { useAuth } from "../context/AuthContext";
import { Users, FileText, CheckCircle, Search, Calendar } from "lucide-react";

export default function DoctorDashboard() {
    const { user } = useAuth();

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        Consultation Desk
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Welcome back, {user?.name}. You have 4 pending patient consents.
                    </p>
                </div>
                <button className="px-6 py-3 bg-teal-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-teal-700 transition-all shadow-lg shadow-teal-900/20">
                    <Search className="w-5 h-5" />
                    Search Patient
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard icon={<Users className="text-blue-500" />} label="Total Patients" value="128" />
                <StatsCard icon={<CheckCircle className="text-teal-500" />} label="Active Consents" value="12" />
                <StatsCard icon={<Calendar className="text-purple-500" />} label="Today's Appointments" value="8" />
            </div>

            <div className="glass-panel p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800">
                <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-teal-500" />
                    Recent Access Requests
                </h2>
                <div className="space-y-4 text-center py-12">
                    <p className="text-slate-400 italic">No new access requests at this moment.</p>
                </div>
            </div>
        </div>
    );
}

function StatsCard({ icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white">{value}</p>
            </div>
        </div>
    );
}
