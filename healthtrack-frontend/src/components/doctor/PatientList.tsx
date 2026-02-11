import { useState, useEffect } from "react";
import { Search, Lock, Unlock, UserPlus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface Patient {
    id: string;
    name: string;
    email: string;
    consentStatus: "NONE" | "PENDING" | "APPROVED" | "REJECTED";
}

export default function PatientList() {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(false);

    const searchPatients = async (query: string = "") => {
        setLoading(true);
        try {
            // If query is empty, we might want to list "My Patients" if we had that relationship.
            // For now, let's allow listing all or search.
            const url = `http://localhost:4000/api/doctor/patients${query ? `?search=${query}` : ""}`;
            const res = await fetch(url, {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined
            });
            const data = await res.json();
            if (data.success) {
                setPatients(data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Initial load/search
    useEffect(() => {
        searchPatients();
    }, [token]);

    const requestAccess = async (patientId: string) => {
        try {
            const res = await fetch(`http://localhost:4000/api/doctor/patients/${patientId}/request-access`, {
                method: "POST",
                headers: token ? { Authorization: `Bearer ${token}` } : undefined
            });
            const data = await res.json();
            if (data.success) {
                // Refresh list to update status
                searchPatients(search);
                // Ideally show a toast here
                alert("Access request sent successfully!");
            } else {
                alert(data.message || "Failed to send request");
            }
        } catch (err) {
            console.error(err);
            alert("Network error");
        }
    };

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search patients by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && searchPatients(search)}
                    className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-teal-500 dark:text-white"
                />
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <button
                    onClick={() => searchPatients(search)}
                    disabled={loading}
                    className="absolute right-2 top-2 bottom-2 px-4 bg-teal-100 text-teal-700 rounded-xl text-sm font-semibold hover:bg-teal-200 disabled:opacity-50"
                >
                    {loading ? "Searching..." : "Search"}
                </button>
            </div>

            {/* Results */}
            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="text-center py-10 opacity-50">Searching...</div>
                ) : patients.length === 0 ? (
                    <div className="text-center py-10 opacity-50">No patients found.</div>
                ) : (
                    patients.map(patient => (
                        <div key={patient.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold">
                                    {patient.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white">{patient.name}</h3>
                                    <p className="text-xs text-slate-500">{patient.email}</p>
                                </div>
                            </div>

                            <div>
                                {patient.consentStatus === 'APPROVED' ? (
                                    <button
                                        onClick={() => navigate(`/doctor/patients/${patient.id}`)}
                                        className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700 transition"
                                    >
                                        <Unlock className="w-3 h-3" />
                                        View Records
                                    </button>
                                ) : patient.consentStatus === 'PENDING' ? (
                                    <span className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-xl text-xs font-bold">
                                        <Lock className="w-3 h-3" />
                                        Request Pending
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => requestAccess(patient.id)}
                                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                                    >
                                        <UserPlus className="w-3 h-3" />
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
