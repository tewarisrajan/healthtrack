import { motion } from "framer-motion";

export default function HealthScoreWidget() {
    const score = 92;

    return (
        <div className="glass-panel p-8 rounded-[2.5rem] relative overflow-hidden h-full flex flex-col items-center justify-center text-center group border-slate-200/50 dark:border-slate-800/50 shadow-sm">
            {/* Background Icon Decoration */}
            <div className="absolute -top-4 -right-4 text-teal-500/5 group-hover:text-teal-500/10 transition-colors duration-700">
                <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            </div>

            <div className="relative w-40 h-40 flex items-center justify-center mb-6">
                {/* Glow Effect */}
                <div className="absolute inset-4 rounded-full bg-teal-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                
                <svg className="w-full h-full -rotate-90 relative z-10" viewBox="0 0 100 100">
                    <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="6"
                        className="text-slate-100 dark:text-slate-800"
                    />
                    <motion.circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeLinecap="round"
                        className="text-teal-500"
                        strokeDasharray="264"
                        strokeDashoffset="264"
                        initial={{ strokeDashoffset: 264 }}
                        animate={{ strokeDashoffset: 264 - (264 * score) / 100 }}
                        transition={{ duration: 2, ease: "easeOut", delay: 0.2 }}
                    />
                </svg>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                    <motion.span 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-black text-slate-900 dark:text-white"
                    >
                        {score}%
                    </motion.span>
                    <span className="text-[10px] text-teal-600 dark:text-teal-400 font-black uppercase tracking-[0.2em] mt-1">
                        Optimal
                    </span>
                </div>
            </div>

            <div className="relative z-10">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                    Health Index
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[180px] leading-relaxed font-medium">
                    Your health vault integrity and metrics are in the optimal range.
                </p>
            </div>
            
            <div className="mt-6 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-[10px] font-black text-teal-600 uppercase tracking-widest relative z-10">
                Verified Status
            </div>
        </div>
    );
}
