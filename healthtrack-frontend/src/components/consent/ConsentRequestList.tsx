import type { ConsentRequest } from '../../types/models';

interface Props {
  requests: ConsentRequest[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export default function ConsentRequestList({ requests, onApprove, onReject }: Props) {
  if (!requests.length) {
    return <div className="text-sm text-slate-500">No pending requests.</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm divide-y">
      {requests.map(req => (
        <div key={req.id} className="p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <p className="text-sm font-medium text-slate-800">
              {req.requesterName} ({req.requesterType.toLowerCase()})
            </p>
            <p className="text-xs text-slate-500">
              Purpose: {req.purpose} • Records: {req.requestedRecords.replace('_', ' ').toLowerCase()}
            </p>
          </div>
          {req.status === 'PENDING' ? (
            <div className="flex gap-2">
              <button
                onClick={() => onReject(req.id)}
                className="px-3 py-1 rounded-lg border border-slate-200 text-xs hover:bg-slate-50"
              >
                Reject
              </button>
              <button
                onClick={() => onApprove(req.id)}
                className="px-3 py-1 rounded-lg bg-teal-600 text-xs text-white hover:bg-teal-700"
              >
                Approve
              </button>
            </div>
          ) : (
            <span className="text-xs text-slate-500 uppercase">{req.status}</span>
          )}
        </div>
      ))}
    </div>
  );
}
