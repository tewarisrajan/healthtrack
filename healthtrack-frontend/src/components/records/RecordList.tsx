// src/components/records/RecordList.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import type { HealthRecord } from "../../types/models";
import { useHealthTrack } from "../../context/HealthTrackContext";
import toast from "react-hot-toast";

interface Props {
  records: HealthRecord[];
}

import { motion } from "framer-motion";

interface Props {
  records: HealthRecord[];
}

export default function RecordList({ records }: Props) {
  const { deleteRecord } = useHealthTrack();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (!records.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-12 text-center rounded-2xl"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">No records found</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">Try adjusting your search or upload a new document.</p>
      </motion.div>
    );
  }

  const handleDelete = async (id: string, title: string) => {
    // ... same logic ...
    const ok = window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`);
    if (!ok) return;

    setDeletingId(id);
    try {
      await deleteRecord(id);
      toast.success("Record deleted");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to delete record");
    } finally {
      setDeletingId(null);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.03 }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200/50 dark:border-slate-700/50 text-slate-500 dark:text-slate-400 font-medium lowercase tracking-wider">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">Title</th>
              <th className="px-6 py-4 text-left font-semibold">Type</th>
              <th className="px-6 py-4 text-left font-semibold">Provider</th>
              <th className="px-6 py-4 text-left font-semibold">Date</th>
              <th className="px-6 py-4 text-left font-semibold">Status</th>
              <th className="px-6 py-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <motion.tbody
            variants={container}
            initial="hidden"
            animate="show"
            className="divide-y divide-slate-100 dark:divide-slate-800/50"
          >
            {records.map((r) => (
              <motion.tr
                key={r.id}
                variants={item}
                className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <td className="px-6 py-4">
                  <Link
                    to={`/records/${r.id}`}
                    className="font-semibold text-slate-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                  >
                    {r.title}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50">
                    {r.type.replace("_", " ")}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">{r.providerName}</td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-500 whitespace-nowrap">
                  {new Date(r.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {r.blockchainVerified ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium border border-emerald-500/20">
                      <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div>
                      Verified
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-xs font-medium">
                      Pending
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <button
                    onClick={() => handleDelete(r.id, r.title)}
                    disabled={deletingId === r.id}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all disabled:opacity-50"
                    title="Delete Record"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>
    </div>
  );
}
