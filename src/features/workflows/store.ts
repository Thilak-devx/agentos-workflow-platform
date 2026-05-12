"use client";

import { useMemo } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";
import {
  PlatformActivityLog,
  WorkflowRunRecord,
  OrchestrationTaskRecord,
} from "@/features/platform/types";
import {
  advanceParsingStages,
  advanceRuntimeRecord,
  createParsingStages,
  createWorkflowBarsFromRuntime,
  createWorkflowRuntimeRecord,
} from "@/features/workflows/runtime";
import {
  WorkflowExecutionStatus,
  WorkflowParsingStage,
  WorkflowRuntimeRecord,
} from "@/features/workflows/types";
import { WorkflowGenerationResult } from "@/lib/workflow-generation";

type WorkflowRuntimeSnapshot = {
  workflowRuns: WorkflowRunRecord[];
  orchestrationTasks: OrchestrationTaskRecord[];
  activityLogs: PlatformActivityLog[];
};

type WorkflowRuntimeState = {
  hydrated: boolean;
  baseSnapshot: WorkflowRuntimeSnapshot;
  runtimeWorkflows: WorkflowRuntimeRecord[];
  activeWorkflowId: string | null;
  currentPrompt: string;
  parsingStages: WorkflowParsingStage[];
  parsingIndex: number;
  generationStatus: "idle" | "parsing" | "streaming" | "ready" | "error";
  bootstrap: (snapshot: WorkflowRuntimeSnapshot) => void;
  beginGeneration: (prompt: string) => void;
  advanceParsing: () => void;
  markStreaming: () => void;
  finalizeGeneration: (prompt: string, workflow: WorkflowGenerationResult) => WorkflowRuntimeRecord;
  markGenerationError: () => void;
  advanceExecution: () => void;
  setWorkflowStatus: (id: string, status: WorkflowExecutionStatus) => void;
  setActiveWorkflow: (id: string | null) => void;
};

function mergeWorkflowRuns(
  baseRuns: WorkflowRunRecord[],
  runtimeRuns: WorkflowRuntimeRecord[],
) {
  const runtimeIds = new Set(runtimeRuns.map((run) => run.id));
  return [
    ...runtimeRuns,
    ...baseRuns.filter((run) => !runtimeIds.has(run.id)),
  ];
}

function mergeTasks(
  baseTasks: OrchestrationTaskRecord[],
  runtimeRuns: WorkflowRuntimeRecord[],
) {
  const runtimeTasks = runtimeRuns.flatMap((run) => run.tasks);
  const runtimeIds = new Set(runtimeTasks.map((task) => task.id));
  return [
    ...runtimeTasks,
    ...baseTasks.filter((task) => !runtimeIds.has(task.id)),
  ];
}

function mergeActivity(
  baseActivity: PlatformActivityLog[],
  runtimeRuns: WorkflowRuntimeRecord[],
) {
  const runtimeActivity = runtimeRuns.flatMap((run) => run.activity);
  const runtimeIds = new Set(runtimeActivity.map((item) => item.id));
  return [
    ...runtimeActivity,
    ...baseActivity.filter((item) => !runtimeIds.has(item.id)),
  ]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 16);
}

function isSameSnapshot(
  left: WorkflowRuntimeSnapshot,
  right: WorkflowRuntimeSnapshot,
) {
  return (
    left.workflowRuns.length === right.workflowRuns.length &&
    left.orchestrationTasks.length === right.orchestrationTasks.length &&
    left.activityLogs.length === right.activityLogs.length &&
    left.workflowRuns.every((item, index) => item.id === right.workflowRuns[index]?.id) &&
    left.orchestrationTasks.every(
      (item, index) => item.id === right.orchestrationTasks[index]?.id,
    ) &&
    left.activityLogs.every((item, index) => item.id === right.activityLogs[index]?.id)
  );
}

