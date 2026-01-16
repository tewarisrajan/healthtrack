import { type FormEvent, useState } from "react";
import { useHealthTrack } from "../context/HealthTrackContext";
import { motion } from "framer-motion";

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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-5xl mx-auto space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
          Family & Dependents
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-2xl">
          Securely manage health profiles for your loved ones. Track emergency readiness and maintain linked medical records.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Family list */}
        <motion.div variants={item} className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 italic">
              Linked Members
            </h2>
            <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              {family.length} Registered
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {family.length === 0 ? (
              <div className="col-span-full glass-panel p-12 text-center rounded-3xl">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-slate-50 dark:bg-slate-900 text-slate-400 mb-4 border border-slate-100 dark:border-slate-800">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </div>
                <h3 className="text-slate-800 dark:text-slate-200 font-bold">No members yet</h3>
                <p className="text-sm text-slate-500">Your family directory is empty.</p>
              </div>
            ) : (
              family.map((member) => (
                <motion.div
                  layout
                  key={member.id}
                  className="glass-card p-6 rounded-3xl group relative overflow-hidden"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-600 flex items-center justify-center font-bold">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white leading-tight">
                            {member.name}
                          </p>
                          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                            {member.relation} • {member.age} yrs
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {member.hasEmergencyProfile ? (
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-tight border border-emerald-500/20">
                            <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div>
                            Secure
                          </div>
                        ) : (
                          <div className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-tight border border-slate-200/50 dark:border-slate-700/50">
                            At Risk
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => toggleFamilyEmergency(member.id)}
                        className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        {member.hasEmergencyProfile ? "Disable SOS" : "Enable SOS"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Add member form */}
        <motion.div variants={item}>
          <div className="glass-panel p-6 rounded-3xl sticky top-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 italic">
              New Member
            </h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-slate-800 dark:text-slate-200"
                  placeholder="Legal Name"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Relation</label>
                  <input
                    value={relation}
                    onChange={(e) => setRelation(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-slate-800 dark:text-slate-200"
                    placeholder="e.g. Spouse"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Age</label>
                  <input
                    type="number"
                    min={0}
                    value={age}
                    onChange={(e) =>
                      setAge(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-slate-800 dark:text-slate-200"
                    required
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 flex items-center gap-3 group cursor-pointer" onClick={() => setHasEmergencyProfile(!hasEmergencyProfile)}>
                <div className={`w-10 h-6 flex items-center p-1 rounded-full transition-colors ${hasEmergencyProfile ? 'bg-teal-500' : 'bg-slate-200 dark:bg-slate-700'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${hasEmergencyProfile ? 'translate-x-4' : ''}`} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">Emergency Access</p>
                  <p className="text-[10px] text-slate-500">Provide medical info to ER</p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 px-4 py-3.5 rounded-2xl bg-teal-600 text-white text-sm font-bold hover:bg-teal-700 transition-all active:scale-[0.98] shadow-lg shadow-teal-900/20"
              >
                Create Profile
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
