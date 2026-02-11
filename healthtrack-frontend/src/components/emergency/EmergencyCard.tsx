import { type FormEvent, useState } from "react";
import { useHealthTrack } from "../../context/HealthTrackContext";
import toast from "react-hot-toast";
import { type EmergencyProfile } from "../../types/models";

export default function EmergencyCard() {
  const { emergencyProfile, updateEmergencyProfile } = useHealthTrack();

  const [bloodGroup, setBloodGroup] = useState(emergencyProfile?.bloodGroup ?? "");
  const [allergies, setAllergies] = useState(emergencyProfile?.allergies.join(", ") ?? "");
  const [conditions, setConditions] = useState(emergencyProfile?.chronicConditions.join(", ") ?? "");
  const [medications] = useState(emergencyProfile?.medications.join(", ") ?? "");
  const [visibility, setVisibility] = useState(emergencyProfile?.visibility ?? {
    bloodGroup: true,
    allergies: true,
    chronicConditions: true,
    medications: true,
    emergencyContacts: true,
  });

  const [contactName, setContactName] = useState(emergencyProfile?.emergencyContacts[0]?.name ?? "");
  const [contactRelation] = useState(emergencyProfile?.emergencyContacts[0]?.relation ?? "");
  const [contactPhone, setContactPhone] = useState(emergencyProfile?.emergencyContacts[0]?.phone ?? "");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const payload: EmergencyProfile = {
      bloodGroup: bloodGroup.trim(),
      allergies: allergies.split(",").map((a) => a.trim()).filter(Boolean),
      chronicConditions: conditions.split(",").map((c) => c.trim()).filter(Boolean),
      medications: medications.split(",").map((m) => m.trim()).filter(Boolean),
      emergencyContacts: contactName
        ? [
          {
            name: contactName.trim(),
            relation: contactRelation.trim() || "Family",
            phone: contactPhone.trim(),
          },
        ]
        : [],
      visibility,
    };

    try {
      await toast.promise(updateEmergencyProfile(payload), {
        loading: "Saving Profile...",
        success: "Emergency Profile Secured",
        error: "Failed to save profile",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const toggleVisibility = (key: keyof typeof visibility) => {
    setVisibility(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const hasRisks =
    (allergies && allergies.trim().length > 0) ||
    (conditions && conditions.trim().length > 0);

  const VisibilityToggle = ({ label, field }: { label: string, field: keyof typeof visibility }) => (
    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label} Public Visibility</span>
      <button
        type="button"
        onClick={() => toggleVisibility(field)}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${visibility[field] ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-700'
          }`}
      >
        <span
          className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${visibility[field] ? 'translate-x-5' : 'translate-x-1'
            }`}
        />
      </button>
    </div>
  );

  return (
    <div className="glass-panel p-6 rounded-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 italic">
          Emergency Essentials
        </h2>
        {hasRisks && (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-bold uppercase tracking-tight border border-red-500/20">
            <div className="w-1 h-1 rounded-full bg-red-500 animate-pulse"></div>
            High Attention
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between px-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Blood Group</label>
            </div>
            <input
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-slate-800 dark:text-slate-200"
              placeholder="e.g., B+"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Allergies</label>
            <input
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-slate-800 dark:text-slate-200"
              placeholder="Penicillin, Peanuts"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Chronic Conditions</label>
          <textarea
            value={conditions}
            onChange={(e) => setConditions(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-slate-800 dark:text-slate-200 min-h-[80px] resize-none"
            placeholder="Asthma, Diabetes..."
          />
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/50">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest italic">Emergency Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl px-4 py-3 text-sm focus:outline-none text-slate-800 dark:text-slate-200"
              placeholder="Full Name"
            />
            <input
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl px-4 py-3 text-sm focus:outline-none text-slate-800 dark:text-slate-200"
              placeholder="Phone Number"
            />
          </div>
        </div>

        {/* Public Visibility Settings */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/50 space-y-3">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest italic mb-2 px-1">
            Privacy Control (Public QR)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <VisibilityToggle label="Blood" field="bloodGroup" />
            <VisibilityToggle label="Allergies" field="allergies" />
            <VisibilityToggle label="Chronic" field="chronicConditions" />
            <VisibilityToggle label="Meds" field="medications" />
            <VisibilityToggle label="Contacts" field="emergencyContacts" />
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-2 px-4 py-3.5 rounded-2xl bg-teal-600 text-white text-sm font-bold hover:bg-teal-700 transition-all active:scale-[0.98] shadow-lg shadow-teal-900/20"
        >
          Secure Emergency Data
        </button>
      </form>
    </div>
  );
}
