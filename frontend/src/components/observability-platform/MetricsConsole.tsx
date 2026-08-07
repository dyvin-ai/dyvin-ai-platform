import React from 'react';
import { Card, CardHeader, CardTitle } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { Terminal, Cpu, Database, Server } from 'lucide-react';

export function MetricsConsole() {
  const SAMPLE_METRICS = [
    '# HELP dyvin_scans_total Total scans executed by engine',
    '# TYPE dyvin_scans_total counter',
    'dyvin_scans_total{tenant="acme-corp",engine="gpt4o"} 142800',
    'dyvin_scans_total{tenant="globaltech",engine="claude35"} 84200',
    '# HELP dyvin_api_latency_seconds_bucket API latency histogram',
    'dyvin_api_latency_seconds_bucket{le="0.1"} 89421',
    'dyvin_api_latency_seconds_bucket{le="0.5"} 98410',
    'dyvin_api_latency_seconds_bucket{le="+Inf"} 99980',
    '# HELP dyvin_bullmq_queue_depth Active jobs in BullMQ',
    'dyvin_bullmq_queue_depth{queue="scans_v2"} 0',
  ];

  return (
    <Card className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4 font-mono text-xs">
      <CardHeader className="p-0 flex flex-row items-center justify-between font-sans">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Terminal className="w-5 h-5 text-indigo-400" /> Prometheus Telemetry & OpenTelemetry Stream
        </CardTitle>
        <Badge variant="outline" className="font-mono">
          GET /metrics (text/plain; version=0.0.4)
        </Badge>
      </CardHeader>

      <div className="p-4 rounded-xl border border-border bg-black/80 text-emerald-400 space-y-1.5 overflow-x-auto max-h-[220px]">
        {SAMPLE_METRICS.map((line, idx) => (
          <div key={idx} className={line.startsWith('#') ? 'text-muted-foreground italic' : ''}>
            {line}
          </div>
        ))}
      </div>
    </Card>
  );
}
