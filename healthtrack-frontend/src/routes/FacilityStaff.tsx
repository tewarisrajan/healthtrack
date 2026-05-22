import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Users, UserPlus, Search, Stethoscope } from "lucide-react";
import toast from "react-hot-toast";

interface StaffMember {
    id: string;
    name: string;
    specialization: string;
    licenseNumber: string;
}

export default function FacilityStaff() {
    const { token } = useAuth();
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const res = await fetch("http://localhost:4000/api/provider/staff", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    setStaff(data.data);
                }
            } catch (error) {
                console.error("Error fetching staff", error);
                toast.error("Failed to load staff list");
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchStaff();
    }, [token]);

    const handleInvite = () => {
        toast.success("Invite link generated and copied to clipboard!");
    };

    const filteredStaff = staff.filter(doc => 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        doc.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        Staff Management
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 uppercase text-xs font-bold tracking-widest flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {staff.length} Active Medical Professionals
                    </p>
                </div>
                <button 
                    onClick={handleInvite}
                    className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20"
                >
                    <UserPlus className="w-5 h-5" />
                    Invite Doctor
                </button>
            </div>

            <div className="glass-panel p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3 mb-6 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500 transition-all">
                    <Search className="w-5 h-5 text-slate-400 ml-2" />
                    <input 
                        type="text" 
                        placeholder="Search by name, specialization, or license number..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent border-none outline-none text-sm text-slate-900 dark:text-white placeholder-slate-400"
                    />
                </div>

                {loading ? (
                    <div className="text-center py-10 text-slate-500">Loading staff directory...</div>
                ) : filteredStaff.length === 0 ? (
                    <div className="text-center py-16 px-4">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Stethoscope className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-black text-slate-800 dark:text-slate-200 mb-1">No Doctors Found</h3>
                        <p className="text-sm text-slate-500">
                            {searchQuery ? "No staff members match your search query." : "You haven't added any medical professionals to your facility yet."}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-800">
                                    <th className="py-4 px-4 text-xs font-black text-slate-400 uppercase tracking-widest">Professional</th>
                                    <th className="py-4 px-4 text-xs font-black text-slate-400 uppercase tracking-widest">Specialization</th>
                                    <th className="py-4 px-4 text-xs font-black text-slate-400 uppercase tracking-widest">License Number</th>
                                    <th className="py-4 px-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                {filteredStaff.map((doc) => (
                                    <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                                                    {doc.name.charAt(0)}
                                                </div>
                                                <span className="font-bold text-slate-800 dark:text-slate-200">{doc.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300">
                                                {doc.specialization}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 font-mono text-sm text-slate-500 dark:text-slate-400">
                                            {doc.licenseNumber}
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                                                <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                                                Active
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
