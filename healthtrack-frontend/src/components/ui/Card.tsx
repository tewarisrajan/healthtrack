interface CardProps {
  label: string;
  value: string;
  helper?: string;
}

export default function Card({ label, value, helper }: CardProps) {
  return (
    <div className="glass-card rounded-2xl p-5 md:p-6 group cursor-default">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
          {label}
        </p>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-bold text-slate-800 dark:text-slate-50 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            {value}
          </p>
        </div>
        {helper && (
          <p className="text-xs text-slate-500 dark:text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
            {helper}
          </p>
        )}
      </div>
    </div>
  );
}
