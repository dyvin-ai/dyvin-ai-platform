import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { VisibilityPoint } from "@/types";
import { cn } from "@/lib/utils";

const periods = ["7d", "30d", "90d", "12mo"] as const;
const views = [
  { id: "visibility", label: "Visibility" },
  { id: "position", label: "Position" },
  { id: "sentiment", label: "Sentiment" },
] as const;

export type Period = (typeof periods)[number];
type View = (typeof views)[number]["id"];

function ToggleRow<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: readonly { id: T; label: string }[];
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex items-center gap-0.5 rounded-lg border border-border bg-surface-subtle p-0.5"
    >
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          aria-pressed={value === o.id}
          className={cn(
            "rounded-md px-2.5 py-1 text-xs font-medium transition-colors duration-150",
            value === o.id
              ? "bg-surface text-foreground shadow-[inset_0_0_0_1px_var(--border)]"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function ChartTooltip({ active, payload, label, unit }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border-strong bg-popover px-3 py-2 shadow-md">
      <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <ul className="space-y-1">
        {payload.map((p: any) => (
          <li key={p.dataKey} className="flex items-center gap-3 text-xs">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: p.stroke }}
              aria-hidden
            />
            <span className="mr-auto text-muted-foreground">{p.name}</span>
            <span className="font-mono font-medium tnum">
              {Number(p.value).toFixed(1)}
              {unit}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function VisibilityChart({
  data,
  period,
  onPeriodChange,
  compare,
}: {
  data: VisibilityPoint[];
  period: Period;
  onPeriodChange: (p: Period) => void;
  compare: boolean;
}) {
  const [view, setView] = useState<View>("visibility");
  const unit = view === "position" ? "" : "%";

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <ToggleRow
          label="View"
          value={view}
          options={views}
          onChange={(v) => setView(v as View)}
        />
        <div className="ml-auto">
          <ToggleRow
            label="Date range"
            value={period}
            options={periods.map((p) => ({ id: p, label: p }))}
            onChange={(p) => onPeriodChange(p as Period)}
          />
        </div>
      </div>

      <div className="h-[300px] w-full sm:h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid stroke="var(--grid)" vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              minTickGap={32}
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              tickFormatter={(d: string) => d.slice(5).replace("-", "/")}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={48}
              domain={view === "position" ? [1, 5] : ["dataMin - 6", "dataMax + 6"]}
              reversed={view === "position"}
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              tickFormatter={(v: number) => `${v.toFixed(0)}${unit}`}
            />
            <Tooltip
              cursor={{ stroke: "var(--border-strong)", strokeWidth: 1 }}
              content={<ChartTooltip unit={unit} />}
            />
            {/* Recharts does not traverse fragments — render a flat array of <Line>. */}
            {(view === "visibility"
              ? [
                  { key: "dyvin", name: "Dyvin", stroke: "var(--chart-1)", width: 2.25, dash: undefined },
                  ...(compare
                    ? [
                        { key: "atlas", name: "Atlas AI", stroke: "var(--chart-2)", width: 1.75, dash: "5 4" },
                        { key: "signalflow", name: "SignalFlow", stroke: "var(--chart-5)", width: 1.75, dash: "2 3" },
                      ]
                    : []),
                ]
              : [
                  {
                    key: view,
                    name: view === "position" ? "Average position" : "Sentiment",
                    stroke: "var(--chart-1)",
                    width: 2.25,
                    dash: undefined as string | undefined,
                  },
                ]
            ).map((s) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.name}
                stroke={s.stroke}
                strokeWidth={s.width}
                strokeDasharray={s.dash}
                dot={false}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
