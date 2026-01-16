import { useState } from "react";
import { Link } from "react-router-dom";
import { useHealthTrack } from "../context/HealthTrackContext";
import RecordList from "../components/records/RecordList";
import type { RecordType } from "../types/models";
import { motion } from "framer-motion";

const typeOptions: (RecordType | "ALL")[] = [
  "ALL",
  "PRESCRIPTION",
  "LAB_REPORT",
  "SCAN",
  "CERTIFICATE",
  "VACCINATION",
  "BILL"
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

export default function RecordsPage() {
  const { records } = useHealthTrack();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<RecordType | "ALL">("ALL");

  const filtered = records.filter((r) => {
    const matchesType =
      typeFilter === "ALL" ? true : r.type === typeFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      r.title.toLowerCase().includes(q) ||
      r.providerName.toLowerCase().includes(q) ||
      (r.tags ?? []).some((t) => t.toLowerCase().includes(q));
    return matchesType && matchesSearch;
  });

  return (
    <motion.div
      className="space-y-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
            Your Records
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Securely stored and searchable medical documents.
          </p>
        </div>
        <Link
          to="/records/upload"
          className="self-start md:self-auto px-5 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-semibold shadow-lg shadow-teal-900/20 hover:bg-teal-700 hover:shadow-teal-900/30 transition-all active:scale-95"
        >
          + Upload Record
        </Link>
      </div>

      <motion.div variants={item} className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row gap-4 md:items-center">
        <div className="relative w-full md:w-1/2 group">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-teal-500 transition-colors pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input
            className="w-full pl-11 pr-4 py-3 bg-white/50 dark:bg-slate-950/50 border border-slate-200/50 dark:border-slate-700/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 dark:focus:ring-teal-400/20 focus:border-teal-500/50 transition-all placeholder:text-slate-400 text-slate-700 dark:text-slate-200 backdrop-blur-sm"
            placeholder="Search by title, hospital, tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full md:w-56 relative group">
          <select
            className="w-full appearance-none pl-4 pr-10 py-3 bg-white/50 dark:bg-slate-950/50 border border-slate-200/50 dark:border-slate-700/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 dark:focus:ring-teal-400/20 focus:border-teal-500/50 transition-all text-slate-700 dark:text-slate-200 cursor-pointer backdrop-blur-sm"
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(e.target.value as RecordType | "ALL")
            }
          >
            {typeOptions.map((t) => (
              <option key={t} value={t} className="bg-white dark:bg-slate-900">
                {t === "ALL" ? "All types" : t.replace("_", " ")}
              </option>
            ))}
          </select>
          <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover:text-teal-500 transition-colors pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </div>
      </motion.div>

      <motion.div variants={item}>
        <RecordList records={filtered} />
      </motion.div>
    </motion.div>
  );
}
