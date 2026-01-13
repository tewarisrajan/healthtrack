// src/routes/RecordDetailsPage.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useHealthTrack } from "../context/HealthTrackContext";

export default function RecordDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { records } = useHealthTrack();
  const navigate = useNavigate();

  const record = records.find((r) => r.id === id);

  if (!record) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-slate-800">
          Record not found
        </h1>
        <p className="text-sm text-slate-600">
          We couldn’t find a record with id <code>{id}</code>.
        </p>
        <button
          onClick={() => navigate("/records")}
          className="px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700"
        >
          Back to records
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <button
        onClick={() => navigate(-1)}
        className="text-xs text-slate-500 hover:underline"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-semibold text-slate-800">
        {record.title}
      </h1>

      <div className="bg-white rounded-xl shadow-sm p-4 space-y-2 text-sm">
        <p>
          <span className="font-medium text-slate-700">Type: </span>
          {record.type}
        </p>
        <p>
          <span className="font-medium text-slate-700">Provider: </span>
          {record.providerName}
        </p>
        <p>
          <span className="font-medium text-slate-700">Date: </span>
          {new Date(record.createdAt).toLocaleString()}
        </p>
        <p>
          <span className="font-medium text-slate-700">Blockchain: </span>
          {record.blockchainVerified ? "Verified ✅" : "Not verified"}
        </p>
        {record.tags && record.tags.length > 0 && (
          <p>
            <span className="font-medium text-slate-700">Tags: </span>
            {record.tags.join(", ")}
          </p>
        )}
      </div>

      {record.fileUrl && (
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm font-medium text-slate-800 mb-2">
            Attached Document
          </p>
          <a
            href={record.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-block px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800"
          >
            Open file
          </a>
        </div>
      )}
    </div>
  );
}
