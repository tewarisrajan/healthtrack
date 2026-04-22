import { useState, useEffect } from "react";
import { Search, Lock, Unlock, UserPlus, RotateCcw } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import type { Patient } from "../../types/models";
import { API_BASE_URL } from "../../config";

export default function PatientList() {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(false);

    const searchPatients = async (query: string = "") => {
        setLoading(true);
        try {
            const url = `${API_BASE_URL}/doctor/patients${query ? `?search=${query}` : ""}`;
            const res = await fetch(url, {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined
            });
            const data = await res.json();
            if (data.success) {
                setPatients(data.data);
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch patients");
        } finally {
            setLoading(false);
        }
    };

    // Initial load/search
    useEffect(() => {
        searchPatients();
    }, [token]);

    const requestAccess = async (patientId: string) => {
        const toastId = toast.loading("Sending request...");
        try {
            const res = await fetch(`${API_BASE_URL}/doctor/patients/${patientId}/request-access`, {
                method: "POST",
                headers: token ? { Authorization: `Bearer ${token}` } : undefined
            });
            const data = await res.json();
            if (data.success) {
                // Refresh list to update status
                searchPatients(search);
                toast.success("Access request sent!", { id: toastId });
            } else {
                toast.error(data.message || "Failed to send request", { id: toastId });
            }
        } catch (err) {
            console.error(err);
            toast.error("Network error", { id: toastId });
        }
    };

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative group">
                <input
                    type="text"
                    placeholder="Search patients by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && searchPatients(search)}
                    className="w-full pl-12 pr-32 py-4 bg-white dark:bg-slate-900 rounded-2xl border-2 border-transparent focus:border-teal-500/20 shadow-sm focus:ring-0 transition-all dark:text-white"
                />
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-teal-500 transition-colors" />
                <div className="absolute right-2 top-2 bottom-2">
                    <button
                        onClick={() => searchPatients(search)}
                        disabled={loading}
                        className="h-full px-6 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-50 transition-all"
                    >
                        {loading ? "..." : "Search"}
                    </button>
                </div>
            </div>

            {/* Results */}
            <div className="grid grid-cols-1 gap-4">
                {loading && patients.length === 0 ? (
                    <div className="text-center py-10 opacity-50">Searching...</div>
                ) : patients.length === 0 ? (
                    <div className="text-center py-10 opacity-50">No patients found.</div>
                ) : (
                    patients.map(patient => (
                        <div key={patient.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between shadow-sm hover:shadow-md transition-all group">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-slate-500 font-bold text-lg">
                                    {patient.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors">{patient.name}</h3>
                                    <p className="text-xs text-slate-500">{patient.email}</p>
                                </div>
                            </div>

                            <div>
                                {patient.consentStatus === 'APPROVED' ? (
                                    <button
                                        onClick={() => navigate(`/doctor/patients/${patient.id}`)}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-teal-50 text-teal-700 hover:bg-teal-100 rounded-xl text-xs font-bold transition-all"
                                    >
                                        <Unlock className="w-3.5 h-3.5" />
                                        View Records
                                    </button>
                                ) : patient.consentStatus === 'PENDING' ? (
                                    <span className="flex items-center gap-2 px-5 py-2.5 bg-yellow-50 text-yellow-700 rounded-xl text-xs font-bold ring-1 ring-yellow-100">
                                        <Lock className="w-3.5 h-3.5" />
                                        Request Pending
                                    </span>
                                ) : patient.consentStatus === 'REJECTED' ? (
                                    <button
                                        onClick={() => requestAccess(patient.id)}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl text-xs font-bold transition-all"
                                    >
                                        <RotateCcw className="w-3.5 h-3.5" />
                                        Retry Request
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => requestAccess(patient.id)}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow"
                                    >
                                        <UserPlus className="w-3.5 h-3.5" />
                                        Request Access
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
