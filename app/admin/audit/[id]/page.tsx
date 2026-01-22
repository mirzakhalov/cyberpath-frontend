'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { PageHeader, PageLoader } from '@/components/shared';
import { useAgentSession } from '@/hooks/use-dashboard';
import { 
  User, 
  Bot,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronDown,
  MessageSquare,
  Zap,
  Code,
  FileJson,
  Brain,
  AlertTriangle,
  Timer,
  Coins,
  ArrowRight
} from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { AgentDecision, SessionStatus, DecisionType } from '@/types';

const statusConfig: Record<SessionStatus, { icon: React.ElementType; color: string; label: string }> = {
  pending: { icon: Clock, color: 'bg-slate-100 text-slate-700 border-slate-200', label: 'Pending' },
  in_progress: { icon: Loader2, color: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Running' },
  completed: { icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-700 border-emerald-200', label: 'Completed' },
  failed: { icon: XCircle, color: 'bg-red-100 text-red-700 border-red-200', label: 'Failed' },
};

const decisionTypeConfig: Record<DecisionType, { icon: React.ElementType; color: string; label: string }> = {
  job_recommendation: { icon: Zap, color: 'bg-purple-100 text-purple-700', label: 'Job Recommendation' },
  tks_selection: { icon: Brain, color: 'bg-blue-100 text-blue-700', label: 'TKS Selection' },
  lesson_search: { icon: MessageSquare, color: 'bg-amber-100 text-amber-700', label: 'Lesson Search' },
  course_construction: { icon: Code, color: 'bg-emerald-100 text-emerald-700', label: 'Course Construction' },
  course_ordering: { icon: ArrowRight, color: 'bg-cyan-100 text-cyan-700', label: 'Course Ordering' },
  course_naming: { icon: FileJson, color: 'bg-rose-100 text-rose-700', label: 'Course Naming' },
};

function formatDuration(ms: number | null): string {
  if (ms === null) return '-';
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

function JsonViewer({ data, maxHeight = '300px' }: { data: unknown; maxHeight?: string }) {
  return (
    <ScrollArea className={`rounded-md border bg-slate-950`} style={{ maxHeight }}>
      <pre className="p-4 text-xs text-slate-100 font-mono whitespace-pre-wrap">
        {JSON.stringify(data, null, 2)}
      </pre>
    </ScrollArea>
  );
}

function DecisionCard({ decision, isExpanded, onToggle }: { 
  decision: AgentDecision; 
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const typeConfig = decisionTypeConfig[decision.decision_type] || {
    icon: MessageSquare,
    color: 'bg-slate-100 text-slate-700',
    label: decision.decision_type,
  };
  const TypeIcon = typeConfig.icon;

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <div className={cn(
        "border rounded-lg transition-colors",
        decision.is_successful ? "border-border" : "border-red-300 bg-red-50/50"
      )}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                {decision.sequence_number}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={typeConfig.color}>
                    <TypeIcon className="mr-1 h-3 w-3" />
                    {typeConfig.label}
                  </Badge>
                  {!decision.is_successful && (
                    <Badge variant="destructive">
                      <AlertTriangle className="mr-1 h-3 w-3" />
                      Failed
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Tool: <code className="bg-muted px-1 rounded">{decision.tool_name}</code>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right text-sm">
                <div className="text-muted-foreground">
                  {formatDuration(decision.duration_ms)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {(decision.input_tokens ?? 0) + (decision.output_tokens ?? 0)} tokens
                </div>
              </div>
              {decision.confidence_score !== null && (
                <Badge variant="outline">
                  {(decision.confidence_score * 100).toFixed(0)}% conf
                </Badge>
              )}
              <ChevronDown 
                className={cn(
                  "h-5 w-5 text-muted-foreground transition-transform",
                  isExpanded && "rotate-180"
                )} 
              />
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Separator />
          <div className="p-4 space-y-4">
            {/* Reasoning */}
            {decision.reasoning && (
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Reasoning
                </h4>
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                  {decision.reasoning}
                </p>
              </div>
            )}

            {/* Error Message */}
            {decision.error_message && (
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-4 w-4" />
                  Error
                </h4>
                <p className="text-sm bg-red-50 text-red-700 p-3 rounded-md border border-red-200">
                  {decision.error_message}
                </p>
              </div>
            )}

            {/* Tool Input/Output */}
            <Tabs defaultValue="input" className="w-full">
              <TabsList>
                <TabsTrigger value="input">Tool Input</TabsTrigger>
                <TabsTrigger value="output">Tool Output</TabsTrigger>
              </TabsList>
              <TabsContent value="input" className="mt-2">
                <JsonViewer data={decision.tool_input} />
              </TabsContent>
              <TabsContent value="output" className="mt-2">
                <JsonViewer data={decision.tool_output} />
              </TabsContent>
            </Tabs>

            {/* Metadata */}
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t">
              <span>Model: <code className="bg-muted px-1 rounded">{decision.model_name}</code></span>
              <span>Input tokens: {decision.input_tokens}</span>
              <span>Output tokens: {decision.output_tokens}</span>
              <span>Duration: {formatDuration(decision.duration_ms)}</span>
              <span>Time: {format(new Date(decision.created_at), 'HH:mm:ss')}</span>
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

export default function AuditDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [expandedDecisions, setExpandedDecisions] = useState<Set<string>>(new Set());
  
  const { data, isLoading } = useAgentSession(id);

  const toggleDecision = (decisionId: string) => {
    setExpandedDecisions(prev => {
      const next = new Set(prev);
      if (next.has(decisionId)) {
        next.delete(decisionId);
      } else {
        next.add(decisionId);
      }
      return next;
    });
  };

  const expandAll = () => {
    if (data?.decisions) {
      setExpandedDecisions(new Set(data.decisions.map(d => d.id)));
    }
  };

  const collapseAll = () => {
    setExpandedDecisions(new Set());
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Session not found</h2>
        <p className="text-muted-foreground mt-2">The requested AI session could not be found.</p>
        <Link href="/admin/audit">
          <Button className="mt-4">Back to Audit Log</Button>
        </Link>
      </div>
    );
  }

  const { session, decisions, summary } = data;
  const statusCfg = statusConfig[session.status];
  const StatusIcon = statusCfg.icon;

  return (
    <div>
      <PageHeader
        title="AI Session Inspection"
        description={`${session.workflow_type.replace(/_/g, ' ')} for ${session.user?.name || session.user?.email || 'Unknown user'}`}
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Audit', href: '/admin/audit' },
          { label: 'Session Details' },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={expandAll}>
              Expand All
            </Button>
            <Button variant="outline" onClick={collapseAll}>
              Collapse All
            </Button>
          </div>
        }
      />

      {/* Session Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">User</CardTitle>
          </CardHeader>
          <CardContent>
            {session.user ? (
              <Link href={`/admin/students/${session.user.id}`} className="hover:text-primary">
                <div className="font-medium">{session.user.name || 'No name'}</div>
                <div className="text-sm text-muted-foreground">{session.user.email}</div>
              </Link>
            ) : (
              <div className="text-muted-foreground">Unknown user</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className={statusCfg.color}>
              <StatusIcon className={`mr-1 h-4 w-4 ${session.status === 'in_progress' ? 'animate-spin' : ''}`} />
              {statusCfg.label}
            </Badge>
            {session.error_message && (
              <p className="text-xs text-red-600 mt-2">{session.error_message}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDuration(session.total_duration_ms)}</div>
            <div className="text-xs text-muted-foreground">
              {format(new Date(session.started_at), 'MMM d, HH:mm:ss')}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(session.estimated_cost_usd ?? 0).toFixed(4)}</div>
            <div className="text-xs text-muted-foreground">
              {(session.total_input_tokens ?? 0) + (session.total_output_tokens ?? 0)} total tokens
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Decision Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{summary.total_decisions}</div>
              <div className="text-sm text-muted-foreground">Total Decisions</div>
            </div>
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <div className="text-2xl font-bold text-emerald-700">{summary.successful_decisions}</div>
              <div className="text-sm text-emerald-600">Successful</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-700">{summary.failed_decisions}</div>
              <div className="text-sm text-red-600">Failed</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold">
                {summary.total_decisions > 0 
                  ? ((summary.successful_decisions / summary.total_decisions) * 100).toFixed(0) 
                  : 0}%
              </div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
          </div>

          {/* Decision Types Breakdown */}
          <div className="mt-4 pt-4 border-t">
            <h4 className="text-sm font-medium mb-3">Decision Types</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(summary.decision_types).map(([type, count]) => {
                const config = decisionTypeConfig[type as DecisionType];
                if (!config) return null;
                return (
                  <Badge key={type} variant="secondary" className={config.color}>
                    {config.label}: {count}
                  </Badge>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Input/Output Summary */}
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Input Summary</CardTitle>
            <CardDescription>Data provided to the AI session</CardDescription>
          </CardHeader>
          <CardContent>
            <JsonViewer data={session.input_summary} maxHeight="200px" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Output Summary</CardTitle>
            <CardDescription>Results produced by the session</CardDescription>
          </CardHeader>
          <CardContent>
            <JsonViewer data={session.output_summary} maxHeight="200px" />
          </CardContent>
        </Card>
      </div>

      {/* Decision Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Decision Timeline
          </CardTitle>
          <CardDescription>
            Step-by-step breakdown of all {decisions.length} decisions made by the AI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {decisions.map((decision) => (
              <DecisionCard
                key={decision.id}
                decision={decision}
                isExpanded={expandedDecisions.has(decision.id)}
                onToggle={() => toggleDecision(decision.id)}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

