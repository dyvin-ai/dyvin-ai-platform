import type { CompetitorRow } from "@/types";
import { TrendBadge } from "@/components/analytics/TrendBadge";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function CompetitorTable({
  rows,
  onSelectCompetitor,
}: {
  rows: CompetitorRow[];
  onSelectCompetitor?: (competitor: CompetitorRow) => void;
}) {
  return (
    <div className="w-full rounded-lg border border-border bg-surface overflow-hidden">
      <div className="w-full overflow-x-auto custom-scrollbar">
        <table className="w-full min-w-[620px] border-collapse text-xs">
          <caption className="sr-only">Competitive presence and share of voice</caption>
          <thead>
            <tr className="border-b border-border bg-surface-subtle/70 text-left font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground select-none">
              <th scope="col" className="py-2.5 pl-4 pr-3 font-semibold">Tracked Brand</th>
              <th scope="col" className="px-3 py-2.5 text-right font-semibold">AI Visibility</th>
              <th scope="col" className="px-3 py-2.5 text-right font-semibold">Share of Voice</th>
              <th scope="col" className="px-3 py-2.5 text-right font-semibold">Avg. Position</th>
              <th scope="col" className="px-3 py-2.5 text-right font-semibold">Mentions</th>
              <th scope="col" className="px-3 py-2.5 pr-4 text-right font-semibold">30d Movement</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {rows.map((r) => (
              <tr
                key={r.id}
                onClick={() => onSelectCompetitor && onSelectCompetitor(r)}
                className={cn(
                  "group transition-colors hover:bg-surface-subtle/70 cursor-pointer",
                  r.isOwn && "bg-brand/5 font-medium",
                )}
              >
                <th scope="row" className="py-3 pl-4 pr-3 text-left font-medium text-foreground">
                  <span className="flex items-center gap-2">
                    <span
                      className={cn(
                        "h-4 w-1 rounded-full",
                        r.isOwn ? "bg-brand" : "bg-muted-foreground/30",
                      )}
                      aria-hidden
                    />
                    <span className="truncate">{r.brand}</span>
                    {r.isOwn && (
                      <span className="rounded-full bg-brand/10 border border-brand/20 px-1.5 py-0.2 text-[9px] font-mono font-semibold text-brand">
                        YOU
                      </span>
                    )}
                    <ArrowUpRight
                      className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                      aria-hidden
                    />
                  </span>
                </th>
                <td className="px-3 py-3 text-right font-mono font-semibold text-foreground tnum">{r.visibility.toFixed(1)}%</td>
                <td className="px-3 py-3 text-right font-mono text-muted-foreground tnum">
                  {r.shareOfVoice.toFixed(1)}%
                </td>
                <td className="px-3 py-3 text-right font-mono text-muted-foreground tnum">
                  #{r.avgPosition.toFixed(1)}
                </td>
                <td className="px-3 py-3 text-right font-mono text-muted-foreground tnum">
                  {r.mentions.toLocaleString()}
                </td>
                <td className="px-3 py-3 pr-4 text-right">
                  <TrendBadge value={r.change} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
