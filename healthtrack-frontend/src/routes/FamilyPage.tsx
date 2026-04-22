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
      className="max-w-6xl mx-auto space-y-10 pb-20"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
              Family Circle
            </span>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              Shared Care Network
            </span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Loved Ones & <span className="italic bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Dependents</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium max-w-xl">
            Securely manage health profiles and emergency access for your inner circle.
          </p>
        </div>

        <div className="flex gap-4">
          <div className="glass-panel px-6 py-3 rounded-2xl flex flex-col items-center justify-center border-slate-200/50 dark:border-slate-800/50">
            <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">{family.length}</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Members</span>
          </div>
          <div className="glass-panel px-6 py-3 rounded-2xl flex flex-col items-center justify-center border-slate-200/50 dark:border-slate-800/50">
            <span className="text-2xl font-black text-emerald-500 leading-none">{family.filter(m => m.hasEmergencyProfile).length}</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Protected</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Family Directory Column */}
        <motion.div variants={item} className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">
              Directory
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {family.length === 0 ? (
              <div className="col-span-full glass-panel p-16 text-center rounded-[2.5rem] border-dashed border-2 border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-white dark:bg-slate-800 text-slate-300 mb-6 shadow-xl shadow-slate-900/5">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </div>
                <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-2">Build Your Circle</h3>
                <p className="text-sm text-slate-500 max-w-xs mx-auto">No members registered yet. Add your dependents to secure their health future.</p>
              </div>
            ) : (
              family.map((member) => (
                <motion.div
                  layout
                  key={member.id}
                  whileHover={{ y: -5 }}
                  className="glass-panel p-8 rounded-[2rem] group relative overflow-hidden transition-all hover:shadow-2xl hover:shadow-indigo-500/5 border-slate-200/50 dark:border-slate-800/50"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/[0.03] to-transparent pointer-events-none" />
                  
                  <div className="flex flex-col gap-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px] shadow-lg group-hover:rotate-3 transition-transform duration-500">
                          <div className="w-full h-full rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center text-indigo-600 font-black text-xl">
                            {member.name.charAt(0)}
                          </div>
                        </div>
                        <div>
                          <p className="text-lg font-black text-slate-900 dark:text-white leading-tight mb-1">
                            {member.name}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${
                              member.relation.toLowerCase().includes('child') ? 'bg-emerald-500/10 text-emerald-600' :
                              member.relation.toLowerCase().includes('spouse') ? 'bg-indigo-500/10 text-indigo-600' :
                              'bg-slate-500/10 text-slate-600'
                            }`}>
                              {member.relation}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                              {member.age} Yrs
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {member.hasEmergencyProfile ? (
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider border border-emerald-500/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            Secure SOS
                          </div>
                        ) : (
                          <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-wider border border-slate-200/50 dark:border-slate-700/50">
                            Limited Access
                          </div>
                        )}
                      </div>
                      
                      <button
                        onClick={() => toggleFamilyEmergency(member.id)}
                        className={`text-[10px] font-black uppercase tracking-[0.15em] px-4 py-2 rounded-xl transition-all shadow-sm active:scale-95 ${
                          member.hasEmergencyProfile 
                          ? "bg-rose-500/10 text-rose-600 hover:bg-rose-500/20" 
                          : "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                        }`}
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

        {/* Add Member Form Column */}
        <motion.div variants={item} className="lg:col-span-4 lg:sticky lg:top-10">
          <div className="glass-panel p-10 rounded-[2.5rem] border-slate-200/50 dark:border-slate-800/50 shadow-xl shadow-slate-900/5">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
              </div>
              <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight">
                Add Member
              </h2>
            </div>

            <form onSubmit={handleAdd} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Full Legal Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200"
                  placeholder="e.g. Sarah Miller"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Relationship</label>
                  <input
                    value={relation}
                    onChange={(e) => setRelation(e.target.value)}
                    className="w-full bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200"
                    placeholder="Spouse"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Age</label>
                  <input
                    type="number"
                    min={0}
                    value={age}
                    onChange={(e) =>
                      setAge(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    className="w-full bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200"
                    required
                  />
                </div>
              </div>

              <div className="p-5 bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 flex items-center gap-4 group cursor-pointer transition-all hover:bg-white dark:hover:bg-slate-900" onClick={() => setHasEmergencyProfile(!hasEmergencyProfile)}>
                <div className={`w-12 h-7 flex items-center p-1 rounded-full transition-all duration-300 ${hasEmergencyProfile ? 'bg-indigo-500 shadow-lg shadow-indigo-500/20' : 'bg-slate-200 dark:bg-slate-700'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ease-spring ${hasEmergencyProfile ? 'translate-x-5' : ''}`} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-black text-slate-800 dark:text-slate-200 tracking-tight">SOS Access</p>
                  <p className="text-[10px] text-slate-500 font-medium">Auto-share with ER teams</p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 px-6 py-4.5 rounded-[2rem] bg-indigo-600 text-white text-sm font-black hover:bg-indigo-700 transition-all active:scale-[0.98] shadow-2xl shadow-indigo-900/20 uppercase tracking-[0.2em]"
              >
                Create Circle Profile
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
