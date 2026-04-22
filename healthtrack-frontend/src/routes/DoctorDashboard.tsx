import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { Users, FileText, CheckCircle, Activity, LayoutDashboard } from "lucide-react";
import PatientList from "../components/doctor/PatientList";
import RecentActivityList from "../components/doctor/RecentActivityList";
import { API_BASE_URL } from "../config";
import type { DashboardStats } from "../types/models";

export default function DoctorDashboard() {
    const { user, token } = useAuth();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/doctor/stats`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : undefined
                });
                const data = await res.json();
                if (data.success) {
                    setStats(data.data);
                }
            } catch (err) {
                console.error("Failed to load dashboard stats", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [token]);

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <LayoutDashboard className="w-8 h-8 text-teal-600" />
                        Consultation Desk
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Welcome back, {user?.name}.
                        {stats?.pendingRequests ? (
                            <span className="ml-1 text-teal-600 font-bold">
                                You have {stats.pendingRequests} pending consent requests.
                            </span>
                        ) : (
                            " Manage your patients and consultations."
                        )}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    icon={<Users className="text-blue-500" />}
                    label="Total Patients"
                    value={loading ? "-" : stats?.totalPatients.toString() || "0"}
                />
                <StatsCard
                    icon={<CheckCircle className="text-teal-500" />}
                    label="Active Consents"
                    value={loading ? "-" : stats?.activeConsents.toString() || "0"}
                />
                <StatsCard
                    icon={<Activity className="text-purple-500" />}
                    label="Pending Requests"
                    value={loading ? "-" : stats?.pendingRequests.toString() || "0"}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content - Patient List - Takes up 2 columns */}
                <div className="lg:col-span-2 glass-panel p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800">
                    <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-teal-500" />
                        Patient Directory
                    </h2>
                    <PatientList />
                </div>

                {/* Sidebar - Recent Activity - Takes up 1 column */}
                <div className="glass-panel p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 h-fit">
                    <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-purple-500" />
                        Recent Activity
                    </h2>
                    <RecentActivityList activities={stats?.recentActivity || []} />
                </div>
            </div>
        </div>
    );
}

function StatsCard({ icon, label, value }: { icon: ReactNode, label: string, value: string }) {
    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-transform hover:scale-105">
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
