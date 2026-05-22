import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useHealthTrack } from "../context/HealthTrackContext";
import { motion } from "framer-motion";

export default function RecordDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { records, logRecordAccess, fetchAuditLogs, extractInsights } = useHealthTrack();
  const navigate = useNavigate();
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [isExtracting, setIsExtracting] = useState(false);

  const handleExtractInsights = async () => {
    if (!id) return;
    setIsExtracting(true);
    try {
      await extractInsights(id);
    } catch (error) {
      console.error(error);
    } finally {
      setIsExtracting(false);
    }
  };

  const record = records.find((r) => r.id === id);

  const loadLogs = async () => {
    if (!id) return;
    setLogsLoading(true);
    const logs = await fetchAuditLogs(id);
    setAuditLogs(logs);
    setLogsLoading(false);
  };

  useEffect(() => {
    if (id) {
      logRecordAccess(id, "VIEWED");
      loadLogs();
    }
  }, [id, logRecordAccess]);

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
      className="max-w-6xl mx-auto space-y-8 pb-20"
    >
      {/* Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <button
            onClick={() => navigate(-1)}
            className="group p-3 rounded-2xl bg-white dark:bg-slate-800 text-slate-400 hover:text-teal-500 transition-all border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-md"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-[10px] font-bold uppercase tracking-wider border border-teal-500/20">
                {record.type.replace("_", " ")}
              </span>
              <span className="text-slate-400 text-xs font-medium">
                {new Date(record.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
              </span>
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {record.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {record.fileUrl && (
            <>
              <a
                href={`http://localhost:4000${record.fileUrl}`}
                download
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-bold border border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                Download
              </a>
              <a
                href={`http://localhost:4000${record.fileUrl}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-teal-600 text-white text-sm font-bold hover:bg-teal-700 transition-all shadow-xl shadow-teal-900/20 active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                View Document
              </a>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-8 space-y-8">
          {/* Document Preview Card */}
          <div className="glass-panel overflow-hidden rounded-[2.5rem] border-slate-200/50 dark:border-slate-800/50">
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 p-12 min-h-[400px] flex flex-col items-center justify-center relative group">
              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.05),transparent)] pointer-events-none" />
              
              <div className="relative">
                <div className="w-32 h-32 rounded-[2.5rem] bg-white dark:bg-slate-800 shadow-2xl flex items-center justify-center text-teal-500 mb-8 transform group-hover:scale-105 group-hover:rotate-2 transition-all duration-700">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                {record.blockchainVerified && (
                  <div className="absolute -right-2 -top-2 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg border-4 border-white dark:border-slate-900">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                )}
              </div>

              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3 tracking-tight">Document Vault Secured</h3>
              <p className="text-slate-500 dark:text-slate-400 text-center max-w-sm text-sm leading-relaxed mb-8">
                Your medical record is encrypted and stored in a decentralized vault. Decrypt to view the original file.
              </p>

              <div className="flex flex-wrap justify-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  AES-256 Encrypted
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Immutable Hash
                </div>
              </div>
            </div>
          </div>

          {/* Smart Extracted Text Card */}
          {record.extractedText && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-10 rounded-[2.5rem] space-y-6 bg-gradient-to-br from-indigo-500/[0.02] to-transparent border-indigo-500/10"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                  </div>
                  <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">AI Insights & Extraction</h4>
                </div>
                <div className="flex gap-2">
                  {!record.structuredData && (
                    <button 
                      onClick={handleExtractInsights}
                      disabled={isExtracting}
                      className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-900/20 disabled:opacity-50 flex items-center gap-2"
                    >
                      {isExtracting ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          Analyzing...
                        </>
                      ) : (
                        "Extract AI Insights"
                      )}
                    </button>
                  )}
                  <button 
                    onClick={() => navigate('/triage')}
                    className="px-4 py-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:bg-indigo-500/20 transition-all"
                  >
                    Ask AI About This
                  </button>
                </div>
              </div>

              {record.structuredData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {record.structuredData.vitals && record.structuredData.vitals.length > 0 && (
                    <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                      <h5 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Vitals</h5>
                      <ul className="space-y-2">
                        {record.structuredData.vitals.map((v: any, i: number) => (
                          <li key={i} className="flex justify-between items-center text-sm">
                            <span className="text-slate-800 dark:text-slate-200 font-medium">{v.name}</span>
                            <span className="text-indigo-600 dark:text-indigo-400 font-bold">{v.value} {v.unit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {record.structuredData.medications && record.structuredData.medications.length > 0 && (
                    <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                      <h5 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Medications</h5>
                      <ul className="space-y-2">
                        {record.structuredData.medications.map((m: any, i: number) => (
                          <li key={i} className="flex flex-col text-sm border-b border-slate-100 dark:border-slate-800 last:border-0 pb-2 last:pb-0">
                            <span className="text-slate-800 dark:text-slate-200 font-bold">{m.name}</span>
                            <span className="text-slate-500 dark:text-slate-400 text-xs">{m.dosage} • {m.frequency}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {record.structuredData.diagnoses && record.structuredData.diagnoses.length > 0 && (
                    <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm md:col-span-2">
                      <h5 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Diagnoses</h5>
                      <div className="flex flex-wrap gap-2">
                        {record.structuredData.diagnoses.map((d: string, i: number) => (
                          <span key={i} className="px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg font-medium border border-red-100 dark:border-red-900/30">
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {record.structuredData.keyFindings && record.structuredData.keyFindings.length > 0 && (
                    <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm md:col-span-2">
                      <h5 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Key Findings</h5>
                      <ul className="list-disc pl-5 space-y-1">
                        {record.structuredData.keyFindings.map((f: string, i: number) => (
                          <li key={i} className="text-sm text-slate-700 dark:text-slate-300">{f}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="md:col-span-2 mt-4">
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Raw Text Record</h5>
                    <div className="relative p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                      <p className="text-xs text-slate-500 dark:text-slate-400 whitespace-pre-wrap font-mono leading-relaxed max-h-[150px] overflow-y-auto custom-scrollbar pr-2">
                        {record.extractedText}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-teal-500 rounded-3xl blur opacity-5 group-hover:opacity-10 transition duration-1000"></div>
                  <div className="relative p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-inner">
                    <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap font-mono leading-relaxed max-h-[400px] overflow-y-auto custom-scrollbar pr-4">
                      {record.extractedText}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span>Processed via OCR Engine v1.1</span>
                <span className="text-indigo-500/60 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
                  Digitally Captured
                </span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-4 space-y-8">
          {/* Information Card */}
          <div className="glass-panel p-8 rounded-[2.5rem] space-y-8">
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] block mb-2">Facility / Provider</label>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  </div>
                  <p className="text-md font-bold text-slate-800 dark:text-slate-100">{record.providerName}</p>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] block mb-2">Cryptographic Fingerprint</label>
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
                  <code className="text-[10px] text-slate-500 dark:text-slate-400 break-all font-mono">
                    {record.fileHash || "NO_HASH_AVAILABLE_FOR_LOCAL_FILE"}
                  </code>
                </div>
              </div>

              {record.tags && record.tags.length > 0 && (
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] block mb-3">Labels</label>
                  <div className="flex flex-wrap gap-2">
                    {record.tags.map(tag => (
                      <span key={tag} className="px-3 py-1.5 rounded-xl bg-teal-500/5 text-teal-600 dark:text-teal-400 text-[11px] font-bold border border-teal-500/10">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-8 border-t border-slate-100 dark:border-slate-800/50">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${record.blockchainVerified ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    {record.blockchainVerified ? 'Integrity Shield Active' : 'Basic Security'}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    {record.blockchainVerified 
                      ? 'This document is anchored to the medical ledger.' 
                      : 'Standard encryption is active on this record.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Timeline Card */}
          <div className="glass-panel p-8 rounded-[2.5rem] space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Activity Logs</h3>
              <button onClick={loadLogs} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all text-slate-400 hover:text-teal-500">
                <svg className={`w-4 h-4 ${logsLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              </button>
            </div>

            <div className="relative space-y-8 pr-2">
              {/* Vertical line with gradient */}
              <div className="absolute left-[13px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-teal-500/50 via-slate-100 to-slate-100 dark:via-slate-800 dark:to-slate-800" />

              {auditLogs.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-[11px] text-slate-400 italic">No access logs found.</p>
                </div>
              ) : (
                auditLogs.map((log, idx) => (
                  <motion.div
                    key={log._id || idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="relative pl-10 group"
                  >
                    {/* Timeline Node */}
                    <div className={`absolute left-0 top-0.5 w-[28px] h-[28px] -translate-x-[2px] rounded-xl border-4 border-white dark:border-slate-950 flex items-center justify-center shadow-lg transition-all group-hover:scale-110 z-10 ${
                      log.action === 'VIEWED' ? 'bg-teal-500 text-white' : 
                      log.action === 'CREATED' ? 'bg-emerald-500 text-white' :
                      'bg-slate-400 text-white'
                    }`}>
                      {log.action === 'VIEWED' ? (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      ) : log.action === 'CREATED' ? (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-black text-slate-800 dark:text-slate-100 tracking-tight">
                          {log.action === 'VIEWED' ? 'Vault Accessed' : 
                           log.action === 'CREATED' ? 'Record Created' : 
                           log.action}
                        </p>
                        <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        by <span className="text-teal-600 dark:text-teal-400 font-black">{log.username}</span>
                      </p>
                      
                      <div className="flex items-center gap-1.5 mt-2">
                        <div className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                          {new Date(log.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        {log.action === 'VIEWED' && (
                          <div className="px-2 py-0.5 rounded-md bg-teal-500/5 border border-teal-500/10 text-[9px] font-bold text-teal-600 uppercase tracking-widest">
                            Secure View
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
