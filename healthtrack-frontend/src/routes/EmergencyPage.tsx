// src/routes/EmergencyPage.tsx
import EmergencyCard from "../components/emergency/EmergencyCard";
import QRPreview from "../components/emergency/QRPreview";

export default function EmergencyPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-800">
        Emergency QR &amp; Profile
      </h1>
      <p className="text-sm text-slate-600">
        Configure your emergency information and share the QR with doctors or
        paramedics. Only minimal, life-saving data is encoded.
      </p>
      <div className="grid md:grid-cols-2 gap-4">
        <EmergencyCard />
        <QRPreview />
      </div>
    </div>
  );
}
