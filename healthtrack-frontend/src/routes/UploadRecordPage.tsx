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
  const { addRecord } = useHealthTrack();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [type, setType] = useState<RecordType>("LAB_REPORT");
  const [providerName, setProviderName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      // for now we are not actually uploading the file to backend,
      // but we still require the user to select one for UX.
      toast.error("Please choose a file to attach (demo, not uploaded yet).");
      return;
    }

    setLoading(true);
    try {
      await addRecord({
        title,
        type,
        providerName,
        // fileUrl is null in backend demo (you can integrate real storage later)
        fileUrl: null,
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
      <h1 className="text-2xl font-semibold text-slate-800">
        Upload a New Record
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm p-4 space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Title
          </label>
          <input
            className="w-full border rounded-lg px-3 py-2 text-sm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., CBC Blood Test Report"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Type
            </label>
            <select
              className="w-full border rounded-lg px-3 py-2 text-sm"
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
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Provider / Hospital
            </label>
            <input
              className="w-full border rounded-lg px-3 py-2 text-sm"
              value={providerName}
              onChange={(e) => setProviderName(e.target.value)}
              placeholder="e.g., Apollo Hospital"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            File (demo only)
          </label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="text-sm"
            required
          />
          <p className="text-[11px] text-slate-400 mt-1">
            For now the file is not uploaded to backend – we store only the
            metadata. Later this can point to cloud storage.
          </p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 disabled:opacity-60"
        >
          {loading ? "Uploading..." : "Upload & Save"}
        </button>
      </form>
    </div>
  );
}
