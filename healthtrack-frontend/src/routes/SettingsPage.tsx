import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [shareAnonymizedData, setShareAnonymizedData] = useState(false);
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [abhaLinked, setAbhaLinked] = useState(!!user?.abhaId);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 max-w-4xl mx-auto pb-12"
    >
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xl">
          Personalize your health experience, manage privacy, and configure system integrations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Appearance & Theme */}
        <motion.section variants={item} className="glass-panel p-6 rounded-3xl flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
            </div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 italic">Appearance</h2>
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors">
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Theme Mode</p>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tight">System Appearance</p>
              </div>
              <button
                onClick={toggleTheme}
                className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-bold uppercase tracking-widest text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
              >
                {theme === "light" ? "🌙 Dark" : "☀️ Light"}
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Preferred Language</label>
              <div className="relative group">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as "en" | "hi")}
                  className="w-full appearance-none bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-slate-800 dark:text-slate-200 cursor-pointer"
                >
                  <option value="en">English (Primary)</option>
                  <option value="hi">Hindi (Beta)</option>
                </select>
                <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-hover:text-teal-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Notifications */}
        <motion.section variants={item} className="glass-panel p-6 rounded-3xl flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            </div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 italic">Alerts</h2>
          </div>

          <div className="space-y-4">
            <div
              className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 cursor-pointer group"
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            >
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Push Notifications</p>
                <p className="text-[10px] text-slate-500 font-medium">Appointments & Medications</p>
              </div>
              <div className={`w-12 h-7 flex items-center p-1 rounded-full transition-all duration-300 ${notificationsEnabled ? 'bg-teal-500' : 'bg-slate-200 dark:bg-slate-700'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-lg transition-transform duration-300 ${notificationsEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
            </div>

            <div className="p-4 bg-teal-500/5 border border-teal-500/10 rounded-2xl">
              <p className="text-[11px] text-teal-700 dark:text-teal-400 font-medium leading-relaxed">
                Emergency SOS alerts are always enabled and cannot be silenced for safety reasons.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Security & Privacy */}
        <motion.section variants={item} className="glass-panel p-6 rounded-3xl md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 italic">Security & Privacy</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer group" onClick={() => setShareAnonymizedData(!shareAnonymizedData)}>
                <div className={`mt-1 h-5 w-5 rounded border-2 transition-colors flex items-center justify-center ${shareAnonymizedData ? 'bg-teal-500 border-teal-500' : 'border-slate-300 dark:border-slate-700'}`}>
                  {shareAnonymizedData && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Shared Insights</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Allow de-identified data to contribute to global health research. Your identity is always shielded.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">ABHA Link</p>
                  <p className="text-[10px] text-slate-500 font-medium">Health ID Integration</p>
                </div>
                <button
                  onClick={() => setAbhaLinked(!abhaLinked)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${abhaLinked ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-slate-900 text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800'}`}
                >
                  {abhaLinked ? "Verified" : "Link ID"}
                </button>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}
