interface CardProps {
  label: string;
  value: string;
  helper?: string;
}

export default function Card({ label, value, helper }: CardProps) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/90 dark:bg-slate-900/80 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-4 flex flex-col gap-1">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
          {value}
        </p>
        {helper && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {helper}
          </p>
        )}
      </div>
    </div>
  );
}
