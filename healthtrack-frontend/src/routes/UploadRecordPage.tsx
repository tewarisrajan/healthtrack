import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHealthTrack } from "../context/HealthTrackContext";
import type { RecordType } from "../types/models";
import toast from "react-hot-toast";

const recordTypes: RecordType[] = [
  "PRESCRIPTION",
  "LAB_REPORT",
  "SCAN",
  "CERTIFICATE",
  "VACCINATION",
];

export default function UploadRecordPage() {
  const { addRecord, uploadFile } = useHealthTrack();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [type, setType] = useState<RecordType>("LAB_REPORT");
  const [providerName, setProviderName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please choose a file to attach.");
      return;
    }

    setLoading(true);
    try {
      // 1. Upload file
      const uploadedUrl = await uploadFile(file);

      // 2. Create record with URL
      await addRecord({
        title,
        type,
        providerName,
        fileUrl: uploadedUrl,
        blockchainVerified: false,
      });

      toast.success("Record uploaded successfully");
      navigate("/records");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to upload record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
        Upload a New Record
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl shadow-sm p-4 space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Title
          </label>
          <input
            className="w-full border dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., CBC Blood Test Report"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Type
            </label>
            <select
              className="w-full border dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
              value={type}
              onChange={(e) => setType(e.target.value as RecordType)}
            >
              {recordTypes.map((rt) => (
                <option key={rt} value={rt}>
                  {rt}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Provider / Hospital
            </label>
            <input
              className="w-full border dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
              value={providerName}
              onChange={(e) => setProviderName(e.target.value)}
              placeholder="e.g., Apollo Hospital"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            File
          </label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="text-sm text-slate-500 dark:text-slate-400"
            required
          />
          <p className="text-[11px] text-slate-400 mt-1">
            PDFs or images. Files will be stored locally.
          </p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 disabled:opacity-60 transition-colors"
        >
          {loading ? "Uploading..." : "Upload & Save"}
        </button>
      </form>
    </div>
  );
}
