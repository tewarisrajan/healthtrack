// src/components/emergency/QRPreview.tsx
import { QRCodeSVG } from "qrcode.react";
import { useHealthTrack } from "../../context/HealthTrackContext";

export default function QRPreview() {
  const { emergencyProfile } = useHealthTrack();

  if (!emergencyProfile) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-center justify-center text-sm text-slate-500">
        No emergency profile set yet.  
        <br />
        Use the form on the left to configure your details.
      </div>
    );
  }

  // Minimal, life-saving payload (what doctors see if they scan)
  const qrPayload = {
    type: "healthtrack_emergency_v1",
    bloodGroup: emergencyProfile.bloodGroup,
    allergies: emergencyProfile.allergies,
    chronicConditions: emergencyProfile.chronicConditions,
    medications: emergencyProfile.medications,
    emergencyContacts: emergencyProfile.emergencyContacts,
  };

  const qrValue = JSON.stringify(qrPayload);

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-center">
      <h2 className="font-semibold text-slate-800 mb-3 text-sm">
        Emergency QR Code
      </h2>

      <div className="p-3 border border-slate-200 rounded-2xl mb-3 bg-slate-50">
        <QRCodeSVG value={qrValue} size={180} includeMargin />
      </div>

      <p className="text-xs text-center text-slate-500">
        This QR encodes only minimal, life-saving information:
        <br />
        blood group, allergies, critical conditions and emergency contacts.
      </p>
      <p className="text-[10px] text-slate-400 mt-2">
        In a real deployment, this would usually contain a secure URL to your
        record instead of raw data.
      </p>
    </div>
  );
}
