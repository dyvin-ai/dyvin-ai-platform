import { EmptyState } from "@/components/illustrations/EmptyState";
import { SectionHeading } from "@/components/analytics/Panel";

export function PhasePage({
  title,
  question,
  note,
}: {
  title: string;
  question: string;
  note: string;
}) {
  return (
    <div className="flex flex-col gap-6">
      <SectionHeading eyebrow="Dyvin" title={title} question={question} />
      <EmptyState variant="data" title="This surface is next in the build order" description={note} />
    </div>
  );
}
