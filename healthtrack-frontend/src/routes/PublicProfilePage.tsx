import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

interface EmergencyInfo {
    name: string;
    bloodGroup: string;
    allergies: string[];
    chronicConditions: string[];
    medications: string[];
    emergencyContacts: { name: string; phone: string; relation: string }[];
    lastUpdated: string;
}

export default function PublicProfilePage() {
    const { publicId } = useParams<{ publicId: string }>();
    const [info, setInfo] = useState<EmergencyInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchInfo() {
            try {
                const res = await fetch(`http://localhost:4000/api/public/emergency/${publicId}`);
                const data = await res.json();
                if (data.success) {
                    setInfo(data.data);
                } else {
                    setError(data.message);
                }
            } catch (err) {
                setError("Could not load emergency information.");
            } finally {
                setLoading(false);
            }
        }
        fetchInfo();
    }, [publicId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-red-600 flex items-center justify-center p-6">
                <div className="text-white font-bold text-xl animate-pulse">LOADING CRITICAL DATA...</div>
            </div>
        );
    }

    if (error || !info) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-center">
                <div className="max-w-md space-y-4">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                        <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    </div>
                    <h1 className="text-2xl font-bold text-white">Profile Not Found</h1>
                    <p className="text-slate-400">The emergency profile you are looking for does not exist or has been disabled.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 font-sans">
            {/* High Visibility Header */}
            <div className="bg-red-600 p-6 text-white sticky top-0 z-50 shadow-xl border-b-4 border-red-700">
                <div className="max-w-2xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-red-600 shadow-inner">
                            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z" /></svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-black uppercase tracking-tighter leading-none italic">Medical Alert</h1>
                            <p className="text-red-100 text-xs font-bold uppercase tracking-widest mt-1 opacity-80">Official HealthTrack Emergency Profile</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="text-4xl font-black">{info.bloodGroup}</div>
                        <div className="text-[10px] font-bold uppercase opacity-80">Blood Group</div>
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto p-6 space-y-6">
                {/* Name Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-800"
                >
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Patient Name</label>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white">{info.name}</div>
                </motion.div>

                {/* Critical Alerts - High Contrast */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="p-6 rounded-3xl bg-amber-500/10 border-2 border-amber-500/30"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-white">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            </div>
                            <h2 className="font-bold text-amber-600 dark:text-amber-500 uppercase tracking-tight">Allergies</h2>
                        </div>
                        {info.allergies.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {info.allergies.map((a, i) => (
                                    <span key={i} className="px-3 py-1.5 bg-amber-500 text-white rounded-xl text-sm font-bold shadow-sm">{a}</span>
                                ))}
                            </div>
                        ) : (
                            <span className="text-slate-400 font-medium italic">No known allergies reported.</span>
                        )}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="p-6 rounded-3xl bg-indigo-500/10 border-2 border-indigo-500/30"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a2 2 0 00-1.96 1.414l-.727 2.903a2 2 0 01-1.127 1.314l-2.904.727a2 2 0 01-1.414-1.96l.477-2.387a2 2 0 00-.547-1.022L4.572 11.572a2 2 0 00-.547 1.022l-.477 2.387a2 2 0 001.96 1.414l2.903.727a2 2 0 001.314-1.127l.727-2.904a2 2 0 00-1.96-1.414l-2.387-.477a2 2 0 00-1.022.547l-3.428 3.428z" /></svg>
                            </div>
                            <h2 className="font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight">Chronic Conditions</h2>
                        </div>
                        {info.chronicConditions.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {info.chronicConditions.map((c, i) => (
                                    <span key={i} className="px-3 py-1.5 bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-sm">{c}</span>
                                ))}
                            </div>
                        ) : (
                            <span className="text-slate-400 font-medium italic">No chronic conditions listed.</span>
                        )}
                    </motion.div>
                </div>

                {/* Medications */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-800"
                >
                    <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                        ACTIVE MEDICATIONS
                    </h2>
                    {info.medications.length > 0 ? (
                        <ul className="space-y-3">
                            {info.medications.map((m, i) => (
                                <li key={i} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50">
                                    <div className="w-2 h-2 rounded-full bg-teal-500/30"></div>
                                    <span className="text-slate-700 dark:text-slate-300 font-bold">{m}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-slate-400 italic text-sm">No medications listed.</p>
                    )}
                </motion.div>

                {/* Emergency Contacts */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-4"
                >
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-1">Primary Contacts</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {info.emergencyContacts.map((contact, i) => (
                            <div key={i} className="p-4 bg-teal-500/5 dark:bg-teal-500/10 rounded-3xl border border-teal-500/20">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{contact.name}</div>
                                    <span className="text-[10px] font-bold uppercase bg-teal-500/20 text-teal-600 dark:text-teal-400 px-2 py-0.5 rounded-full">{contact.relation}</span>
                                </div>
                                <a href={`tel:${contact.phone}`} className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-bold text-lg hover:underline decoration-2 underline-offset-4">
                                    <svg className="w-5 h-5 font-bold" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" /></svg>
                                    {contact.phone}
                                </a>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Footer info */}
                <div className="pt-8 pb-12 text-center space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Last Verified: {new Date(info.lastUpdated).toLocaleString()}
                    </p>
                    <p className="text-[10px] text-slate-400 max-w-sm mx-auto">
                        This information is provided for emergency medical use only. Use extreme caution before administering treatment.
                    </p>
                </div>
            </div>
        </div>
    );
}
