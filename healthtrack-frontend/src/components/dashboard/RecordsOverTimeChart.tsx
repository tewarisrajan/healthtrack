import type { HealthRecord } from "../../types/models";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "../../context/ThemeContext";

interface Props {
  records: HealthRecord[];
}

function buildChartData(records: HealthRecord[]) {
  const map = new Map<string, number>();

  records.forEach((r) => {
    const d = new Date(r.createdAt);
    const key = `${d.toLocaleString("default", {
      month: "short",
    })} ${d.getFullYear().toString().slice(-2)}`;
    map.set(key, (map.get(key) ?? 0) + 1);
  });

  return Array.from(map.entries()).map(([name, count]) => ({
    name,
    count,
  }));
}

export default function RecordsOverTimeChart({ records }: Props) {
  const { theme } = useTheme();
  const data = buildChartData(records);
  const isDark = theme === "dark";

  if (!data.length) {
    return (
      <div className="text-sm text-slate-500">
        No records yet. Upload a few to see trends here.
      </div>
    );
  }

  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorRecords" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={isDark ? "#2dd4bf" : "#0f766e"}
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor={isDark ? "#2dd4bf" : "#0f766e"}
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: isDark ? "#94a3b8" : "#64748b" }}
            axisLine={{ stroke: isDark ? "#334155" : "#cbd5e1" }}
            tickLine={{ stroke: isDark ? "#334155" : "#cbd5e1" }}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11, fill: isDark ? "#94a3b8" : "#64748b" }}
            axisLine={{ stroke: isDark ? "#334155" : "#cbd5e1" }}
            tickLine={{ stroke: isDark ? "#334155" : "#cbd5e1" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? "#1e293b" : "#fff",
              borderColor: isDark ? "#334155" : "#e2e8f0",
              color: isDark ? "#f1f5f9" : "#0f172a",
              borderRadius: "8px",
            }}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke={isDark ? "#2dd4bf" : "#0f766e"}
            fillOpacity={1}
            fill="url(#colorRecords)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
