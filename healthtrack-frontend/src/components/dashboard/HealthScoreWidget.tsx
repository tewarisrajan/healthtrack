import { motion } from "framer-motion";

export default function HealthScoreWidget() {
    const score = 85;

    return (
        <div className="glass-card rounded-3xl p-6 relative overflow-hidden h-full flex flex-col items-center justify-center text-center group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="text-9xl">❤️</span>
            </div>

            <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-slate-100 dark:text-slate-800"
                    />
                    <motion.circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeLinecap="round"
                        className="text-teal-500"
                        strokeDasharray="283"
                        strokeDashoffset="283"
                        initial={{ strokeDashoffset: 283 }}
                        animate={{ strokeDashoffset: 283 - (283 * score) / 100 }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-slate-800 dark:text-white">
                        {score}
                    </span>
                    <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                        Good
                    </span>
                </div>
            </div>

            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
                Health Score
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[150px]">
                Based on your recent checkups.
            </p>
        </div>
    );
}
