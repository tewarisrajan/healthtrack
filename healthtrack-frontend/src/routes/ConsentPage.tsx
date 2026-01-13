import { useState } from 'react';
import { useHealthTrack } from '../context/HealthTrackContext';
import ConsentRequestList from '../components/consent/ConsentRequestList';
import type { ConsentRequest } from '../types/models';

export default function ConsentPage() {
  const { consentRequests } = useHealthTrack();
  const [requests, setRequests] = useState<ConsentRequest[]>(consentRequests);

  const updateStatus = (id: string, status: ConsentRequest['status']) => {
    setRequests(prev => prev.map(r => (r.id === id ? { ...r, status } : r)));
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-800">Consent Management</h1>
      <p className="text-sm text-slate-600">
        You are always in control. Approve or reject requests to access your health records from hospitals, doctors, or insurers.
      </p>
      <ConsentRequestList
        requests={requests}
        onApprove={id => updateStatus(id, 'APPROVED')}
        onReject={id => updateStatus(id, 'REJECTED')}
      />
    </div>
  );
}
