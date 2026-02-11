import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Phone, AlertCircle, Droplets, ShieldAlert, Clock, MapPin, Share2 } from "lucide-react";

interface EmergencyInfo {
    name: string;
    bloodGroup?: string;
    allergies?: string[];
    chronicConditions?: string[];
    medications?: string[];
    emergencyContacts?: { name: string; phone: string; relation: string }[];
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

    const shareLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
                    if (navigator.share) {
                        navigator.share({
                            title: 'Emergency Location',
                            text: `I am at this location: ${mapUrl}`,
                            url: mapUrl
                        }).catch(console.error);
                    } else {
                        window.open(mapUrl, '_blank');
                    }
                },
                () => {
                    alert("Location access denied.");
                }
            );
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-red-600 flex items-center justify-center p-6">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <div className="text-white font-black text-2xl uppercase tracking-tighter italic animate-pulse">Retrieving Medical Data...</div>
                </div>
            </div>
        );
    }

    if (error || !info) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-center">
                <div className="max-w-md space-y-6">
                    <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20 shadow-2xl shadow-red-500/10">
                        <AlertCircle className="w-12 h-12 text-red-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white uppercase tracking-tight">Record Restricted</h1>
                        <p className="text-slate-400 mt-2 leading-relaxed">This emergency profile is either inactive or the link has expired. Please verify with the patient's ID card.</p>
                    </div>
                    <button onClick={() => window.location.reload()} className="px-8 py-3 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-700 transition-all border border-slate-700">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 font-sans selection:bg-red-500 selection:text-white">
            {/* Critical Status Header */}
            <div className="bg-red-600 p-6 text-white sticky top-0 z-50 shadow-[0_10px_40px_rgba(220,38,38,0.3)] border-b-4 border-red-700">
                <div className="max-w-2xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-red-600 shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)]">
                            <ShieldAlert className="w-10 h-10" fill="currentColor" strokeWidth={0} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black uppercase tracking-tighter leading-none italic mb-1">Medical Alert</h1>
                            <div className="flex items-center gap-2 text-red-100/80 text-[10px] font-bold uppercase tracking-widest leading-none">
                                <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                                Live Response Access
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="text-5xl font-black tracking-tighter leading-none">{info.bloodGroup || "??"}</div>
                        <div className="text-[10px] font-black uppercase tracking-widest opacity-80 mt-1">Blood Group</div>
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto p-6 space-y-8">
                {/* Identity Block */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative overflow-hidden bg-slate-50 dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">Patient Identification</label>
                    <div className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">{info.name}</div>
                </motion.div>

                {/* Critical Information Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Allergies Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className={`p-6 rounded-[2rem] border-2 transition-all ${info.allergies?.length ? 'bg-red-50 border-red-200 dark:bg-red-500/10 dark:border-red-500/20' : 'bg-slate-50 border-slate-100 dark:bg-slate-900 dark:border-slate-800 opacity-60'}`}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${info.allergies?.length ? 'bg-red-600 text-white' : 'bg-slate-400 text-white'}`}>
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <h2 className={`font-black uppercase tracking-tight text-lg ${info.allergies?.length ? 'text-red-700 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'}`}>Allergies</h2>
                        </div>
                        {info.allergies && info.allergies.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {info.allergies.map((a, i) => (
                                    <span key={i} className="px-4 py-2 bg-red-600 text-white rounded-2xl text-sm font-black shadow-lg shadow-red-600/20 ring-4 ring-white dark:ring-slate-900">{a}</span>
                                ))}
                            </div>
                        ) : (
                            <span className="text-slate-400 font-bold italic text-sm">No known record.</span>
                        )}
                    </motion.div>

                    {/* Conditions Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className={`p-6 rounded-[2rem] border-2 transition-all ${info.chronicConditions?.length ? 'bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20' : 'bg-slate-50 border-slate-100 dark:bg-slate-900 dark:border-slate-800 opacity-60'}`}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${info.chronicConditions?.length ? 'bg-amber-500 text-white' : 'bg-slate-400 text-white'}`}>
                                <Clock className="w-6 h-6" />
                            </div>
                            <h2 className={`font-black uppercase tracking-tight text-lg ${info.chronicConditions?.length ? 'text-amber-700 dark:text-amber-500' : 'text-slate-500 dark:text-slate-400'}`}>Chronic</h2>
                        </div>
                        {info.chronicConditions && info.chronicConditions.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {info.chronicConditions.map((c, i) => (
                                    <span key={i} className="px-4 py-2 bg-amber-500 text-white rounded-2xl text-sm font-black shadow-lg shadow-amber-500/20 ring-4 ring-white dark:ring-slate-900">{c}</span>
                                ))}
                            </div>
                        ) : (
                            <span className="text-slate-400 font-bold italic text-sm">No known record.</span>
                        )}
                    </motion.div>
                </div>

                {/* Medications List */}
                {info.medications && info.medications.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm"
                    >
                        <h2 className="text-[10px] font-black text-slate-400 dark:text-slate-500 mb-6 flex items-center gap-3 tracking-[0.2em] uppercase">
                            <Droplets className="w-4 h-4 text-teal-500" />
                            Active Medications
                        </h2>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {info.medications.map((m, i) => (
                                <li key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50">
                                    <div className="w-2.5 h-2.5 rounded-full bg-teal-500 ring-4 ring-teal-500/10"></div>
                                    <span className="text-slate-800 dark:text-slate-200 font-black text-lg">{m}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}

                {/* Emergency Hotlines / Contacts */}
                {info.emergencyContacts && info.emergencyContacts.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-4"
                    >
                        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-2">Emergency Contacts</h2>
                        <div className="grid grid-cols-1 gap-3">
                            {info.emergencyContacts.map((contact, i) => (
                                <a
                                    key={i}
                                    href={`tel:${contact.phone}`}
                                    className="group relative overflow-hidden p-6 bg-teal-600 rounded-[2rem] flex items-center justify-between shadow-xl shadow-teal-600/20 hover:bg-teal-700 transition-all active:scale-[0.98]"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/10 transition-colors"></div>
                                    <div className="relative">
                                        <div className="text-[10px] font-black text-teal-100/60 uppercase tracking-widest mb-1">{contact.relation}</div>
                                        <div className="text-2xl font-black text-white">{contact.name}</div>
                                        <div className="text-teal-100/90 font-mono font-bold mt-1 tracking-wider">{contact.phone}</div>
                                    </div>
                                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white ring-4 ring-white/10 group-hover:scale-110 transition-transform">
                                        <Phone className="w-8 h-8" fill="currentColor" strokeWidth={0} />
                                    </div>
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Action Toolbar */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                        onClick={shareLocation}
                        className="flex-1 flex items-center justify-center gap-3 p-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-3xl font-black uppercase tracking-tight hover:opacity-90 transition-all active:scale-95"
                    >
                        <MapPin className="w-6 h-6" />
                        Share Current Location
                    </button>
                    <button
                        onClick={() => {
                            if (navigator.share) {
                                navigator.share({
                                    title: `${info.name}'s Medical Profile`,
                                    url: window.location.href
                                });
                            }
                        }}
                        className="p-5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-3xl font-black hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95 border border-slate-200 dark:border-slate-700"
                    >
                        <Share2 className="w-6 h-6" />
                    </button>
                </div>

                {/* Secure Footer */}
                <div className="pt-12 pb-16 text-center space-y-4 px-4 border-t border-slate-100 dark:border-slate-900">
                    <div className="flex items-center justify-center gap-2 text-slate-400">
                        < ShieldAlert className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified Secure Data</span>
                    </div>
                    <p className="text-[10px] font-black text-slate-400/80 uppercase tracking-widest leading-relaxed">
                        Last System Verification: <span className="text-slate-600 dark:text-slate-400">{new Date(info.lastUpdated).toLocaleString()}</span>
                    </p>
                    <p className="text-[9px] text-slate-400/60 font-medium max-w-sm mx-auto leading-relaxed">
                        INTENDED FOR EMERGENCY RESPONDERS ONLY. IMPROPER USE MAY CARRY LEGAL CONSEQUENCES.
                    </p>
                </div>
            </div>
        </div>
    );
}
