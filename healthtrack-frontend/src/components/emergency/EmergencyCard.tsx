import { type FormEvent, useState } from "react";
import { useHealthTrack } from "../../context/HealthTrackContext";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function EmergencyCard() {
  const { emergencyProfile, updateEmergencyProfile } = useHealthTrack();
  const { user } = useAuth();

  const [bloodGroup, setBloodGroup] = useState(
    emergencyProfile?.bloodGroup ?? ""
  );
  const [allergies, setAllergies] = useState(
    emergencyProfile?.allergies.join(", ") ?? ""
  );
  const [conditions, setConditions] = useState(
    emergencyProfile?.chronicConditions.join(", ") ?? ""
  );
  const [medications, setMedications] = useState(
    emergencyProfile?.medications.join(", ") ?? ""
  );
  const [contactName, setContactName] = useState(
    emergencyProfile?.emergencyContacts[0]?.name ?? ""
  );
  const [contactRelation, setContactRelation] = useState(
    emergencyProfile?.emergencyContacts[0]?.relation ?? ""
  );
  const [contactPhone, setContactPhone] = useState(
    emergencyProfile?.emergencyContacts[0]?.phone ?? ""
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const payload = {
      bloodGroup: bloodGroup.trim(),
      allergies: allergies
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
      chronicConditions: conditions
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
      medications: medications
        .split(",")
        .map((m) => m.trim())
        .filter(Boolean),
      emergencyContacts: contactName
        ? [
            {
              name: contactName.trim(),
              relation: contactRelation.trim() || "Family",
              phone: contactPhone.trim(),
            },
          ]
        : [],
    };

    // update front-end state
    updateEmergencyProfile(payload);

    // optional: sync to backend if you wired it
    if (user) {
      try {
        await fetch(`http://localhost:4000/api/emergency/${user.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: user.name,
            ...payload,
          }),
        });
      } catch (err) {
        console.error("Failed to sync emergency profile", err);
      }
    }

    toast.success("Emergency profile updated");
  };

  const hasRisks =
    (allergies && allergies.trim().length > 0) ||
    (conditions && conditions.trim().length > 0);

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-slate-800 text-sm">
          Emergency Profile
        </h2>
        {hasRisks && (
          <span className="px-2 py-1 rounded-full bg-red-50 text-red-600 text-[11px] font-medium">
            High attention needed
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 text-sm">
        <div>
          <label className="block text-slate-700 mb-1">Blood Group</label>
          <input
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="e.g., B+"
            required
          />
        </div>

        <div>
          <label className="block text-slate-700 mb-1">
            Allergies (comma separated)
          </label>
          <input
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="e.g., Penicillin, Peanuts"
          />
        </div>

        <div>
          <label className="block text-slate-700 mb-1">
            Chronic Conditions (comma separated)
          </label>
          <input
            value={conditions}
            onChange={(e) => setConditions(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="e.g., Asthma, Diabetes"
          />
        </div>

        <div>
          <label className="block text-slate-700 mb-1">
            Medications (comma separated)
          </label>
          <input
            value={medications}
            onChange={(e) => setMedications(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="e.g., Inhaler, Metformin"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          <div>
            <label className="block text-slate-700 mb-1">
              Emergency Contact Name
            </label>
            <input
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="Mother / Father / Spouse"
            />
          </div>
          <div>
            <label className="block text-slate-700 mb-1">Relation</label>
            <input
              value={contactRelation}
              onChange={(e) => setContactRelation(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="Mother, Father, Friend"
            />
          </div>
          <div>
            <label className="block text-slate-700 mb-1">Phone</label>
            <input
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="+91-XXXXXXXXXX"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-2 px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700"
        >
          Save Emergency Profile
        </button>
      </form>
    </div>
  );
}