export const useWorkflowRuntimeStore = create<WorkflowRuntimeState>()(
  persist(
    (set) => ({
      hydrated: false,
      baseSnapshot: {
        workflowRuns: [],
        orchestrationTasks: [],
        activityLogs: [],
      },
      runtimeWorkflows: [],
      activeWorkflowId: null,
      currentPrompt: "",
      parsingStages: [],
      parsingIndex: 0,
      generationStatus: "idle",
      bootstrap: (snapshot) =>
        set((state) => {
          if (isSameSnapshot(state.baseSnapshot, snapshot)) {
            return state;
          }

          if (state.hydrated) {
            return { baseSnapshot: snapshot };
          }

          return {
            hydrated: true,
            baseSnapshot: snapshot,
          };
        }),
      beginGeneration: (prompt) =>
        set({
          currentPrompt: prompt,
          parsingStages: createParsingStages(prompt),
          parsingIndex: 0,
          generationStatus: "parsing",
        }),
      advanceParsing: () =>
        set((state) => {
          if (state.generationStatus !== "parsing" || !state.parsingStages.length) {
            return state;
          }

          const nextIndex = Math.min(
            state.parsingIndex + 1,
            state.parsingStages.length - 1,
          );

          return {
            parsingIndex: nextIndex,
            parsingStages: advanceParsingStages(state.parsingStages, nextIndex),
          };
        }),
      markStreaming: () =>
        set((state) => ({
          generationStatus: "streaming",
          parsingStages: state.parsingStages.length
            ? advanceParsingStages(
                state.parsingStages,
                state.parsingStages.length - 1,
              )
            : state.parsingStages,
        })),
      finalizeGeneration: (prompt, workflow) => {
        const nextRecord = createWorkflowRuntimeRecord(prompt, workflow);
        set((state) => ({
          runtimeWorkflows: [nextRecord, ...state.runtimeWorkflows].slice(0, 12),
          activeWorkflowId: nextRecord.id,
          currentPrompt: prompt,
          generationStatus: "ready",
        }));
        return nextRecord;
      },
      markGenerationError: () =>
        set({
          generationStatus: "error",
        }),
      advanceExecution: () =>
        set((state) => ({
          runtimeWorkflows: state.runtimeWorkflows.map((record) =>
            record.runtimeStatus === "completed" ||
            record.runtimeStatus === "failed" ||
            record.runtimeStatus === "paused"
              ? record
              : advanceRuntimeRecord(record),
          ),
        })),
      setWorkflowStatus: (id, status) =>
        set((state) => ({
          runtimeWorkflows: state.runtimeWorkflows.map((record) => {
            if (record.id !== id) return record;

            if (status === "paused") {
              return {
                ...record,
                runtimeStatus: "paused",
                status: "paused",
                cadence: "Paused",
              };
            }

            if (status === "failed") {
              return {
                ...record,
                runtimeStatus: "failed",
                status: "failed",
                cadence: "Intervention",
              };
            }

            if (status === "completed") {
              return {
                ...record,
                runtimeStatus: "completed",
                status: "completed",
                cadence: "Completed",
                progress: 100,
              };
            }

            if (status === "rerouting") {
              return {
                ...record,
                runtimeStatus: "rerouting",
                status: "running",
                cadence: "Recovery lane",
              };
            }

            if (status === "running") {
              return {
                ...record,
                runtimeStatus: "running",
                status: "running",
                cadence: "Active",
              };
            }

            return record;
          }),
        })),
      setActiveWorkflow: (id) => set({ activeWorkflowId: id }),
    }),
    {
      name: "agentos-workflow-runtime",
      storage: createJSONStorage(() => window.sessionStorage),
      partialize: (state) => ({
        runtimeWorkflows: state.runtimeWorkflows,
        activeWorkflowId: state.activeWorkflowId,
        currentPrompt: state.currentPrompt,
      }),
    },
  ),
);

export function useWorkflowRuntimeData() {
  const { baseSnapshot, runtimeWorkflows, activeWorkflowId } =
    useWorkflowRuntimeStore(
      useShallow((state) => ({
        baseSnapshot: state.baseSnapshot,
        runtimeWorkflows: state.runtimeWorkflows,
        activeWorkflowId: state.activeWorkflowId,
      })),
    );

  const workflows = useMemo(
    () => mergeWorkflowRuns(baseSnapshot.workflowRuns, runtimeWorkflows),
    [baseSnapshot.workflowRuns, runtimeWorkflows],
  );
  const orchestrationTasks = useMemo(
    () => mergeTasks(baseSnapshot.orchestrationTasks, runtimeWorkflows),
    [baseSnapshot.orchestrationTasks, runtimeWorkflows],
  );
  const activityLogs = useMemo(
    () => mergeActivity(baseSnapshot.activityLogs, runtimeWorkflows),
    [baseSnapshot.activityLogs, runtimeWorkflows],
  );
  const activeWorkflow = useMemo(
    () =>
      runtimeWorkflows.find((workflow) => workflow.id === activeWorkflowId) ??
      runtimeWorkflows[0] ??
      null,
    [activeWorkflowId, runtimeWorkflows],
  );
  const workflowBars = useMemo(
    () => createWorkflowBarsFromRuntime(runtimeWorkflows),
    [runtimeWorkflows],
  );

  return {
    workflows,
    orchestrationTasks,
    activityLogs,
    activeWorkflow,
    runtimeWorkflows,
    runtimeSessions: runtimeWorkflows,
    workflowBars,
  };
}
