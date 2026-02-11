// src/components/emergency/QRPreview.tsx
import { QRCodeCanvas } from "qrcode.react";
import { useHealthTrack } from "../../context/HealthTrackContext";
import { Download, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

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

  // Secure public URL for first responders
  const publicUrl = `${window.location.origin}/public/emergency/${emergencyProfile.publicId}`;

  const downloadQR = () => {
    const canvas = document.getElementById("emergency-qr") as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = url;
      link.download = `HealthTrack-Emergency-QR.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("QR Code Downloaded!");
    }
  };

  return (
    <div className="glass-panel p-6 rounded-3xl flex flex-col items-center border border-slate-200/50 dark:border-slate-800/50 shadow-xl shadow-teal-900/5">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 bg-teal-500/10 rounded-lg flex items-center justify-center text-teal-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h2M4 8h16" /></svg>
        </div>
        <h2 className="font-bold text-slate-800 dark:text-slate-100 uppercase tracking-widest text-xs">
          Universal Access QR
        </h2>
      </div>

      <div className="p-4 bg-white rounded-[2rem] mb-6 shadow-inner ring-8 ring-slate-100/50 dark:ring-slate-900/50">
        <QRCodeCanvas
          id="emergency-qr"
          value={publicUrl}
          size={200}
          includeMargin={false}
          level="H"
        />
      </div>

      <div className="space-y-4 text-center w-full">
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-[240px] mx-auto">
          Attach this QR to your physical belongings. First responders can scan it to view critical health data without needing your login.
        </p>

        <div className="p-3 bg-teal-500/5 dark:bg-teal-500/10 rounded-2xl border border-teal-500/20 break-all">
          <p className="text-[10px] uppercase font-bold text-teal-600 dark:text-teal-400 mb-1 leading-none">Public Link</p>
          <p className="text-[9px] text-slate-500 dark:text-slate-400 font-mono italic">{publicUrl}</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={downloadQR}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-teal-700 transition-all active:scale-95 shadow-lg shadow-teal-900/20"
          >
            <Download className="w-3 h-3" />
            Download QR
          </button>
          <button
            onClick={() => window.open(publicUrl, '_blank')}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
          >
            <ExternalLink className="w-3 h-3" />
            Preview
          </button>
        </div>
      </div>
    </div>
  );
}
