import type { PromptPerformance } from "@/types";
import { TrendBadge } from "@/components/analytics/TrendBadge";
import { ArrowUpRight, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const sentimentStyles: Record<PromptPerformance["sentiment"], string> = {
  positive: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
  neutral: "bg-surface-subtle text-muted-foreground border border-border/70",
  negative: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20",
};

export function PromptTable({
  rows,
  onSelectPrompt,
}: {
  rows: PromptPerformance[];
  onSelectPrompt?: (prompt: PromptPerformance) => void;
}) {
  return (
    <div className="w-full rounded-lg border border-border bg-surface overflow-hidden">
      <div className="w-full overflow-x-auto custom-scrollbar">
        <table className="w-full min-w-[760px] border-collapse text-xs">
          <caption className="sr-only">Prompt performance metrics</caption>
          <thead>
            <tr className="border-b border-border bg-surface-subtle/70 text-left font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground select-none">
              <th scope="col" className="py-2.5 pl-4 pr-3 font-semibold">Prompt Query</th>
              <th scope="col" className="px-3 py-2.5 font-semibold">Category</th>
              <th scope="col" className="px-3 py-2.5 text-right font-semibold">Visibility</th>
              <th scope="col" className="px-3 py-2.5 text-right font-semibold">Position</th>
              <th scope="col" className="px-3 py-2.5 text-center font-semibold">Mentioned</th>
              <th scope="col" className="px-3 py-2.5 font-semibold">Sentiment</th>
              <th scope="col" className="px-3 py-2.5 pr-4 text-right font-semibold">30d Movement</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {rows.map((r) => (
              <tr
                key={r.id}
                onClick={() => onSelectPrompt && onSelectPrompt(r)}
                className="group transition-colors hover:bg-surface-subtle/70 cursor-pointer"
              >
                <th scope="row" className="max-w-[320px] py-3 pl-4 pr-3 text-left font-medium text-foreground">
                  <span className="flex items-center gap-1.5" title={r.prompt}>
                    <span className="truncate">{r.prompt}</span>
                    <ArrowUpRight
                      className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                      aria-hidden
                    />
                  </span>
                </th>
                <td className="px-3 py-3 font-mono text-[11px] text-muted-foreground">{r.category}</td>
                <td className="px-3 py-3 text-right font-mono font-semibold text-foreground tnum">{r.visibility.toFixed(1)}%</td>
                <td className="px-3 py-3 text-right font-mono text-muted-foreground tnum">
                  #{r.position.toFixed(1)}
                </td>
                <td className="px-3 py-3 text-center">
                  {r.mentioned ? (
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="size-3.5" aria-hidden />
                      Yes
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
                      <XCircle className="size-3.5" aria-hidden />
                      No
                    </span>
                  )}
                </td>
                <td className="px-3 py-3">
                  <span
                    className={cn(
                      "rounded-md px-2 py-0.5 font-mono text-[10px] font-medium capitalize",
                      sentimentStyles[r.sentiment],
                    )}
                  >
                    {r.sentiment}
                  </span>
                </td>
                <td className="px-3 py-3 pr-4 text-right">
                  <TrendBadge value={r.change} suffix="%" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
