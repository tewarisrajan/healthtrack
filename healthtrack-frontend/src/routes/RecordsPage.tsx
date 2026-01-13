import { useState } from "react";
import { Link } from "react-router-dom";
import { useHealthTrack } from "../context/HealthTrackContext";
import RecordList from "../components/records/RecordList";
import type { RecordType } from "../types/models";

const typeOptions: (RecordType | "ALL")[] = [
  "ALL",
  "PRESCRIPTION",
  "LAB_REPORT",
  "SCAN",
  "CERTIFICATE",
  "VACCINATION",
];

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
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
            Your Records
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Securely stored and searchable medical documents.
          </p>
        </div>
        <Link
          to="/records/upload"
          className="self-start md:self-auto px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700"
        >
          + Upload Record
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <input
          className="w-full md:w-1/2 border dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
          placeholder="Search by title, hospital, tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="w-full md:w-48 border dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
          value={typeFilter}
          onChange={(e) =>
            setTypeFilter(e.target.value as RecordType | "ALL")
          }
        >
          {typeOptions.map((t) => (
            <option key={t} value={t}>
              {t === "ALL" ? "All types" : t}
            </option>
          ))}
        </select>
      </div>

      <RecordList records={filtered} />
    </div>
  );
}
<div className="bg-white/90 dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-sm overflow-hidden">
  <table className="min-w-full text-sm">
    {/* ... */}
  </table>
</div>
