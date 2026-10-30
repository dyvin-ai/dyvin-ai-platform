import type { AgentTask } from "@/types";
import { Slide } from "./Slide";
import { icons } from "@/lib/icons";

export function AgentSummarySlide({ task }: { task: AgentTask }) {
  return (
    <Slide>
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-surface-subtle">
            <icons.agents className="size-4 text-muted-foreground" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{task.agent}</p>
            <p className="truncate text-xs text-muted-foreground">Analyzing: {task.subject}</p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-surface-subtle px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
          {task.status === "running" ? "Running" : "Complete"}
        </span>
      </header>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Progress</span>
          <span className="font-mono tnum">{task.progress}%</span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-subtle">
          <div
            className="h-full rounded-full bg-brand transition-[width] duration-200"
            style={{ width: `${task.progress}%` }}
          />
        </div>
      </div>

      <ul className="mt-4 grid gap-1.5">
        {task.results.map((r) => (
          <li key={r} className="flex items-center gap-2 text-[13px] text-foreground/90">
            <icons.success className="size-3.5 shrink-0 text-success" aria-hidden />
            {r}
          </li>
        ))}
      </ul>
    </Slide>
  );
}
