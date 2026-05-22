import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useHealthTrack } from "../context/HealthTrackContext";
import { FilePlus, ShieldCheck, X } from "lucide-react";
import toast from "react-hot-toast";

interface ProviderStats {
    recordsIssued: number;
    activeStaff: number;
    dataIntegrity: string;
    blockchainGas: string;
}

interface StaffMember {
    id: string;
    name: string;
    specialization: string;
    licenseNumber: string;
}

export default function ProviderDashboard() {
    const { user, token } = useAuth();
    const { uploadFile } = useHealthTrack();
    
    const [stats, setStats] = useState<ProviderStats | null>(null);
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);

    // Form state
    const [patientEmail, setPatientEmail] = useState("");
    const [recordTitle, setRecordTitle] = useState("");
    const [recordType, setRecordType] = useState("LAB_REPORT");
    const [file, setFile] = useState<File | null>(null);
    const [issuing, setIssuing] = useState(false);

    const fetchData = async () => {
        try {
            const [statsRes, staffRes] = await Promise.all([
                fetch("http://localhost:4000/api/provider/stats", {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                fetch("http://localhost:4000/api/provider/staff", {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            const statsData = await statsRes.json();
            const staffData = await staffRes.json();

            if (statsData.success) setStats(statsData.data);
            if (staffData.success) setStaff(staffData.data);
        } catch (error) {
            console.error("Error fetching provider data", error);
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchData();
        }
    }, [token]);

    const handleIssueRecord = async (e: React.FormEvent) => {
        e.preventDefault();
        setIssuing(true);
        try {
            let fileData = { fileUrl: "", fileHash: "", extractedText: "" };
            if (file) {
                fileData = await uploadFile(file);
            }

            const res = await fetch("http://localhost:4000/api/provider/issue-record", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    patientEmail,
                    title: recordTitle,
                    type: recordType,
                    fileUrl: fileData.fileUrl,
                    fileHash: fileData.fileHash,
                    extractedText: fileData.extractedText
                })
            });

            const data = await res.json();
            if (res.ok && data.success) {
                toast.success("Record issued successfully");
                setIsIssueModalOpen(false);
                setPatientEmail("");
                setRecordTitle("");
                setFile(null);
                fetchData(); // Refresh stats
            } else {
                toast.error(data.message || "Failed to issue record");
            }
        } catch (error: any) {
            console.error(error);
            toast.error("An error occurred");
        } finally {
            setIssuing(false);
        }
    };

    if (loading) {
        return <div className="text-center mt-20 text-slate-500">Loading Facility Dashboard...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 relative">
            <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    Facility Command Center
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1 uppercase text-xs font-bold tracking-widest">
                    Authorized Managed: {user?.profile?.registerId || "Pending Verification"}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <SimpleStats label="Records Issued" value={stats?.recordsIssued?.toString() || "0"} />
                <SimpleStats label="Active Staff" value={stats?.activeStaff?.toString() || "0"} />
                <SimpleStats label="Data Integrity" value={stats?.dataIntegrity || "99.9%"} />
                <SimpleStats label="Blockchain Gas" value={stats?.blockchainGas || "2.4 eth"} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-panel p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                    <div>
                        <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                            <FilePlus className="w-5 h-5 text-teal-500" />
                            Issue New Health Record
                        </h2>
                        <p className="text-sm text-slate-500 mb-6">Digitize and sign lab reports directly to a patient's ABHA vault.</p>
                    </div>
                    <button 
                        onClick={() => setIsIssueModalOpen(true)}
                        className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase tracking-tighter hover:opacity-90 transition-all"
                    >
                        Open Issuance Portal
                    </button>
                </div>

                <div className="glass-panel p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800">
                    <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-blue-500" />
                        Staff Verified Nodes
                    </h2>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {staff.length === 0 ? (
                            <p className="text-sm text-slate-500 italic">No doctors associated with this facility.</p>
                        ) : (
                            staff.map(doc => (
                                <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl gap-3">
                                    <div>
                                        <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{doc.name}</div>
                                        <div className="text-xs text-slate-500">{doc.specialization}</div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <div className="text-[10px] font-black text-slate-400 bg-white dark:bg-slate-900 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700">{doc.licenseNumber}</div>
                                        <div className="text-[10px] font-black text-teal-600 bg-teal-500/10 px-2 py-1 rounded-full uppercase">Active</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Issue Record Modal */}
            {isIssueModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
                        <button 
                            onClick={() => setIsIssueModalOpen(false)}
                            className="absolute top-6 right-6 p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full hover:text-slate-900 dark:hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Issue Record</h2>
                        
                        <form onSubmit={handleIssueRecord} className="space-y-5">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 mb-1 block">Patient Email</label>
                                <input 
                                    type="email" required
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-teal-500"
                                    value={patientEmail} onChange={e => setPatientEmail(e.target.value)}
                                    placeholder="patient@healthtrack.com"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 mb-1 block">Record Title</label>
                                <input 
                                    type="text" required
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-teal-500"
                                    value={recordTitle} onChange={e => setRecordTitle(e.target.value)}
                                    placeholder="e.g. Annual Blood Work"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 mb-1 block">Document Type</label>
                                <select 
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-teal-500"
                                    value={recordType} onChange={e => setRecordType(e.target.value)}
                                >
                                    <option value="LAB_REPORT">Lab Report</option>
                                    <option value="PRESCRIPTION">Prescription</option>
                                    <option value="SCAN">Scan</option>
                                    <option value="CERTIFICATE">Certificate</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 mb-1 block">Attach File (Optional)</label>
                                <input 
                                    type="file" 
                                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                                    onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
                                />
                            </div>
                            
                            <button 
                                type="submit" 
                                disabled={issuing}
                                className="w-full py-4 mt-4 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-black uppercase tracking-widest transition-all disabled:opacity-50"
                            >
                                {issuing ? "Issuing..." : "Submit Record"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function SimpleStats({ label, value }: { label: string, value: string }) {
    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-center h-full">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-3">{label}</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white leading-none">{value}</p>
        </div>
    );
}
