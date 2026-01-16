import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useHealthTrack } from "../context/HealthTrackContext";
import { motion } from "framer-motion";

export default function RecordDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { records, logRecordAccess, fetchAuditLogs } = useHealthTrack();
  const navigate = useNavigate();
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);

  const record = records.find((r) => r.id === id);

  useEffect(() => {
    if (id) {
      logRecordAccess(id, "VIEWED");
      loadLogs();
    }
  }, [id]);

  const loadLogs = async () => {
    if (!id) return;
    setLogsLoading(true);
    const logs = await fetchAuditLogs(id);
    setAuditLogs(logs);
    setLogsLoading(false);
  };

  if (!record) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-8 text-center rounded-2xl max-w-md mx-auto"
      >
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Record not found
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          We couldn’t find a record with ID <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">{id}</code>.
        </p>
        <button
          onClick={() => navigate("/records")}
          className="w-full px-4 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-900/20"
        >
          Back to list
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-6 pb-12"
    >
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-white/50 dark:bg-slate-800/50 text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-white dark:hover:bg-slate-800 transition-all border border-slate-200/50 dark:border-slate-700/50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
            {record.title}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Added on {new Date(record.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Metadata & Audit Section */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Details</h3>

            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Document Type</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight">{record.type.replace("_", " ")}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Provider / Facility</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight">{record.providerName}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Security Status</p>
                {record.blockchainVerified ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 mt-1 rounded-lg bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase border border-emerald-500/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    Blockchain Verified
                  </span>
                ) : (
                  <span className="inline-flex px-2.5 py-1 mt-1 rounded-lg bg-amber-500/10 text-amber-600 text-[10px] font-bold uppercase border border-amber-500/20">
                    Not Encrypted
                  </span>
                )}
              </div>
            </div>

            {record.tags && record.tags.length > 0 && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/50">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-3">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {record.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 rounded-lg bg-teal-500/5 text-teal-600 dark:text-teal-400 text-[10px] font-bold border border-teal-500/10">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Access Timeline */}
          <div className="glass-panel p-6 rounded-3xl">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center justify-between">
              Access Timeline
              <button onClick={loadLogs} className="p-1 hover:text-teal-500 transition-colors">
                <svg className={`w-3 h-3 ${logsLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              </button>
            </h3>

            <div className="relative space-y-6">
              {/* Vertical line */}
              <div className="absolute left-[9px] top-2 bottom-2 w-[1px] bg-slate-100 dark:bg-slate-800" />

              {auditLogs.length === 0 ? (
                <p className="text-[10px] text-slate-400 ml-6 italic">No access logs found.</p>
              ) : (
                auditLogs.map((log, idx) => (
                  <motion.div
                    key={log._id || idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="relative pl-6 flex flex-col gap-1"
                  >
                    <div className={`absolute left-0 top-1.5 w-[19px] h-[19px] -translate-x-1/2 rounded-full border-2 border-white dark:border-slate-950 flex items-center justify-center ${log.action === 'VIEWED' ? 'bg-teal-500' : 'bg-slate-400'
                      }`}>
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {log.action === 'VIEWED' ? 'Accessed by' : log.action} <span className="text-teal-600 dark:text-teal-400">{log.username}</span>
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(log.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </p>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* View/Action Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-8 rounded-3xl min-h-[500px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Security Vault Preview</h3>
              {record.fileUrl && (
                <div className="flex gap-2">
                  <a
                    href={`http://localhost:4000${record.fileUrl}`}
                    download
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-2 border border-slate-200/50 dark:border-slate-700/50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    Download
                  </a>
                  <a
                    href={`http://localhost:4000${record.fileUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition-all flex items-center gap-2 shadow-lg shadow-teal-900/20"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    Decrypt & View
                  </a>
                </div>
              )}
            </div>

            <div className="flex-1 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-12 text-center group transition-all hover:bg-teal-500/5 hover:border-teal-500/20">
              <div className="w-24 h-24 rounded-[2rem] bg-white dark:bg-slate-800 shadow-2xl flex items-center justify-center text-teal-500 mb-6 group-hover:scale-110 transition-all duration-500 rotate-3 group-hover:rotate-0">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              </div>
              <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 italic">Secured by Encryption</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                For your privacy, document previews are disabled. This record is hashed and anchored to the medical blockchain for absolute authenticity.
              </p>
              <div className="mt-8 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                Protected via End-to-End Encryption
              </div>
            </div>
          </div>

          {/* Verification Box */}
          <div className="glass-panel p-6 rounded-3xl border border-teal-500/10 bg-gradient-to-br from-teal-500/5 to-transparent">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Integrity Shield</h4>
                <p className="text-xs text-slate-500">Every access is timestamped and immutable. Your health data is your own.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
