import type { ModelPerformance } from "@/types";
import { TrendBadge } from "@/components/analytics/TrendBadge";
import { Cpu } from "lucide-react";

export function ModelPerformanceTable({ rows }: { rows: ModelPerformance[] }) {
  return (
    <div className="w-full rounded-lg border border-border bg-surface overflow-hidden">
      <div className="w-full overflow-x-auto custom-scrollbar">
        <table className="w-full min-w-[620px] border-collapse text-xs">
          <caption className="sr-only">AI visibility breakdown by LLM model</caption>
          <thead>
            <tr className="border-b border-border bg-surface-subtle/70 text-left font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground select-none">
              <th scope="col" className="py-2.5 pl-4 pr-3 font-semibold">AI Model</th>
              <th scope="col" className="px-3 py-2.5 text-right font-semibold">Visibility</th>
              <th scope="col" className="px-3 py-2.5 text-right font-semibold">30d Movement</th>
              <th scope="col" className="px-3 py-2.5 text-right font-semibold">Avg. Position</th>
              <th scope="col" className="px-3 py-2.5 text-right font-semibold">Mentions</th>
              <th scope="col" className="px-3 py-2.5 pr-4 text-right font-semibold">Sentiment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {rows.map((r) => (
              <tr
                key={r.id}
                className="transition-colors hover:bg-surface-subtle/70"
              >
                <th scope="row" className="py-3 pl-4 pr-3 text-left font-medium text-foreground">
                  <span className="flex items-center gap-2">
                    <Cpu className="size-3.5 text-muted-foreground" aria-hidden />
                    <span className="truncate">{r.name}</span>
                  </span>
                </th>
                <td className="px-3 py-3 text-right font-mono font-semibold text-foreground tnum">{r.visibility.toFixed(1)}%</td>
                <td className="px-3 py-3 text-right">
                  <TrendBadge value={r.change} />
                </td>
                <td className="px-3 py-3 text-right font-mono text-muted-foreground tnum">
                  #{r.avgPosition.toFixed(1)}
                </td>
                <td className="px-3 py-3 text-right font-mono text-muted-foreground tnum">
                  {r.mentions.toLocaleString()}
                </td>
                <td className="px-3 py-3 pr-4 text-right font-mono font-medium text-foreground tnum">
                  {r.sentiment}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
