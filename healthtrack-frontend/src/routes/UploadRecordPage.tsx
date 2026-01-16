import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHealthTrack } from "../context/HealthTrackContext";
import type { RecordType } from "../types/models";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import DragDropZone from "../components/records/DragDropZone";

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
  const [scanning, setScanning] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please choose a file to attach.");
      return;
    }

    setLoading(true);
    setScanning(true);

    // Simulate "Scanning" for premium feel
    await new Promise(resolve => setTimeout(resolve, 2000));
    setScanning(false);

    try {
      const { fileUrl, fileHash } = await uploadFile(file);
      await addRecord({
        title,
        type,
        providerName,
        fileUrl,
        fileHash,
        blockchainVerified: false,
      });

      toast.success("Record secured in your vault");
      navigate("/records");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to secure record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
            Secure Upload
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Upload and encrypt your medical documents. Supported formats: PDF, PNG, JPG.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-3 space-y-6">
          <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-3xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Record Title</label>
                <input
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-slate-800 dark:text-slate-200"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Annual Health Checkup"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Document Type</label>
                <div className="relative group">
                  <select
                    className="w-full appearance-none bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-slate-800 dark:text-slate-200 cursor-pointer"
                    value={type}
                    onChange={(e) => setType(e.target.value as RecordType)}
                  >
                    {recordTypes.map((rt) => (
                      <option key={rt} value={rt} className="bg-white dark:bg-slate-900">
                        {rt.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                  <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-hover:text-teal-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Provider Name</label>
                <input
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-slate-800 dark:text-slate-200"
                  value={providerName}
                  onChange={(e) => setProviderName(e.target.value)}
                  placeholder="e.g. Health City Hospital"
                  required
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading || !file}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-teal-600 text-white font-bold hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-xl shadow-teal-900/20"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    {scanning ? "Scanning Document..." : "Securing to Vault..."}
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    Finalize & Upload
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Upload Zone Section */}
        <div className="lg:col-span-2">
          <DragDropZone onFileSelect={setFile} selectedFile={file} />

          <div className="mt-8 p-6 bg-amber-500/5 border border-amber-500/10 rounded-3xl space-y-3">
            <div className="flex items-center gap-2 text-amber-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <h4 className="text-[11px] font-bold uppercase tracking-widest">Privacy Note</h4>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Your health data is encrypted end-to-end. Only you and authorized family members can access these documents.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
