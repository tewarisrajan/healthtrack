import { useEffect } from 'react';
import { useHealthTrack } from '../context/HealthTrackContext';
import ConsentRequestList from '../components/consent/ConsentRequestList';

export default function ConsentPage() {
  const { consentRequests, respondToConsent, fetchConsents } = useHealthTrack();

  useEffect(() => {
    // Poll for new requests every 10 seconds
    const interval = setInterval(() => {
      fetchConsents?.();
    }, 10000);
    return () => clearInterval(interval);

    try {
      await respondToConsent(id, status);
    } catch (err) {
      console.error(err);
      // toast or alert would go here
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-800">Consent Management</h1>
      <p className="text-sm text-slate-600">
        You are always in control. Approve or reject requests to access your health records from hospitals, doctors, or insurers.
      </p>
      <ConsentRequestList
        requests={consentRequests}
        onApprove={id => handleUpdate(id, 'APPROVED')}
        onReject={id => handleUpdate(id, 'REJECTED')}
      />
    </div>
  );
}
