// src/routes/FamilyPage.tsx
import { type FormEvent, useState } from "react";
import { useHealthTrack } from "../context/HealthTrackContext";

export default function FamilyPage() {
  const { family, addFamilyMember, toggleFamilyEmergency } = useHealthTrack();
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [hasEmergencyProfile, setHasEmergencyProfile] = useState(false);

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !relation || !age) return;

    addFamilyMember({
      name,
      relation,
      age: Number(age),
      hasEmergencyProfile,
    });

    setName("");
    setRelation("");
    setAge("");
    setHasEmergencyProfile(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-800">
        Family &amp; Dependents
      </h1>
      <p className="text-sm text-slate-600">
        Manage health profiles for your parents, children, or other dependents.
        You can track whether they have emergency profiles configured in
        HealthTrack.
      </p>

      {/* Family list */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="font-semibold text-slate-800 mb-3 text-sm">
          Linked Family Members
        </h2>
        {family.length === 0 ? (
          <p className="text-sm text-slate-500">
            No family members added yet.
          </p>
        ) : (
          <ul className="divide-y">
            {family.map((member) => (
              <li
                key={member.id}
                className="py-3 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {member.name}{" "}
                    <span className="text-xs text-slate-500">
                      ({member.relation})
                    </span>
                  </p>
                  <p className="text-xs text-slate-500">
                    Age: {member.age}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={
                      "px-2 py-1 text-xs rounded-full " +
                      (member.hasEmergencyProfile
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500")
                    }
                  >
                    {member.hasEmergencyProfile
                      ? "Emergency profile set"
                      : "No emergency profile"}
                  </span>
                  <button
                    onClick={() => toggleFamilyEmergency(member.id)}
                    className="text-xs px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-50"
                  >
                    {member.hasEmergencyProfile ? "Disable" : "Enable"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add member form */}
      <div className="bg-white rounded-xl shadow-sm p-4 max-w-xl">
        <h2 className="font-semibold text-slate-800 mb-3 text-sm">
          Add Family Member
        </h2>
        <form onSubmit={handleAdd} className="space-y-3 text-sm">
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 mb-1">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm"
                placeholder="e.g., Father"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 mb-1">Relation</label>
              <input
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm"
                placeholder="Father / Mother / Son / Daughter"
                required
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 mb-1">Age</label>
              <input
                type="number"
                min={0}
                value={age}
                onChange={(e) =>
                  setAge(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="w-full border rounded-lg px-3 py-2 text-sm"
                required
              />
            </div>
            <div className="flex items-center gap-2 mt-5">
              <input
                type="checkbox"
                id="hasEmergencyProfile"
                checked={hasEmergencyProfile}
                onChange={(e) => setHasEmergencyProfile(e.target.checked)}
                className="h-4 w-4"
              />
              <label
                htmlFor="hasEmergencyProfile"
                className="text-slate-700"
              >
                Emergency profile available for this member
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="mt-2 px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700"
          >
            Add Member
          </button>
        </form>
      </div>
    </div>
  );
}
<div className="bg-white/90 dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-sm overflow-hidden">
  <table className="min-w-full text-sm">
    {/* ... */}
  </table>
</div>
