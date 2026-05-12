"use client";

import { useEffect, useMemo } from "react";
import { Layers3, WandSparkles } from "lucide-react";
import { ActivityBars } from "@/components/charts/activity-bars";
import { ActivityFeedCard } from "@/components/app/activity-feed-card";
import { CommandCenterControls } from "@/components/app/command-center-controls";
import { DataTableCard } from "@/components/app/data-table-card";
import { PageHeader } from "@/components/app/page-header";
import { StatusPulseCard } from "@/components/app/status-pulse-card";
import { TerminalStreamCard } from "@/components/app/terminal-stream-card";
import { WorkflowGeneratorStudio } from "@/components/app/workflow-generator-studio";
import { useOperatorSession } from "@/components/providers/operator-provider";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { useWorkflowOperations } from "@/features/platform/hooks";
import {
  useWorkflowRuntimeData,
  useWorkflowRuntimeStore,
} from "@/features/workflows/store";

const workflowTerminal = [
  "$ watch workflow.treasury_guardrail",
  "> evaluating last 1000 runs",
  "> latency envelope still within target threshold",
  "> retry pressure rerouted to backup graph",
  "> no approval deadlocks detected",
];

export default function WorkflowsPage() {
  const { operator } = useOperatorSession();
  const {
    workflows,
    orchestrationTasks,
    activityLogs,
    savedWorkflows,
  } = useWorkflowOperations(operator);
  const bootstrap = useWorkflowRuntimeStore((state) => state.bootstrap);
  const advanceExecution = useWorkflowRuntimeStore(
    (state) => state.advanceExecution,
  );
  const {
    workflows: displayedWorkflows,
    orchestrationTasks: runtimeTasks,
    activityLogs: runtimeActivity,
    activeWorkflow,
    workflowBars,
    runtimeSessions,
  } = useWorkflowRuntimeData();

  useEffect(() => {
    bootstrap({
      workflowRuns: workflows,
      orchestrationTasks,
      activityLogs,
    });
  }, [activityLogs, bootstrap, orchestrationTasks, workflows]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        advanceExecution();
      }
    }, 2400);

    return () => window.clearInterval(timer);
  }, [advanceExecution]);

  const workflowRows = displayedWorkflows.map((workflow) => ({
      id: workflow.id,
      name: workflow.name,
      cadence: workflow.cadence,
      status: workflow.status,
      lastRun: workflow.lastRun,
      agents: `${workflow.assignedAgents.length} agents`,
    }));
  const orchestrationRows = runtimeTasks.map((task) => ({
      id: task.id,
      task: task.task,
      owner: task.owner,
      state: task.state,
      eta: task.eta,
      branch: task.state === "Awaiting review" ? "Review lane" : task.state === "Executing" ? "Primary path" : "Recovery ready",
    }));
  const activityItems = runtimeActivity.slice(0, 4).map((item, index) => ({
      id: item.id,
      title: item.title,
      detail:
        index === 0
          ? `${item.detail} Approval routing remains within the current treasury envelope.`
          : index === 1
            ? `${item.detail} Recovery branches remain available if approval pressure rises.`
            : item.detail,
      time: item.time,
      tone: item.tone,
    }));
  const overviewMetrics = useMemo(() => {
    const activeCount = runtimeSessions.filter(
      (workflow) => workflow.runtimeStatus === "running",
    ).length;
    const completedCount = runtimeSessions.filter(
      (workflow) => workflow.runtimeStatus === "completed",
    ).length;
    const awaitingApprovalCount = runtimeSessions.filter(
      (workflow) => workflow.runtimeStatus === "awaiting approval",
    ).length;

    return {
      successRate:
        runtimeSessions.length > 0
          ? `${Math.max(
              94.8,
              100 -
                runtimeSessions.filter(
                  (workflow) => workflow.runtimeStatus === "failed",
                ).length *
                  2.4,
            ).toFixed(1)}%`
          : "98.4%",
      rollbackTime: activeWorkflow?.runtimeStatus === "rerouting" ? "58s" : "42s",
      approvalDepth:
        activeWorkflow?.approvalRequirement === "Dual approval" ? "2.4" : "1.7",
      activeCount,
      completedCount,
      awaitingApprovalCount,
    };
  }, [activeWorkflow, runtimeSessions]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Execution graph"
        title="Workflow orchestration"
        description="This surface is built for operators who want to see how autonomous execution actually behaves: pressure, approvals, failure paths, and recovery logic in motion."
        badge={`${workflowRows.length} workflow runs`}
        insights={[
          {
            label: "Success rate",
            value: overviewMetrics.successRate,
          },
          { label: "Rollback time", value: overviewMetrics.rollbackTime },
          { label: "Approval depth", value: overviewMetrics.approvalDepth },
          { label: "Saved plans", value: `${savedWorkflows.length}` },
        ]}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatusPulseCard
          title="Execution success"
          value={overviewMetrics.successRate}
          subtitle="Across the last 1,000 workflow runs"
          status={overviewMetrics.completedCount > 0 ? "Completing" : "Steady"}
          glow="cyan"
        />
        <StatusPulseCard
          title="Approval depth"
          value={overviewMetrics.approvalDepth}
          subtitle="Average human checkpoints per irreversible path"
          status={
            overviewMetrics.awaitingApprovalCount > 0
              ? "Review active"
              : "Lean path"
          }
          glow="violet"
        />
        <StatusPulseCard
          title="Recovery time"
          value={overviewMetrics.rollbackTime}
          subtitle="Median rollback or reroute completion time"
          status={activeWorkflow?.runtimeStatus === "rerouting" ? "Recovery live" : "Fast recovery"}
          glow="emerald"
        />
      </div>

      <WorkflowGeneratorStudio />

      <div className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
        <GlassCard className="p-6" glow="violet">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <Badge variant="violet">Execution pressure</Badge>
              <h2 className="mt-4 text-2xl font-semibold text-white">
                Throughput topology
              </h2>
            </div>
            <Layers3 className="h-5 w-5 text-cyan-100" />
          </div>
          <ActivityBars data={workflowBars} />
        </GlassCard>

        <DataTableCard
          title="Workflow execution registry"
          columns={[
            { key: "name", label: "Workflow" },
            { key: "cadence", label: "Cadence" },
            { key: "status", label: "Status" },
            { key: "agents", label: "Agents" },
            { key: "lastRun", label: "Last run", className: "text-right" },
          ]}
          rows={workflowRows}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <TerminalStreamCard
          title="Streaming workflow terminal"
          lines={activeWorkflow?.terminal.map((entry) => entry.message) ?? workflowTerminal}
        />
        <DataTableCard
          title="Active dependency chains"
          columns={[
            { key: "task", label: "Task" },
            { key: "owner", label: "Owner" },
            { key: "state", label: "State" },
            { key: "branch", label: "Routing" },
            { key: "eta", label: "ETA", className: "text-right" },
          ]}
          rows={orchestrationRows}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <ActivityFeedCard title="Workflow activity stream" items={activityItems} />
        <div className="grid gap-4">
          <CommandCenterControls />
          <GlassCard className="p-6" glow="emerald">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.08] text-cyan-100">
                <WandSparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  Operationally dense by design
                </p>
                <p className="mt-1 text-sm text-white/50">
                  The page stays legible while exposing branching execution
                  state, approvals, pressure, and recovery logic at a glance.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
