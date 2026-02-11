import { useAuth } from "../context/AuthContext";
import { FilePlus, ShieldCheck } from "lucide-react";

export default function ProviderDashboard() {
    const { user } = useAuth();

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    Facility Command Center
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1 uppercase text-xs font-bold tracking-widest">
                    Authorized Managed: {user?.profile?.registerId || "Pending Verification"}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <SimpleStats label="Records Issued" value="1.2k" />
                <SimpleStats label="Active Staff" value="45" />
                <SimpleStats label="Data Integrity" value="99.9%" />
                <SimpleStats label="Blockchain Gas" value="2.4 eth" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-panel p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800">
                    <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                        <FilePlus className="w-5 h-5 text-teal-500" />
                        Issue New Health Record
                    </h2>
                    <p className="text-sm text-slate-500 mb-6">Digitize and sign lab reports directly to a patient's ABHA vault.</p>
                    <button className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase tracking-tighter hover:opacity-90 transition-all">
                        Open Issuance Portal
                    </button>
                </div>

                <div className="glass-panel p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800">
                    <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-blue-500" />
                        Staff Verified Nodes
                    </h2>
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Staff-Node-{i}</div>
                                <div className="text-[10px] font-black text-teal-600 bg-teal-500/10 px-2 py-1 rounded-full uppercase">Active</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function SimpleStats({ label, value }: { label: string, value: string }) {
    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">{label}</p>
            <p className="text-xl font-black text-slate-900 dark:text-white leading-none">{value}</p>
        </div>
    );
}
