// src/components/records/RecordList.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import type { HealthRecord } from "../../types/models";
import { useHealthTrack } from "../../context/HealthTrackContext";
import toast from "react-hot-toast";

interface Props {
  records: HealthRecord[];
}

export default function RecordList({ records }: Props) {
  const { deleteRecord } = useHealthTrack();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (!records.length) {
    return (
      <div className="bg-white dark:bg-slate-900 dark:border dark:border-slate-800 rounded-xl shadow-sm p-4 text-sm text-slate-500 dark:text-slate-400">
        No records yet. Try uploading one.
      </div>
    );
  }

  const handleDelete = async (id: string, title: string) => {
    const ok = window.confirm(
      `Are you sure you want to delete "${title}"? This cannot be undone.`
    );
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

  return (
    <div className="bg-white dark:bg-slate-900 dark:border dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          <tr>
            <th className="px-4 py-2 text-left">Title</th>
            <th className="px-4 py-2 text-left">Type</th>
            <th className="px-4 py-2 text-left">Provider</th>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Verified</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id} className="border-t dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <td className="px-4 py-2">
                <Link
                  to={`/records/${r.id}`}
                  className="text-teal-700 dark:text-teal-400 hover:underline"
                >
                  {r.title}
                </Link>
              </td>
              <td className="px-4 py-2">{r.type}</td>
              <td className="px-4 py-2">{r.providerName}</td>
              <td className="px-4 py-2">
                {new Date(r.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-2">
                {r.blockchainVerified ? (
                  <span className="px-2 py-1 text-xs rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                    On-chain ✅
                  </span>
                ) : (
                  <span className="px-2 py-1 text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                    Not verified
                  </span>
                )}
              </td>
              <td className="px-4 py-2">
                <button
                  onClick={() => handleDelete(r.id, r.title)}
                  disabled={deletingId === r.id}
                  className="px-3 py-1 rounded-lg text-xs border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
                >
                  {deletingId === r.id ? "Deleting…" : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
