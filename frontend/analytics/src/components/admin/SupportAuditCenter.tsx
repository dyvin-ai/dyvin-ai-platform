import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LifeBuoy, ShieldAlert, Plus, Search, CheckCircle2, Clock, AlertTriangle, RefreshCw } from "lucide-react";
import type { SupportTicketItem, AdminAuditLogItem, CreateSupportTicketPayload } from "@/types";
import { toast } from "sonner";

interface SupportAuditCenterProps {
  tickets: SupportTicketItem[];
  auditLogs: AdminAuditLogItem[];
  isLoading?: boolean;
  onCreateTicket: (payload: CreateSupportTicketPayload) => Promise<void>;
  onRefresh?: () => void;
}

export function SupportAuditCenter({
  tickets = [],
  auditLogs = [],
  isLoading,
  onCreateTicket,
  onRefresh,
}: SupportAuditCenterProps) {
  const [activeTab, setActiveTab] = useState<"tickets" | "audit">("tickets");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [priority, setPriority] = useState<"CRITICAL" | "HIGH" | "MEDIUM" | "LOW">("MEDIUM");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredTickets = tickets.filter(
    (t) =>
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tenantName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAuditLogs = auditLogs.filter(
    (a) =>
      a.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.resource?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) {
      toast.error("Subject is required");
      return;
    }
    try {
      setIsSubmitting(true);
      await onCreateTicket({
        subject: subject.trim(),
        priority,
        description: description.trim() || undefined,
      });
      toast.success("Support ticket opened and dispatched to engineering queue.");
      setIsModalOpen(false);
      setSubject("");
      setDescription("");
    } catch (err: any) {
      toast.error(err.message || "Failed to create support ticket");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityBadge = (p: string) => {
    switch (p.toUpperCase()) {
      case "CRITICAL":
        return <Badge variant="destructive" className="text-[10px] font-mono">CRITICAL</Badge>;
      case "HIGH":
        return <Badge variant="outline" className="text-[10px] font-mono text-amber-500 border-amber-500/30 bg-amber-500/10">HIGH</Badge>;
      case "MEDIUM":
        return <Badge variant="secondary" className="text-[10px] font-mono">MEDIUM</Badge>;
      default:
        return <Badge variant="outline" className="text-[10px] font-mono text-muted-foreground">LOW</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card className="border border-border bg-card p-6 shadow-xs rounded-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <Skeleton className="h-6 w-60" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="border border-border bg-card rounded-2xl p-6 shadow-xs space-y-5">
      <CardHeader className="p-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <LifeBuoy className="size-5 text-primary shrink-0" />
            <span>Enterprise Support Center & Immutable Audit Trail</span>
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Escalation management, SLA-bounded customer tickets, and append-only control plane audit logs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              className="h-8 gap-1 text-xs border-border"
            >
              <RefreshCw className="size-3.5" />
              <span>Refresh</span>
            </Button>
          )}
          {activeTab === "tickets" && (
            <Button
              variant="default"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="h-8 gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="size-3.5" />
              <span>Create Ticket</span>
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0 space-y-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <button
            type="button"
            onClick={() => setActiveTab("tickets")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "tickets"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            Support Tickets ({tickets.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("audit")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "audit"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            Control Plane Audit Log ({auditLogs.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={
              activeTab === "tickets"
                ? "Search tickets by ID, subject, or enterprise tenant..."
                : "Search audit logs by action, actor email, or target resource..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-surface border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary transition-all"
          />
        </div>

        {/* TAB 1: Support Tickets */}
        {activeTab === "tickets" && (
          <div>
            {filteredTickets.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-border rounded-xl text-xs text-muted-foreground">
                No support tickets found matching your query.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="p-4 rounded-xl border border-border bg-muted/10 hover:border-primary/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <code className="font-mono text-xs text-muted-foreground">{ticket.id}</code>
                        <span className="font-semibold text-xs text-foreground">{ticket.subject}</span>
                        {getPriorityBadge(ticket.priority)}
                        <Badge
                          variant="outline"
                          className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 text-[10px] font-mono"
                        >
                          {ticket.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {ticket.tenantName && <span>Tenant: {ticket.tenantName}</span>}
                        {ticket.assignedTo && <span>Assignee: {ticket.assignedTo}</span>}
                        <span>{ticket.createdAt}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Audit Logs */}
        {activeTab === "audit" && (
          <div>
            {filteredAuditLogs.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-border rounded-xl text-xs text-muted-foreground">
                No audit events found matching your query.
              </div>
            ) : (
              <div className="space-y-2">
                {filteredAuditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl border border-border bg-surface text-xs font-mono flex flex-col md:flex-row md:items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <ShieldAlert className="size-3.5 text-primary shrink-0" />
                      <span className="font-bold text-foreground">{log.action}</span>
                      <span className="text-muted-foreground">by</span>
                      <span className="text-primary">{log.actor}</span>
                      {log.resource && (
                        <span className="text-muted-foreground/80 bg-muted/30 px-1.5 py-0.5 rounded text-[11px]">
                          {log.resource}
                        </span>
                      )}
                    </div>
                    <span className="text-muted-foreground text-[11px] shrink-0">
                      {log.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Create Ticket Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <form
              onSubmit={handleCreateTicket}
              className="bg-card border border-border rounded-2xl p-6 shadow-xl w-full max-w-md space-y-4"
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <LifeBuoy className="size-4 text-primary" />
                  <span>Open Engineering Support Ticket</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-muted-foreground hover:text-foreground text-xs"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-muted-foreground mb-1">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Brief summary of the issue..."
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground mb-1">Urgency / Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                  >
                    <option value="CRITICAL">Critical (Sev-1: Platform Outage)</option>
                    <option value="HIGH">High (Sev-2: Major Ingestion Failure)</option>
                    <option value="MEDIUM">Medium (General Query or Limit Increase)</option>
                    <option value="LOW">Low (Cosmetic / Documentation)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-muted-foreground mb-1">Details & Context</label>
                  <textarea
                    rows={3}
                    placeholder="Error messages, tenant IDs, affected routes, or steps to reproduce..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                  className="h-8 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  size="sm"
                  disabled={isSubmitting}
                  className="h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isSubmitting ? "Dispatching..." : "Submit Ticket"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
