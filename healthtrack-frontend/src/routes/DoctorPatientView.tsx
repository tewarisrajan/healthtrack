import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, FileText, Calendar, ShieldCheck, AlertCircle } from "lucide-react";
import type { HealthRecord } from "../types/models";

export default function DoctorPatientView() {
    const { patientId } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();

    const [records, setRecords] = useState<HealthRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const res = await fetch(`http://localhost:4000/api/doctor/patients/${patientId}/records`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : undefined
                });
                const data = await res.json();

                if (data.success) {
                    setRecords(data.data);
                } else {
                    setError(data.message || "Failed to load records");
                }
            } catch (err) {
                console.error(err);
                setError("Network error");
            } finally {
                setLoading(false);
            }
        };

        if (patientId) {
            fetchRecords();
        }
    }, [patientId, token]);

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
            </button>

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                        Patient Health Records
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-teal-600" />
                        Access Granted via Consent
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20">Loading records...</div>
            ) : error ? (
                <div className="bg-red-50 text-red-700 p-6 rounded-2xl flex items-center gap-3">
                    <AlertCircle className="w-6 h-6" />
                    <div>
                        <h3 className="font-bold">Access Denied or Error</h3>
                        <p>{error}</p>
                    </div>
                </div>
            ) : records.length === 0 ? (
                <div className="text-center py-20 text-slate-500 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                    No medical records found for this patient.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {records.map(record => (
                        <div key={record.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl ${record.type === 'PRESCRIPTION' ? 'bg-blue-50 text-blue-600' :
                                    record.type === 'LAB_REPORT' ? 'bg-purple-50 text-purple-600' :
                                        'bg-slate-50 text-slate-600'
                                    }`}>
                                    <FileText className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                                    {record.type}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-teal-600 transition-colors">
                                {record.title}
                            </h3>
                            <p className="text-sm text-slate-500 mb-4">
                                by {record.providerName}
                            </p>

                            <div className="flex items-center gap-4 text-xs text-slate-400 pt-4 border-t border-slate-50 dark:border-slate-800">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(record.createdAt).toLocaleDateString()}
                                </span>
                                {record.fileUrl && (
                                    <a
                                        href={record.fileUrl.startsWith('http') ? record.fileUrl : `http://localhost:4000${record.fileUrl}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-teal-600 font-bold hover:underline ml-auto"
                                    >
                                        View File
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
