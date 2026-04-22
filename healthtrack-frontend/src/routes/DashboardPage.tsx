import { useEffect } from "react";
import { useHealthTrack } from "../context/HealthTrackContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import RecordsOverTimeChart from "../components/dashboard/RecordsOverTimeChart";
import HealthScoreWidget from "../components/dashboard/HealthScoreWidget";
import QuickActions from "../components/dashboard/QuickActions";
import ConsentRequestList from "../components/consent/ConsentRequestList";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { records, consentRequests, fetchConsents, respondToConsent } = useHealthTrack();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Poll for consents
  useEffect(() => {
    fetchConsents?.(); // Initial fetch
    const interval = setInterval(() => {
      fetchConsents?.();
    }, 5000); // 5s poll for dashboard
    return () => clearInterval(interval);
  }, [fetchConsents]);

  const handleConsentResponse = async (id: string, status: "APPROVED" | "REJECTED") => {
    try {
      await respondToConsent(id, status);
    } catch (err) {
      console.error(err);
    }
  };

  // Calculate dynamic stats
  const totalRecords = records.length;
  const lastRecordDate = records.length > 0
    ? new Date(records[0].createdAt).toLocaleDateString()
    : "N/A";

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto space-y-8 pb-20"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
              Vault Active
            </span>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              Last Sync: Just Now
            </span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Overview
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Manage your medical documents and health insights.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/records/upload')}
            className="px-6 py-3 rounded-2xl bg-teal-600 text-white text-sm font-black shadow-xl shadow-teal-900/20 transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
            Upload Document
          </motion.button>
        </div>
      </div>

      {/* Real-time Consent Requests Widget */}
      {consentRequests.length > 0 && (
        <motion.div variants={item} className="glass-panel p-6 rounded-[2rem] border-teal-500/10 bg-gradient-to-br from-teal-500/[0.03] to-transparent">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black text-slate-800 dark:text-slate-100 flex items-center gap-3 uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              Security Authorizations
            </h2>
          </div>
          <ConsentRequestList
            requests={consentRequests}
            onApprove={(id) => handleConsentResponse(id, 'APPROVED')}
            onReject={(id) => handleConsentResponse(id, 'REJECTED')}
          />
        </motion.div>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Analytics & Feed (8/12) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Top Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div variants={item} className="glass-panel p-6 rounded-3xl border-slate-200/50 dark:border-slate-800/50">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Records</p>
              <div className="flex items-baseline gap-2">
                <h4 className="text-3xl font-black text-slate-900 dark:text-white">{totalRecords}</h4>
                <span className="text-[10px] text-emerald-500 font-bold tracking-tight">↑ 12%</span>
              </div>
            </motion.div>
            
            <motion.div variants={item} className="glass-panel p-6 rounded-3xl border-slate-200/50 dark:border-slate-800/50">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Last Activity</p>
              <h4 className="text-xl font-black text-slate-900 dark:text-white truncate">{lastRecordDate}</h4>
              <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tight">Recent Scan</p>
            </motion.div>

            <motion.div variants={item} className="glass-panel p-6 rounded-3xl border-slate-200/50 dark:border-slate-800/50">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Vault Status</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <h4 className="text-xl font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-tight">Secured</h4>
              </div>
              <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tight">Blockchain Verified</p>
            </motion.div>
          </div>

          {/* Records Timeline Chart */}
          <motion.div variants={item} className="glass-panel p-8 rounded-[2.5rem] border-slate-200/50 dark:border-slate-800/50">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest">
                Health Data Timeline
              </h3>
              <select className="bg-transparent text-[10px] font-black uppercase tracking-widest text-slate-400 outline-none cursor-pointer hover:text-teal-500 transition-colors">
                <option>Last 6 Months</option>
                <option>Last Year</option>
              </select>
            </div>
            <div className="h-72">
              <RecordsOverTimeChart records={records} />
            </div>
          </motion.div>

          {/* Recent Activity Feed */}
          <motion.div variants={item} className="glass-panel p-8 rounded-[2.5rem] border-slate-200/50 dark:border-slate-800/50">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest">Recent Health Vault Additions</h3>
              <button onClick={() => navigate('/records')} className="text-[10px] font-black text-teal-600 uppercase tracking-widest hover:underline">View Full Vault</button>
            </div>
            <div className="space-y-4">
              {records.slice(0, 4).map((record) => (
                <div key={record.id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/50 hover:border-teal-500/20 transition-all cursor-pointer group" onClick={() => navigate(`/records/${record.id}`)}>
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-center text-slate-400 group-hover:text-teal-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{record.title}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{record.type.replace('_', ' ')} • {new Date(record.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-slate-300 dark:text-slate-700 group-hover:text-teal-500 transition-all transform group-hover:translate-x-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                  </div>
                </div>
              ))}
              {records.length === 0 && (
                <div className="text-center py-12 px-4">
                  <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                  </div>
                  <p className="text-sm text-slate-400 font-medium italic">Your health vault is empty.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Column: Widgets & AI (4/12) */}
        <div className="lg:col-span-4 space-y-8">
          {/* Health Score Widget */}
          <motion.div variants={item}>
            <HealthScoreWidget />
          </motion.div>

          {/* Quick Actions Widget */}
          <motion.div variants={item}>
            <QuickActions />
          </motion.div>

          {/* AI Helper Teaser */}
          <motion.div 
            variants={item}
            whileHover={{ y: -5 }}
            onClick={() => navigate('/triage')}
            className="glass-panel p-8 rounded-[2.5rem] bg-slate-900 text-white cursor-pointer group shadow-2xl shadow-slate-900/20 overflow-hidden relative"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/20 blur-[60px] pointer-events-none" />
            
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative z-10">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            </div>
            <h4 className="text-xl font-black mb-2 relative z-10">AI Diagnostic <span className="text-teal-400">Assistant</span></h4>
            <p className="text-sm opacity-70 leading-relaxed relative z-10 mb-8">
              Analyze your lab results or check symptoms instantly with our medical-grade AI.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-teal-400 group-hover:gap-4 transition-all relative z-10">
              Start Consultation
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
