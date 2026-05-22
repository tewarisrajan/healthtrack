import { useAuth } from "../context/AuthContext";
import { Building2, MapPin, Hash, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export default function FacilityManagement() {
    const { user } = useAuth();

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Facility settings updated successfully!");
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    Facility Management
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1 uppercase text-xs font-bold tracking-widest">
                    Manage your institution profile and settings
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="md:col-span-1 space-y-4">
                    <div className="glass-panel p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 text-center">
                        <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-teal-500 to-emerald-600 rounded-3xl flex items-center justify-center text-white font-black text-4xl shadow-xl shadow-teal-500/20 mb-4">
                            {user?.name?.[0] || "H"}
                        </div>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white">
                            {user?.name || "Facility Name"}
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1 mt-1">
                            <CheckCircle2 className="w-4 h-4 text-teal-500" />
                            Verified Institution
                        </p>
                    </div>

                    <div className="glass-panel p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 space-y-4">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                <Building2 className="w-3 h-3" /> Type
                            </p>
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                {user?.profile?.type || "General Hospital"}
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                <Hash className="w-3 h-3" /> Registration ID
                            </p>
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                {user?.profile?.registerId || "N/A"}
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> Address
                            </p>
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                {user?.profile?.address || "Address not provided"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="md:col-span-2">
                    <div className="glass-panel p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800">
                        <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-6">
                            Institution Settings
                        </h3>
                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 mb-2 block">Institution Name</label>
                                    <input 
                                        type="text" 
                                        defaultValue={user?.name || ""}
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-teal-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 mb-2 block">Contact Email</label>
                                    <input 
                                        type="email" 
                                        defaultValue={user?.email || ""}
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-teal-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 mb-2 block">Registered Address</label>
                                <textarea 
                                    rows={3}
                                    defaultValue={user?.profile?.address || ""}
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-teal-500 resize-none"
                                />
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button 
                                    type="submit"
                                    className="px-8 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-black uppercase tracking-widest transition-all"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
